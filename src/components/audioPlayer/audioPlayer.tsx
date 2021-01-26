import { Howler } from "howler";
import React from "react";
import { useAudioPlayer } from "react-use-audio-player";
import SiriWave from "siriwave";

import { Loader } from "./../";
import Wave from "./wave";

let taskHandle: number | undefined = 0;

const RA = (f: number) =>
    (12194 ** 2 * f ** 4) /
    ((f ** 2 + 20.6 ** 2) *
        Math.sqrt((f ** 2 + 107.7 ** 2) * (f ** 2 + 737.9 ** 2)) *
        (f ** 2 + 12194 ** 2));
const A = (f: number) => 20 * Math.log10(RA(f)) + 2.0;

const Test = () => {
    const { togglePlayPause, ready, playing } = useAudioPlayer({
        src: "/song.mp3",
        format: ["mp3"],
        autoplay: false,
        onend: () => console.warn("sound has ended!"),
    });
    const [amplitude, setAmplitude] = React.useState(0);
    const [speed, setSpeed] = React.useState(0);

    const waveRef = React.useRef<SiriWave>(null);

    React.useEffect(() => {
        if (playing) {
            initAudio();
        } else {
            if (taskHandle) {
                cancelAnimationFrame(taskHandle);
                taskHandle = undefined;
            }
            setAmplitude(0);
            setSpeed(0);
        }
    }, [playing]);

    const initAudio = () => {
        const analyser = Howler.ctx.createAnalyser();

        // Connect master gain to analyzer
        Howler.masterGain.connect(analyser);

        run(analyser);
    };

    const run = (analyser: AnalyserNode) => {
        const approxVisualisationUpdateFrequency = 5;

        const sampleRate = analyser.context.sampleRate;

        const totalNumberOfSamples = sampleRate / approxVisualisationUpdateFrequency; // e.g. 48000 / 5 = 9600

        analyser.fftSize = 2 ** Math.floor(Math.log2(totalNumberOfSamples));

        const uint8TodB = (byteLevel: number) =>
            (byteLevel / 255) * (analyser.maxDecibels - analyser.minDecibels) +
            analyser.minDecibels;

        // console.warn(`frequency bins: ${analyser.frequencyBinCount}`);

        const weightings = [-100];
        for (let i = 1; i < analyser.frequencyBinCount; i++) {
            weightings[i] = A((i * sampleRate) / 2 / analyser.frequencyBinCount);
        }

        // array for frequency data.
        // holds Number.NEGATIVE_INFINITY, [0 = -100dB, ..., 255 = -30 dB]
        const spectrum = new Uint8Array(analyser.frequencyBinCount);
        const dBASpectrum = new Float32Array(analyser.frequencyBinCount);

        const waveForm = new Uint8Array(analyser.frequencyBinCount);

        const updateAnimation = (timestamp: number) => {
            taskHandle = undefined;
            // copy frequency data to spectrum from analyser.
            // holds Number.NEGATIVE_INFINITY, [0 = -100dB, ..., 255 = -30 dB]
            analyser.getByteFrequencyData(spectrum);
            spectrum.forEach((byteLevel, idx) => {
                dBASpectrum[idx] = uint8TodB(byteLevel) + weightings[idx];
            });

            const highestPerceptibleFrequencyBin = dBASpectrum.reduce(
                (acc, y, idx) => (y > -90 ? idx : acc),
                0
            );
            // S = ∑ s_i
            const totaldBAPower = dBASpectrum.reduce((acc, y) => acc + y);
            // s⍉ = ∑ s_i ∙ i / ∑ s_i
            const meanFrequencyBin =
                dBASpectrum.reduce((acc, y, idx) => acc + y * idx) / totaldBAPower;
            const highestPowerBin = dBASpectrum.reduce(
                ([maxPower, iMax], y, idx) => (y > maxPower ? [y, idx] : [maxPower, iMax]),
                [-120, 0]
            )[1];
            const highestDetectedFrequency =
                highestPerceptibleFrequencyBin * (sampleRate / 2 / analyser.frequencyBinCount);
            const meanFrequency = meanFrequencyBin * (sampleRate / 2 / analyser.frequencyBinCount);
            const maxPowerFrequency =
                highestPowerBin * (sampleRate / 2 / analyser.frequencyBinCount);

            // set the speed for siriwave
            // scaled to [0..22kHz] -> [0..1]
            setSpeed(maxPowerFrequency / 10e3);

            const averagedBAPower = totaldBAPower / analyser.frequencyBinCount;

            // for fun use raf to update the screen
            // requestAnimationFrame(() => {
            //     console.warn(
            //         averagedBAPower.toFixed(2),
            //         highestDetectedFrequency.toFixed(0),
            //         meanFrequency.toFixed(0),
            //         maxPowerFrequency.toFixed(0)
            //     );
            //     // energyElement.textContent = averagedBAPower.toFixed(2);
            //     // frequencyElement.textContent = highestDetectedFrequency.toFixed(0);
            //     // meanFrequencyElement.textContent = meanFrequency.toFixed(0);
            //     // maxPowerElement.textContent = maxPowerFrequency.toFixed(0);
            // });

            // find the max amplituded
            // the zero level is at 128
            analyser.getByteTimeDomainData(waveForm);

            // find the maximum not considering negative values (without loss of generality)
            const amplitudeValue = waveForm.reduce((acc, y) => Math.max(acc, y), 128) - 128;

            // scale amplituded from [0, 128] to [0, 10].
            // Set this for style ios0
            // siriWave.setAmplitude(amplitude / 128 * 10);
            // Set this for style ios
            setAmplitude((amplitudeValue / 128) * 3);

            if (!taskHandle) {
                taskHandle = requestAnimationFrame(updateAnimation);
            }
        };

        taskHandle = requestAnimationFrame(updateAnimation);
    };

    if (!ready) {
        return <Loader />;
    }

    return (
        <>
            <h1>Moew</h1>
            <Wave ref={waveRef} amplitude={amplitude} speed={speed} />
            <div>
                <button onClick={togglePlayPause}>{playing ? "Pause" : "Play"}</button>
            </div>
        </>
    );
};

export default Test;
