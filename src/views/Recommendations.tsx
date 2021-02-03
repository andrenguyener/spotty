import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import {
    addTracksToPlaylist,
    createPlaylist,
    doesUserFollowPlaylist,
    followPlaylist,
    getPlaylist,
    getRecommendationsForTracks,
    getUser,
} from "../apiClient";
import { catchErrors, TrackContext } from "../utils";
import { TrackItem } from "./../components";

import { Main, media, mixins, theme } from "../styles";
const { colors } = theme;

const PlaylistHeading = styled.div`
    ${mixins.flexBetween};
    ${media.tablet`
    flex-direction: column;

  `};
    h2 {
        margin-bottom: 0;
    }
`;
const SaveButton = styled.button`
    ${mixins.button};
`;
const OpenButton = styled.a`
    ${mixins.button};
`;
const TracksContainer = styled.ul`
    margin-top: 50px;
`;
const PlaylistLink = styled.a`
    &:hover,
    &:focus {
        color: ${colors.offGreen};
    }
`;

const Recommendations: React.FC<{ playlistId: string }> = (props) => {
    const [playlist, setPlaylist] = React.useState<SpotifyApi.SinglePlaylistResponse | null>(null);
    const [
        recommendations,
        setRecommendations,
    ] = React.useState<SpotifyApi.RecommendationsFromSeedsResponse | null>(null);
    const [userId, setUserId] = React.useState<string | null>(null);
    const [recPlaylistId, setRecPlaylistId] = React.useState<string | null>(null);
    const [isFollowing, setIsFollowing] = React.useState(false);
    const { setTracksList } = React.useContext(TrackContext);

    React.useEffect(() => {
        catchErrors(getData());
    }, []);

    const getData = async () => {
        const { playlistId } = props;
        const playlistRes = await getPlaylist(playlistId);
        setPlaylist(playlistRes.data);

        if (playlistRes.data) {
            const recommendationsRes = await getRecommendationsForTracks(
                playlistRes.data.tracks.items
            );
            setRecommendations(recommendationsRes.data);
        }
    };

    const getTrackUris = (_recommendations: SpotifyApi.RecommendationsFromSeedsResponse) =>
        _recommendations.tracks.map(({ uri }) => uri);

    const createPlaylistClick = async () => {
        const name = `Recommended Tracks Based on ${playlist?.name}`;
        const userRes = await getUser();
        const id = userRes.data.id;
        setUserId(id);

        if (id) {
            const playlistRes = await createPlaylist(id, name);
            const _recPlaylistId = playlistRes.data.id;
            setRecPlaylistId(_recPlaylistId);

            if (playlistRes.data) {
                catchErrors(addTracksAndFollow(_recPlaylistId));
            }
        }
    };

    const addTracksAndFollow = async (playlistId: string) => {
        if (recommendations) {
            const uris = getTrackUris(recommendations).join(",");
            const { data } = await addTracksToPlaylist(playlistId, uris);

            if (data) {
                await followPlaylist(playlistId);
                catchErrors(_isFollowing(playlistId));
            }
        }
    };

    const _isFollowing = async (_playlistId: string) => {
        if (userId) {
            const { data } = await doesUserFollowPlaylist(_playlistId, userId);
            setIsFollowing(data[0]);
        }
    };

    const onTrackClick = () => {
        const tracks = recommendations?.tracks ?? [];
        setTracksList(tracks);
    };

    return (
        <motion.div initial="initial" animate="animate" exit={{ opacity: 0 }}>
            <Main>
                {playlist && (
                    <PlaylistHeading>
                        <h2>
                            Recommended Tracks Based On{" "}
                            <Link href={`/playlist/${playlist.id}`} passHref={true}>
                                <PlaylistLink>{playlist.name}</PlaylistLink>
                            </Link>
                        </h2>
                        {isFollowing && recPlaylistId ? (
                            <OpenButton
                                href={`https://open.spotify.com/playlist/${recPlaylistId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open in Spotify
                            </OpenButton>
                        ) : (
                            <SaveButton onClick={catchErrors(createPlaylistClick)}>
                                Save to Spotify
                            </SaveButton>
                        )}
                    </PlaylistHeading>
                )}
                <TracksContainer>
                    {recommendations &&
                        recommendations.tracks.map((track, i) => (
                            <TrackItem track={track} key={i} onClick={onTrackClick} />
                        ))}
                </TracksContainer>
            </Main>
        </motion.div>
    );
};

export default Recommendations;
