import React from "react";
import {
    GetHandleProps,
    GetRailProps,
    GetTrackProps,
    Handles,
    Rail,
    Slider,
    SliderItem,
    Tracks,
} from "react-compound-slider";
import { useAudioPlayer } from "react-use-audio-player";
import styled from "styled-components";

import { theme } from "../../styles";
import { IconPlayer } from "./../icons";

const { colors } = theme;

const { Volume } = IconPlayer;

// *******************************************************
// RAIL
// *******************************************************

const RailOuter = styled.div`
    position: absolute;
    height: 100%;
    width: 4px;
    transform: translate(-50%, 0%);
    border-radius: 7px;
    cursor: pointer;
`;

const RailInner = styled.div`
    position: absolute;
    height: 100%;
    width: 4px;
    transform: translate(-50%, 0%);
    border-radius: 7px;
    pointer-events: none;
    background-color: ${theme.colors.blue};
`;

const SliderRail = ({ getRailProps }: { getRailProps: GetRailProps }) => {
    return (
        <>
            <RailOuter {...getRailProps()} />
            <RailInner />
        </>
    );
};

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
const Handle = ({
    domain: [min, max],
    handle: { id, value, percent },
    // disabled = false,
    getHandleProps,
}: {
    handle: SliderItem;
    domain: number[];
    disabled?: boolean;
    getHandleProps: GetHandleProps;
}) => {
    return (
        <>
            <div
                style={{
                    top: `${percent}%`,
                    position: "absolute",
                    transform: "translate(-50%, -50%)",
                    WebkitTapHighlightColor: "rgba(0,0,0,0)",
                    zIndex: 5,
                    width: "42px",
                    height: "28px",
                    cursor: "pointer",
                    backgroundColor: "none",
                }}
                {...getHandleProps(id)}
            />
            <div
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                style={{
                    top: `${percent}%`,
                    position: "absolute",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                    width: "24px",
                    height: "4px",
                    boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.3)",
                    backgroundColor: `${theme.colors.blue}`,
                }}
            />
        </>
    );
};

// *******************************************************
// TRACK COMPONENT
// *******************************************************
const Track = ({
    source,
    target,
    getTrackProps,
}: // disabled = false,
{
    source: SliderItem;
    target: SliderItem;
    getTrackProps: GetTrackProps;
    disabled?: boolean;
}) => {
    return (
        <div
            style={{
                position: "absolute",
                zIndex: 1,
                backgroundColor: `${colors.lightMediumGrey}`,
                cursor: "pointer",
                width: "4px",
                transform: "translate(-50%, 0%)",
                top: `${source.percent}%`,
                height: `${target.percent - source.percent}%`,
            }}
            {...getTrackProps()}
        />
    );
};

const sliderStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
    touchAction: "none",
};

const domain = [0, 10];
const defaultValues = [5];

const VolumeContainer = styled.div`
    position: relative;
    margin-right: 20px;

    svg {
        &:hover {
            cursor: pointer;
        }
    }
`;

const VolumeControl = () => {
    const { volume } = useAudioPlayer();
    const [values, setValues] = React.useState<readonly number[]>(defaultValues.slice());
    const [displayVolume, setDisplayVolume] = React.useState(false);

    const onUpdate = (update: readonly number[]) => {
        volume(1 - update[0] / 10);
    };

    const onChange = (values: readonly number[]) => {
        setValues(values);
        volume(1 - values[0] / 10);
    };

    const onVolumeClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        setDisplayVolume(!displayVolume);
    };

    return (
        <VolumeContainer>
            <Volume onClick={onVolumeClick} />
            <div
                style={{
                    position: "absolute",
                    height: "100px",
                    width: "50px",
                    bottom: "25px",
                    left: "50%",
                }}
            >
                {displayVolume && (
                    <Slider
                        vertical={true}
                        mode={1}
                        step={1}
                        domain={domain}
                        rootStyle={sliderStyle}
                        onUpdate={onUpdate}
                        onChange={onChange}
                        values={values}
                    >
                        <Rail>
                            {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
                        </Rail>
                        <Handles>
                            {({ handles, getHandleProps }) => (
                                <div className="slider-handles">
                                    {handles.map((handle) => (
                                        <Handle
                                            key={handle.id}
                                            handle={handle}
                                            domain={domain}
                                            getHandleProps={getHandleProps}
                                        />
                                    ))}
                                </div>
                            )}
                        </Handles>
                        <Tracks right={false}>
                            {({ tracks, getTrackProps }) => (
                                <div className="slider-tracks">
                                    {tracks.map(({ id, source, target }) => (
                                        <Track
                                            key={id}
                                            source={source}
                                            target={target}
                                            getTrackProps={getTrackProps}
                                        />
                                    ))}
                                </div>
                            )}
                        </Tracks>
                    </Slider>
                )}
            </div>
        </VolumeContainer>
    );
};

export default VolumeControl;
