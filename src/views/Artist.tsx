import { motion } from "framer-motion";
import { rgba } from "polished";
import React from "react";
import styled from "styled-components";

import { doesUserFollowArtist, followArtist, getArtist, getArtistTopTracks } from "../apiClient";
import { catchErrors, formatWithCommas, TrackContext } from "../utils";
import { Loader, TrackItem } from "./../components";

import { Main, media, mixins, theme } from "../styles";
const { colors, fontSizes, spacing } = theme;

const ArtistContainer = styled.div`
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
const Artwork = styled.div`
    ${mixins.coverShadow};
    border-radius: 100%;
    img {
        object-fit: cover;
        /* border-radius: 10px; */
        width: 300px;
        height: 300px;
        ${media.tablet`
      width: 200px;
      height: 200px;
    `};
    }
`;
const ArtistName = styled.h3`
    font-weight: 700;
    font-size: ${fontSizes.xl};
    margin-top: 20px;
`;
const Stats = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
    margin-top: ${spacing.md};
    text-align: center;
`;
const Stat = styled.div``;
const NumberDiv = styled.div`
    color: ${colors.white};
    font-weight: 700;
    font-size: ${fontSizes.lg};
    text-transform: capitalize;
    ${media.tablet`
    font-size: ${fontSizes.md};
  `};
`;
const Genre = styled.div`
    font-size: ${fontSizes.md};
`;
const NumLabel = styled.p`
    color: ${colors.lightGrey};
    font-size: ${fontSizes.xs};
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: ${spacing.xs};
`;
const FollowButton = styled.button<{ isFollowing: boolean }>`
    ${mixins.button};
    margin-top: 50px;
    padding: 12px 50px;
    background-color: ${(props) => (props.isFollowing ? "transparent" : colors.blue)};
    border: 1px solid ${(props) => (props.isFollowing ? "white" : "transparent")};
    pointer-events: ${(props) => (props.isFollowing ? "none" : "auto")};
    cursor: ${(props) => (props.isFollowing ? "default" : "pointer")};
    &:hover,
    &:focus {
        background-color: ${(props) => (props.isFollowing ? "transparent" : colors.blue)};
        ${(props) =>
            !props.isFollowing && `box-shadow: 0.1em 0.1em 1em ${rgba(colors.blue, 0.5)};`};
        color: white;
    }
`;

const Artist: React.FC<{ artistId: string }> = (props) => {
    const [artist, setArtist] = React.useState<SpotifyApi.SingleArtistResponse | null>(null);
    const [topTracks, setTopTracks] = React.useState<SpotifyApi.ArtistsTopTracksResponse | null>(
        null
    );
    const [isFollowing, setIsFollowing] = React.useState<boolean | null>(null);
    const { setTracksList } = React.useContext(TrackContext);

    React.useEffect(() => {
        catchErrors(getData());
        catchErrors(isFollowingFunc());
    }, []);

    const getData = async () => {
        const { artistId } = props;
        const { data } = await getArtist(artistId);
        setArtist(data);

        if (data) {
            const topTracksRes = await getArtistTopTracks(artistId);
            setTopTracks(topTracksRes.data);
        }
    };

    const isFollowingFunc = async () => {
        const { artistId } = props;
        const { data } = await doesUserFollowArtist(artistId);
        setIsFollowing(data[0]);
    };

    const follow = async () => {
        const { artistId } = props;
        await followArtist(artistId);
        isFollowingFunc();
    };

    const onTrackClick = () => {
        const tracks = topTracks?.tracks ?? [];
        setTracksList(tracks);
    };

    return (
        <motion.div initial="initial" animate="animate" exit={{ opacity: 0 }}>
            <React.Fragment>
                {artist ? (
                    <Main>
                        <ArtistContainer>
                            <Left>
                                <Artwork>
                                    <img src={artist.images[0].url} alt="Artist Artwork" />
                                </Artwork>
                                <div>
                                    <ArtistName>{artist.name}</ArtistName>
                                    <Stats>
                                        <Stat>
                                            <NumLabel>Followers</NumLabel>
                                            <NumberDiv>
                                                {formatWithCommas(artist.followers.total)}
                                            </NumberDiv>
                                        </Stat>
                                        {artist.genres && (
                                            <Stat>
                                                <NumLabel>Genres</NumLabel>
                                                <NumberDiv>
                                                    {artist.genres.map((genre) => (
                                                        <Genre key={genre}>{genre}</Genre>
                                                    ))}
                                                </NumberDiv>
                                            </Stat>
                                        )}
                                        {artist.popularity && (
                                            <Stat>
                                                <NumLabel>Popularity</NumLabel>
                                                <NumberDiv>{artist.popularity}%</NumberDiv>
                                            </Stat>
                                        )}
                                    </Stats>
                                </div>
                                <FollowButton
                                    isFollowing={!!isFollowing}
                                    onClick={catchErrors(follow)}
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </FollowButton>
                            </Left>
                            <Right>
                                <ul>
                                    {topTracks?.tracks?.map((track, i) => (
                                        <TrackItem track={track} key={i} onClick={onTrackClick} />
                                    ))}
                                </ul>
                            </Right>
                        </ArtistContainer>
                    </Main>
                ) : (
                    <Loader />
                )}
            </React.Fragment>
        </motion.div>
    );
};

export default Artist;
