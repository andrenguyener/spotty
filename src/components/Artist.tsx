import React from "react";
import styled from "styled-components";

import { doesUserFollowArtist, followArtist, getArtist } from "../apiClient";
import { catchErrors, formatWithCommas } from "../utils";
import Loader from "./Loader";

import { Main, media, mixins, theme } from "../styles";
const { colors, fontSizes, spacing } = theme;

const ArtistContainer = styled(Main)`
    ${mixins.flexCenter};
    flex-direction: column;
    height: 100%;
    text-align: center;
`;
const Artwork = styled.div`
    ${mixins.coverShadow};
    border-radius: 100%;
    img {
        object-fit: cover;
        border-radius: 100%;
        width: 300px;
        height: 300px;
        ${media.tablet`
      width: 200px;
      height: 200px;
    `};
    }
`;
const ArtistName = styled.h1`
    font-size: 70px;
    margin-top: ${spacing.md};
    ${media.tablet`
    font-size: 7vw;
  `};
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
    color: ${colors.blue};
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
    }
`;

const Artist: React.FC<{ artistId: string }> = (props) => {
    const [artist, setArtist] = React.useState<SpotifyApi.SingleArtistResponse | null>(null);
    const [isFollowing, setIsFollowing] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        catchErrors(getData());
        catchErrors(isFollowingFunc());
    }, []);

    const getData = async () => {
        const { artistId } = props;
        const { data } = await getArtist(artistId);
        setArtist(data);
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

    return (
        <React.Fragment>
            {artist ? (
                <ArtistContainer>
                    <Artwork>
                        <img src={artist.images[0].url} alt="Artist Artwork" />
                    </Artwork>
                    <div>
                        <ArtistName>{artist.name}</ArtistName>
                        <Stats>
                            <Stat>
                                <NumberDiv>{formatWithCommas(artist.followers.total)}</NumberDiv>
                                <NumLabel>Followers</NumLabel>
                            </Stat>
                            {artist.genres && (
                                <Stat>
                                    <NumberDiv>
                                        {artist.genres.map((genre) => (
                                            <Genre key={genre}>{genre}</Genre>
                                        ))}
                                    </NumberDiv>
                                    <NumLabel>Genres</NumLabel>
                                </Stat>
                            )}
                            {artist.popularity && (
                                <Stat>
                                    <NumberDiv>{artist.popularity}%</NumberDiv>
                                    <NumLabel>Popularity</NumLabel>
                                </Stat>
                            )}
                        </Stats>
                    </div>
                    <FollowButton isFollowing={!!isFollowing} onClick={catchErrors(follow)}>
                        {isFollowing ? "Following" : "Follow"}
                    </FollowButton>
                </ArtistContainer>
            ) : (
                <Loader />
            )}
        </React.Fragment>
    );
};

export default Artist;
