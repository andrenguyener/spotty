import React from "react";
import SiriWave, { Options } from "siriwave";

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type Props = Optional<Options, "container"> & {};

const defaultProps: Props = {
    style: "ios",
    width: 640,
    height: 200,
    // ratio: calculated,
    speed: 0.1,
    amplitude: 1,
    frequency: 6,
    color: "#fff",
    cover: true,
    autostart: false,
    pixelDepth: 0.02,
    lerpSpeed: 0.01,
    curveDefinition: undefined,
};

type RefTypes<T> = ((instance: T | null) => void) | React.MutableRefObject<T | null> | null;

const useCombinedRefs = <T,>(...refs: RefTypes<T>[]): React.MutableRefObject<T> => {
    const targetRef = React.useRef<T>();

    React.useEffect(() => {
        refs.forEach((ref) => {
            if (!ref) {
                return;
            }

            if (typeof ref === "function") {
                ref(targetRef.current!);
            } else {
                ref.current = targetRef.current!;
            }
        });
    }, [refs]);

    return targetRef as React.MutableRefObject<T>;
};

const Wave = React.forwardRef<SiriWave, Props>((props, ref) => {
    const elementRef = React.useRef<HTMLDivElement>(null);

    const defaultWaveRef = React.useRef<SiriWave>(null);
    const wave = useCombinedRefs<SiriWave>(ref, defaultWaveRef);

    React.useEffect(() => {
        if (elementRef?.current) {
            wave.current = new SiriWave({
                ...defaultProps,
                ...props,
                container: elementRef.current,
            });

            wave.current.start();
        }

        return () => {
            wave.current?.stop();
        };
    }, []);

    React.useEffect(() => {
        if (typeof props.amplitude !== "undefined") {
            wave.current?.setAmplitude(props.amplitude);
        }
        if (typeof props.speed !== "undefined") {
            wave.current?.setSpeed(props.speed);
        }
    });

    return <div ref={elementRef} />;
});

// const shouldUpdate = (props: Props, nextProps: Props) => {
//     return nextProps?.amplitude !== props?.amplitude || nextProps?.speed !== props?.speed;
// };

export default React.memo(Wave);
