import { rgba } from "polished";
import React from "react";
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";
import styled from "styled-components";

import { media, mixins, theme } from "../../styles";
import { TrackContext } from "./../../utils";
import { IconPlayer } from "./../icons";
import VolumeControl from "./volume";

const { colors } = theme;

const { Next, Pause, Play, Previous } = IconPlayer;

const MusicPlayer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 100;

    ${media.tablet`
        bottom: ${theme.navHeight};
    `};
`;

const PlayerMain = styled.div`
    ${mixins.coverShadow};
    position: relative;
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: ${rgba(colors.navBlack, 0.85)};
    backdrop-filter: blur(2px);
    border-top: 1px solid #2a2b31;

    ${media.tablet`
       padding: 0;
       padding-top: 3px;
    `};
`;

const MainCurrent = styled.div`
    display: flex;
    align-items: center;
    margin-left: 12px;

    ${media.tablet`
        margin-left: 0;
    `};
`;

const CurrentKeyVisual = styled.div<{ imageUrl: string }>`
    position: relative;

    img {
        position: relative;
        z-index: 2;
        width: 60px;
        min-width: 60px;
        height: 60px;
        border-radius: 4px;

        visibility: ${(props) => (props.imageUrl ? "visible" : "hidden")};
    }

    &:before {
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 1;
        width: 95%;
        height: 80%;
        background-image: ${(props) => `url(${props.imageUrl})`};
        background-size: cover;
        filter: blur(6px);
    }
`;

const CurrentInfo = styled.div`
    display: flex;
    padding-left: 12px;
    padding-right: 24px;
    box-sizing: content-box;
    /* vertical-align: top; */
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 200px;

    h2,
    p {
        padding: 0;
        margin: 0;
    }

    h2 {
        font-size: 15px;
        color: ${colors.lightestGrey};
    }

    p {
        font-size: 12px;
        color: ${colors.lightGrey};
    }
`;

const MainControl = styled.div`
    position: relative;
    line-height: 0;
    display: flex;
    align-items: center;
    width: 100%;
    padding-right: 20px;

    ${media.tablet`
       position: absolute;
       padding-right: 0;
       top: 0
    `};
`;

const PlayerControls = styled.div`
    position: relative;
    min-width: ${theme.navWidth};
    line-height: 0;
    display: flex;
    justify-content: center;

    ${media.tablet`
        order: 3;
        justify-content: flex-end;
        padding-right: 15px;
    `};
`;

const ControlButton = styled.div`
    display: inline-block;
    width: 30px;
    height: 25px;
    vertical-align: middle;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
    opacity: 0.75;
    transition: ${theme.transition};

    &:hover {
        opacity: 1;
    }
`;

const PreviousButton = styled(ControlButton)<{ disabled: boolean }>`
    margin-right: 17px;
    display: flex;
    align-items: center;

    svg {
        width: 100%;
        height: 80%;

        path {
            fill: ${(props) => (props.disabled ? colors.grey : colors.white)};
        }
    }

    pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const PauseButton = styled(ControlButton)`
    margin-right: 17px;

    display: flex;
    align-items: center;

    svg {
        width: 100%;
        height: 100%;

        path {
            fill: ${colors.white};
        }
    }
`;

const NextButton = styled(ControlButton)<{ disabled: boolean }>`
    margin-right: 24px;

    display: flex;
    align-items: center;

    svg {
        width: 100%;
        height: 80%;

        path {
            fill: ${(props) => (props.disabled ? colors.grey : colors.white)};
        }
    }

    pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const TimelineButton = styled(ControlButton)`
    vertical-align: middle;
    height: auto;
    width: auto;
    opacity: 1;
    width: 100%;
    display: flex;
    align-items: center;

    > span {
        display: inline-block;
        vertical-align: middle;
        font-size: 10px;
        font-family: ${theme.fonts.mono};
        color: ${colors.lightGrey};
    }

    .current-time,
    .end-time {
        margin-top: 3px;

        ${media.tablet`
           display: none;
       
    `};
    }
`;

const StyledTime = styled.span`
    vertical-align: middle;
    height: auto;
    width: auto;
    opacity: 1;
    width: 100%;
    display: flex;
    align-items: center;

    display: inline-block;
    vertical-align: middle;
    font-size: 10px;
    font-family: ${theme.fonts.mono};
    color: ${colors.lightGrey};
`;

const Timescope = styled(StyledTime)`
    position: relative;
    margin: auto 12px;
    width: 90%;
    height: 3px;
    border-radius: 20px;

    ${media.tablet`
        width: 100%;
        margin: auto 0;
    `};
`;

const TimescopeAfter = styled(StyledTime)`
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 0;
    height: 100%;
    background-color: ${colors.blue};
    cursor: pointer;
    z-index: 1;

    box-shadow: 0.1em 0.1em 10px ${rgba(colors.blue, 0.5)};
`;

const TimescopeBefore = styled(StyledTime)`
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 0;
    height: 100%;
    background-color: ${colors.blue};
    cursor: pointer;
    z-index: 1;

    width: 100%;
    opacity: 0.2;
`;

const TimescopeDot = styled(StyledTime)`
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 0;
    height: 100%;
    background-color: ${colors.blue};
    cursor: pointer;
    z-index: 1;

    top: -2.5px;

    z-index: 3;
    width: 8px;
    height: 8px;
    border-radius: 100%;
    box-shadow: 0.1em 0.1em 10px ${rgba(colors.blue, 0.5)};

    ${media.tablet`
       display: none;
    `};
`;

const Container = styled.div``;

const formatTime = (seconds: number) => {
    const floored = Math.floor(seconds);
    let from = 14;
    let length = 5;
    // Display hours only if necessary.
    if (floored >= 3600) {
        from = 11;
        length = 8;
    }

    return new Date(floored * 1000).toISOString().substr(from, length);
};

const Player = () => {
    const { load, togglePlayPause, playing, volume } = useAudioPlayer();
    const { duration, position, percentComplete } = useAudioPosition({ highRefreshRate: true });

    const { trackInfo, setTrackInfo, tracksList } = React.useContext(TrackContext);

    const onPausePlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        togglePlayPause();
    };

    const currentTrackIndex = () => tracksList.findIndex((tl) => tl.id === trackInfo.id);

    const prevTrack = () => {
        const current = currentTrackIndex();
        if (current < 0) {
            return undefined;
        }
        return tracksList[current - 1];
    };

    const nextTrack = () => {
        const current = currentTrackIndex();
        if (current < 0) {
            return undefined;
        }
        return tracksList[current + 1];
    };

    const onPrevClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        const prev = prevTrack();

        if (prev) {
            setTrackState(prev);
        }
    };

    const onNextClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        const next = nextTrack();

        if (next) {
            setTrackState(next);
        }
    };

    const setTrackState = (track: SpotifyApi.TrackObjectSimplified) => {
        setTrackInfo({
            artist: track.artists.map((artist) => artist.name).join(", "),
            artworkSrc: (track as SpotifyApi.TrackObjectFull)?.album?.images?.[0]?.url,
            name: track.name,
            src: track.preview_url,
            id: track.id,
        });
        load({
            src: track.preview_url || undefined,
            format: ["mp3"],
            autoplay: true,
            volume: getVolume(),
        });
    };

    const getVolume = (): number => (typeof volume() === "number" ? (volume() as number) : 0.5);

    const elapsed = typeof position === "number" ? position : 0;

    return (
        <Container>
            {trackInfo.src && (
                <MusicPlayer>
                    <PlayerMain>
                        <PlayerControls>
                            <PreviousButton disabled={!prevTrack()} onClick={onPrevClick}>
                                <Previous />
                            </PreviousButton>
                            <PauseButton onClick={onPausePlayClick}>
                                {playing ? <Pause /> : <Play />}
                            </PauseButton>
                            <NextButton disabled={!nextTrack()} onClick={onNextClick}>
                                <Next />
                            </NextButton>
                        </PlayerControls>
                        <VolumeControl />
                        <MainCurrent>
                            <CurrentKeyVisual imageUrl={trackInfo.artworkSrc || ""}>
                                <img src={trackInfo.artworkSrc} alt="album-art" />
                            </CurrentKeyVisual>

                            <CurrentInfo>
                                <h2>{trackInfo.name}</h2>
                                <p>{trackInfo.artist}</p>
                            </CurrentInfo>
                        </MainCurrent>
                        <MainControl>
                            <TimelineButton>
                                <span className="current-time">{formatTime(elapsed)}</span>
                                <Timescope>
                                    <TimescopeBefore />
                                    <TimescopeDot style={{ left: `${percentComplete}%` }} />
                                    <TimescopeAfter style={{ width: `${percentComplete}%` }} />
                                </Timescope>

                                <span className="end-time">{formatTime(duration)}</span>
                            </TimelineButton>
                        </MainControl>
                    </PlayerMain>
                </MusicPlayer>
            )}
        </Container>
    );
};

export default Player;
