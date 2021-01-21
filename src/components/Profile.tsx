import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { catchErrors } from "../utils";
import { getUserInfo } from "./../apiClient";
import { IconInfo, IconUser } from "./../components/icons";
import Loader from "./../components/Loader";
import TrackItem from "./../components/TrackItem";

import { Main, media, mixins, theme } from "../styles";
const { colors, fontSizes, spacing } = theme;

const Header = styled.header`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    position: relative;
`;
const SubHeader = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 25px;
`;

const Avatar = styled.div`
    width: 150px;
    height: 150px;
    img {
        border-radius: 100%;
    }
`;
const NoAvatar = styled.div`
    border: 2px solid currentColor;
    border-radius: 10px;
    padding: ${spacing.md};
`;
const UserName = styled.a`
    &:hover,
    &:focus {
        color: ${colors.lightGrey};
    }
`;
const Name = styled.h1`
    font-size: 50px;
    font-weight: 700;
    margin: 20px 0 0;
    letter-spacing: 0.05em;
    ${media.tablet`
    font-size: 40px;
  `};
    ${media.phablet`
    font-size: 8vw;
  `};
`;
const Stats = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 30px;
    margin-top: ${spacing.base};
`;
const Stat = styled.div`
    text-align: center;
`;
const NumberDiv = styled.div`
    color: ${colors.blue};
    font-weight: 700;
    font-size: ${fontSizes.md};
`;
const NumLabel = styled.p`
    color: ${colors.lightGrey};
    font-size: ${fontSizes.xs};
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: ${spacing.xs};
`;
const StyledA = styled.a``;
const Preview = styled.section`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 70px;
    width: 100%;
    margin-top: 100px;
    ${media.tablet`
    display: block;
    margin-top: 70px;
  `};
`;
const Tracklist = styled.div`
    ${media.tablet`
    &:last-of-type {
      margin-top: 50px;
    }
  `};
`;
const TracklistHeading = styled.div`
    ${mixins.flexBetween};
    margin-bottom: 40px;
    h3 {
        display: inline-block;
        margin: 0;
    }
`;
const MoreButton = styled.button`
    ${mixins.button};
    text-align: center;
    white-space: nowrap;
    ${media.phablet`
    padding: 11px 20px;
    font-sizes: ${fontSizes.xs};
  `};
`;
const Mask = styled.div`
    ${mixins.flexCenter};
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    color: ${colors.white};
    opacity: 0;
    transition: ${theme.transition};
    svg {
        width: 25px;
    }
`;
const Artist = styled.li`
    display: flex;
    align-items: center;
    margin-bottom: ${spacing.md};
    ${media.tablet`
    margin-bottom: ${spacing.base};
  `};
    &:hover,
    &:focus {
        ${Mask} {
            opacity: 1;
        }
    }
`;
const ArtistArtwork = styled.div`
    display: inline-block;
    position: relative;
    width: 50px;
    min-width: 50px;
    margin-right: ${spacing.base};
    img {
        width: 50px;
        min-width: 50px;
        height: 50px;
        margin-right: ${spacing.base};
        border-radius: 5px;
    }
`;

const ArtistName = styled.div`
    flex-grow: 1;
    span {
        border-bottom: 1px solid transparent;
        &:hover,
        &:focus {
            border-bottom: 1px solid ${colors.white};
        }
    }
`;

const User: React.FC = () => {
    const [state, setState] = React.useState<{
        user?: SpotifyApi.UserObjectPublic;
        followedArtists?: SpotifyApi.UsersFollowedArtistsResponse;
        playlists?: SpotifyApi.ListOfCurrentUsersPlaylistsResponse;
        topArtists?: SpotifyApi.UsersTopArtistsResponse;
        topTracks?: SpotifyApi.UsersTopTracksResponse;
    }>({});
    const router = useRouter();

    React.useEffect(() => {
        catchErrors(getData());
    }, []);

    const getData = async () => {
        const {
            _user,
            _followedArtists,
            _playlists,
            _topArtists,
            _topTracks,
        } = await getUserInfo();
        setState({
            user: _user,
            followedArtists: _followedArtists,
            playlists: _playlists,
            topArtists: _topArtists,
            topTracks: _topTracks,
        });
    };

    const { user, followedArtists, playlists, topArtists, topTracks } = state;
    const totalPlaylists = playlists ? playlists.total : 0;

    const onMoreArtistsClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        router.push("/artists");
    };

    const onMoreTracksClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        router.push("/tracks");
    };

    return (
        <React.Fragment>
            {user ? (
                <Main>
                    <Header>
                        <Avatar>
                            {(user?.images?.length ?? 0) > 0 ? (
                                <img src={user?.images?.[0]?.url} alt="avatar" />
                            ) : (
                                <NoAvatar>
                                    <IconUser />
                                </NoAvatar>
                            )}
                        </Avatar>
                        <SubHeader>
                            <UserName
                                href={user.external_urls.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Name>{user.display_name}</Name>
                            </UserName>
                            <Stats>
                                <Stat>
                                    <NumberDiv>{user.followers?.total}</NumberDiv>
                                    <NumLabel>Followers</NumLabel>
                                </Stat>
                                {followedArtists && (
                                    <Stat>
                                        <NumberDiv>
                                            {followedArtists.artists.items.length}
                                        </NumberDiv>
                                        <NumLabel>Following</NumLabel>
                                    </Stat>
                                )}
                                {totalPlaylists && (
                                    <Stat>
                                        <Link href="/playlists" passHref={true}>
                                            <StyledA>
                                                <NumberDiv>{totalPlaylists}</NumberDiv>
                                                <NumLabel>Playlists</NumLabel>
                                            </StyledA>
                                        </Link>
                                    </Stat>
                                )}
                            </Stats>
                        </SubHeader>
                    </Header>

                    <Preview>
                        <Tracklist>
                            <TracklistHeading>
                                <h3>Top Artists of All Time</h3>
                                <MoreButton onClick={onMoreArtistsClick}>See More</MoreButton>
                            </TracklistHeading>
                            <div>
                                {topArtists ? (
                                    <ul>
                                        {topArtists.items.slice(0, 10).map((artist, i) => (
                                            <Artist key={i}>
                                                <Link href={`/artist/${artist.id}`} passHref={true}>
                                                    <StyledA>
                                                        <ArtistArtwork>
                                                            {artist.images.length && (
                                                                <img
                                                                    src={artist.images[2].url}
                                                                    alt="Artist"
                                                                />
                                                            )}
                                                            <Mask>
                                                                <IconInfo />
                                                            </Mask>
                                                        </ArtistArtwork>
                                                    </StyledA>
                                                </Link>
                                                <Link href={`/artist/${artist.id}`} passHref={true}>
                                                    <StyledA>
                                                        <ArtistName>
                                                            <span>{artist.name}</span>
                                                        </ArtistName>
                                                    </StyledA>
                                                </Link>
                                            </Artist>
                                        ))}
                                    </ul>
                                ) : (
                                    <Loader />
                                )}
                            </div>
                        </Tracklist>

                        <Tracklist>
                            <TracklistHeading>
                                <h3>Top Tracks of All Time</h3>
                                <MoreButton onClick={onMoreTracksClick}>See More</MoreButton>
                            </TracklistHeading>
                            <ul>
                                {topTracks ? (
                                    topTracks.items
                                        .slice(0, 10)
                                        .map((track, i) => <TrackItem track={track} key={i} />)
                                ) : (
                                    <Loader />
                                )}
                            </ul>
                        </Tracklist>
                    </Preview>
                </Main>
            ) : (
                <Loader />
            )}
        </React.Fragment>
    );
};

export default User;
