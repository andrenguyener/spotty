import { motion } from "framer-motion";
import React from "react";
import { useAudioPlayer } from "react-use-audio-player";
import styled from "styled-components";

import { getTrackInfo } from "../apiClient";
import { catchErrors, formatDuration, getYear, parsePitchClass, TrackContext } from "../utils";
import { FeatureChart, Loader } from "./../components";

import { Main, media, mixins, theme } from "../styles";

const { colors, fontSizes } = theme;

const TrackContainer = styled.div`
    display: flex;
    margin-bottom: 70px;
    ${media.phablet`
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
  `};
`;
const Artwork = styled.div`
    ${mixins.coverShadow};
    max-width: 250px;
    margin-right: 40px;
    ${media.tablet`
    max-width: 200px;
  `};
    ${media.phablet`
    margin: 0 auto;
  `};
`;
const Info = styled.div`
    flex-grow: 1;
    ${media.phablet`
    text-align: center;
    margin-top: 30px;
  `};
`;
const PlayTrackButton = styled.button<{ isPlaying: boolean }>`
    margin-top: 12px;
    ${mixins.button};

    border: 1px solid ${(props) => (props.isPlaying ? "white" : "transparent")};
    pointer-events: ${(props) => (props.isPlaying ? "none" : "auto")};
    cursor: ${(props) => (props.isPlaying ? "default" : "pointer")};
`;
const Title = styled.h1`
    font-size: 42px;
    margin: 0 0 5px;
    ${media.tablet`
    font-size: 30px;
  `};
`;
const ArtistName = styled.h2`
    color: ${colors.lightestGrey};
    font-weight: 700;
    text-align: left !important;
    ${media.tablet`
    font-size: 20px;
  `};
    ${media.phablet`
    text-align: center !important;
  `};
`;
const Album = styled.h3`
    color: ${colors.lightGrey};
    font-weight: 400;
    font-size: 16px;
`;
const AudioFeatures = styled.div`
    ${mixins.flexCenter};
    flex-direction: row;
    justify-content: space-between;
`;
const Features = styled.div`
    display: grid;
    grid-template-columns: repeat(5, minmax(100px, 1fr));
    /* width: 50%; */
    margin-bottom: 50px;
    margin-right: 50px;
    text-align: center;
    border-top: 1px solid ${colors.grey};
    border-left: 1px solid ${colors.grey};
    ${media.thone`
    grid-template-columns: repeat(2, minmax(100px, 1fr));
  `};
    ${media.phablet`
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  `};
`;
const Feature = styled.div`
    padding: 15px 10px;
    border-bottom: 1px solid ${colors.grey};
    border-right: 1px solid ${colors.grey};
`;
const FeatureText = styled.h4`
    color: ${colors.lightestGrey};
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 0;
    ${media.tablet`
    font-size: 24px;
  `};
`;
const FeatureLabel = styled.p`
    color: ${colors.lightestGrey};
    font-size: ${fontSizes.xs};
    margin-bottom: 0;
`;
const DescriptionLink = styled.a`
    color: ${colors.lightestGrey};
    margin: 20px auto 0;
    border-bottom: 1px solid transparent;
    &:hover,
    &:focus {
        color: ${colors.white};
        border-bottom: 1px solid ${colors.white};
    }
`;

const Track: React.FC<{ trackId: string }> = (props) => {
    const [trackInfo, setTrackInfo] = React.useState<{
        track: SpotifyApi.SingleTrackResponse | null;
        audioAnalysis: SpotifyApi.AudioAnalysisResponse | null;
        audioFeatures: SpotifyApi.AudioFeaturesResponse | null;
    }>({
        track: null,
        audioAnalysis: null,
        audioFeatures: null,
    });
    const { load, volume } = useAudioPlayer();
    const { trackInfo: info, setTrackInfo: setInfo, setTracksList } = React.useContext(
        TrackContext
    );

    React.useEffect(() => {
        catchErrors(getData());
    }, []);

    const getData = async () => {
        const { trackId } = props;
        const data = await getTrackInfo(trackId);
        setTrackInfo(data);
    };

    const onPlayClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (trackInfo.track) {
            setInfo({
                artist: trackInfo.track.artists.map((artist) => artist.name).join(", "),
                artworkSrc: trackInfo.track.album.images?.[0]?.url,
                name: trackInfo.track.name,
                src: trackInfo.track.preview_url,
                id: trackInfo.track.id,
            });
            load({
                src: trackInfo.track.preview_url || undefined,
                format: ["mp3"],
                autoplay: true,
                volume: getVolume(),
            });
            setTracksList([]);
        }
    };

    const getVolume = (): number => (typeof volume() === "number" ? (volume() as number) : 0.5);

    const isPlaying = () => {
        return !!(info.src && info?.src === trackInfo?.track?.preview_url);
    };

    const { track, audioAnalysis, audioFeatures } = trackInfo;

    return (
        <motion.div initial="initial" animate="animate" exit={{ opacity: 0 }}>
            <React.Fragment>
                {track ? (
                    <Main>
                        <TrackContainer>
                            <Artwork>
                                <img src={track.album.images[0].url} alt="Album Artwork" />
                            </Artwork>
                            <Info>
                                <Title>{track.name}</Title>
                                <ArtistName>
                                    {track.artists &&
                                        track.artists.map(({ name }, i) => (
                                            <span key={i}>
                                                {name}
                                                {track.artists.length > 0 &&
                                                i === track.artists.length - 1
                                                    ? ""
                                                    : ","}
                                                &nbsp;
                                            </span>
                                        ))}
                                </ArtistName>
                                <Album>
                                    <a
                                        href={track.album.external_urls.spotify}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {track.album.name}
                                    </a>{" "}
                                    &middot; {getYear(track.album.release_date)}
                                </Album>
                                <PlayTrackButton onClick={onPlayClick} isPlaying={isPlaying()}>
                                    {isPlaying() ? "Playing" : "Play"}
                                </PlayTrackButton>
                            </Info>
                        </TrackContainer>

                        {audioFeatures && audioAnalysis && (
                            <>
                                <AudioFeatures>
                                    <Features>
                                        <Feature>
                                            <FeatureText>
                                                {formatDuration(audioFeatures.duration_ms)}
                                            </FeatureText>
                                            <FeatureLabel>Duration</FeatureLabel>
                                        </Feature>
                                        <Feature>
                                            <FeatureText>
                                                {parsePitchClass(audioFeatures.key)}
                                            </FeatureText>
                                            <FeatureLabel>Key</FeatureLabel>
                                        </Feature>
                                        <Feature>
                                            <FeatureText>
                                                {audioFeatures.mode === 1 ? "Major" : "Minor"}
                                            </FeatureText>
                                            <FeatureLabel>Modality</FeatureLabel>
                                        </Feature>
                                        <Feature>
                                            <FeatureText>
                                                {audioFeatures.time_signature}
                                            </FeatureText>
                                            <FeatureLabel>Time Signature</FeatureLabel>
                                        </Feature>
                                        <Feature>
                                            <FeatureText>
                                                {Math.round(audioFeatures.tempo)}
                                            </FeatureText>
                                            <FeatureLabel>Tempo (BPM)</FeatureLabel>
                                        </Feature>
                                        <Feature>
                                            <FeatureText>{track.popularity}%</FeatureText>
                                            <FeatureLabel>Popularity</FeatureLabel>
                                        </Feature>
                                        <Feature>
                                            <FeatureText>
                                                {(audioAnalysis as any)?.bars?.length}
                                            </FeatureText>
                                            <FeatureLabel>Bars</FeatureLabel>
                                        </Feature>
                                        <Feature>
                                            <FeatureText>
                                                {(audioAnalysis as any)?.beats?.length}
                                            </FeatureText>
                                            <FeatureLabel>Beats</FeatureLabel>
                                        </Feature>
                                        <Feature>
                                            <FeatureText>
                                                {(audioAnalysis as any)?.sections?.length}
                                            </FeatureText>
                                            <FeatureLabel>Sections</FeatureLabel>
                                        </Feature>
                                        <Feature>
                                            <FeatureText>
                                                {(audioAnalysis as any)?.segments?.length}
                                            </FeatureText>
                                            <FeatureLabel>Segments</FeatureLabel>
                                        </Feature>
                                    </Features>
                                    <div>
                                        <FeatureChart features={audioFeatures} type="" />
                                        <DescriptionLink
                                            href="https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Full Description of Audio Features
                                        </DescriptionLink>
                                    </div>
                                </AudioFeatures>
                            </>
                        )}
                    </Main>
                ) : (
                    <Loader />
                )}
            </React.Fragment>
        </motion.div>
    );
};

export default Track;
