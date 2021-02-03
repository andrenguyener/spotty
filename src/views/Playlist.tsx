import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { getAudioFeaturesForTracks, getPlaylist } from "../apiClient";
import { catchErrors, TrackContext } from "../utils";
import { FeatureChart, Loader, TrackItem } from "./../components";

import { Main, media, mixins, theme } from "../styles";
const { colors, fontSizes, spacing } = theme;

const PlaylistContainer = styled.div`
    display: flex;
    ${media.tablet`
    display: block;
  `};
`;
const Left = styled.div`
    width: 30%;
    text-align: center;
    min-width: 200px;
    ${media.tablet`
    width: 100%;
    min-width: auto;
  `};
`;
const Right = styled.div`
    flex-grow: 1;
    margin-left: 50px;
    ${media.tablet`
    margin: 50px 0 0;
  `};
`;
const PlaylistCover = styled.div`
    ${mixins.coverShadow};
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    ${media.tablet`
    display: none;
  `};
`;
const Name = styled.h3`
    font-weight: 700;
    font-size: ${fontSizes.xl};
    margin-top: 20px;
`;
const Description = styled.p`
    font-size: ${fontSizes.sm};
    color: ${colors.lightGrey};
    a {
        color: ${colors.white};
        border-bottom: 1px solid transparent;
        &:hover,
        &:focus {
            border-bottom: 1px solid ${colors.white};
        }
    }
`;
const RecButton = styled.a`
    ${mixins.button};
    margin-bottom: ${spacing.lg};
`;
const Owner = styled.p`
    font-size: ${fontSizes.sm};
    color: ${colors.lightGrey};
`;
const TotalTracks = styled.p`
    font-size: ${fontSizes.sm};
    color: ${colors.white};
    margin-top: 20px;
`;

const Playlist: React.FC<{ playlistId: string }> = (props) => {
    const [playlist, setPlaylist] = React.useState<SpotifyApi.SinglePlaylistResponse | null>(null);
    const { setTracksList } = React.useContext(TrackContext);

    const [
        audioFeatures,
        setAudioFeatures,
    ] = React.useState<SpotifyApi.MultipleAudioFeaturesResponse | null>(null);

    React.useEffect(() => {
        catchErrors(getData());
    }, []);

    const getData = async () => {
        const { playlistId } = props;
        const playlistRes = await getPlaylist(playlistId);
        setPlaylist(playlistRes.data);

        if (playlistRes.data && playlist) {
            const audioFeatureRes = await getAudioFeaturesForTracks(playlist.tracks.items);
            setAudioFeatures(audioFeatureRes.data);
        }
    };

    const onTrackClick = () => {
        const tracks = playlist?.tracks?.items.map((item) => item.track) ?? [];
        setTracksList(tracks);
    };

    return (
        <motion.div initial="initial" animate="animate" exit={{ opacity: 0 }}>
            <React.Fragment>
                {playlist ? (
                    <Main>
                        <PlaylistContainer>
                            <Left>
                                {playlist.images.length && (
                                    <PlaylistCover>
                                        <img src={playlist.images[0].url} alt="Album Art" />
                                    </PlaylistCover>
                                )}

                                <a
                                    href={playlist.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Name>{playlist.name}</Name>
                                </a>

                                <Owner>By {playlist.owner.display_name}</Owner>

                                {playlist.description && (
                                    // tslint:disable-next-line:react-no-dangerous-html
                                    <Description
                                        dangerouslySetInnerHTML={{ __html: playlist.description }}
                                    />
                                )}

                                <TotalTracks>{playlist.tracks.total} Tracks</TotalTracks>
                                <Link href={`/recommendations/${playlist.id}`} passHref={true}>
                                    <RecButton>Get Recommendations</RecButton>
                                </Link>
                                {audioFeatures && (
                                    <FeatureChart
                                        features={audioFeatures.audio_features}
                                        type="horizontalBar"
                                    />
                                )}
                            </Left>
                            <Right>
                                <ul>
                                    {playlist.tracks &&
                                        playlist.tracks.items.map(({ track }, i) => (
                                            <TrackItem
                                                track={track}
                                                key={i}
                                                onClick={onTrackClick}
                                            />
                                        ))}
                                </ul>
                            </Right>
                        </PlaylistContainer>
                    </Main>
                ) : (
                    <Loader />
                )}
            </React.Fragment>
        </motion.div>
    );
};

export default Playlist;
