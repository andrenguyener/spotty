import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { getPlaylists } from "../apiClient";
import { catchErrors } from "../utils";
import { Icons, Loader } from "./../components";

const { IconMusic } = Icons;

import { Main, media, mixins, theme } from "../styles";
const { colors, fontSizes, spacing } = theme;

const Wrapper = styled.div`
    ${mixins.flexBetween};
    align-items: flex-start;
`;
const PlaylistsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: ${spacing.md};
    width: 100%;
    margin-top: 50px;
    ${media.tablet`
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  `};
    ${media.phablet`
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  `};
`;
const Playlist = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
`;
const PlaylistMask = styled.div`
    ${mixins.flexCenter};
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 30px;
    color: ${colors.white};
    opacity: 0;
    transition: ${theme.transition};
`;
const PlaylistImage = styled.img`
    object-fit: cover;
`;
const PlaylistCover = styled.a`
    ${mixins.coverShadow};
    position: relative;
    width: 100%;
    margin-bottom: ${spacing.base};
    &:hover,
    &:focus {
        ${PlaylistMask} {
            opacity: 1;
        }
    }
`;
const PlaceholderArtwork = styled.div`
    ${mixins.flexCenter};
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    background-color: ${colors.darkGrey};
    svg {
        width: 50px;
        height: 50px;
    }
`;
const PlaceholderContent = styled.div`
    ${mixins.flexCenter};
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;
const PlaylistName = styled.a`
    display: inline;
    border-bottom: 1px solid transparent;
    &:hover,
    &:focus {
        border-bottom: 1px solid ${colors.white};
    }
`;
const TotalTracks = styled.div`
    text-transform: uppercase;
    margin: 5px 0;
    color: ${colors.lightGrey};
    font-size: ${fontSizes.xs};
    letter-spacing: 1px;
`;

const Playlists: React.FC = () => {
    const [
        playlists,
        setPlaylists,
    ] = React.useState<SpotifyApi.ListOfCurrentUsersPlaylistsResponse | null>(null);

    React.useEffect(() => {
        catchErrors(getData());
    }, []);

    const getData = async () => {
        const { data } = await getPlaylists();
        setPlaylists(data);
    };

    return (
        <motion.div initial="initial" animate="animate" exit={{ opacity: 0 }}>
            <Main>
                <h2>Your Playlists</h2>
                <Wrapper>
                    <PlaylistsContainer>
                        {playlists ? (
                            playlists.items.map(({ id, images, name, tracks }, i) => (
                                <Playlist key={i}>
                                    <Link href={`playlists/${id}`} passHref={true}>
                                        <PlaylistCover>
                                            {images.length ? (
                                                <PlaylistImage
                                                    src={images[0].url}
                                                    alt="Album Art"
                                                />
                                            ) : (
                                                <PlaceholderArtwork>
                                                    <PlaceholderContent>
                                                        <IconMusic />
                                                    </PlaceholderContent>
                                                </PlaceholderArtwork>
                                            )}
                                            <PlaylistMask>
                                                <i className="fas fa-info-circle" />
                                            </PlaylistMask>
                                        </PlaylistCover>
                                    </Link>
                                    <div>
                                        <Link href={`playlists/${id}`} passHref={true}>
                                            <PlaylistName>{name}</PlaylistName>
                                        </Link>
                                        <TotalTracks>{tracks.total} Tracks</TotalTracks>
                                    </div>
                                </Playlist>
                            ))
                        ) : (
                            <Loader />
                        )}
                    </PlaylistsContainer>
                </Wrapper>
            </Main>
        </motion.div>
    );
};

export default Playlists;
