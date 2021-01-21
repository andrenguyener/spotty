import React from "react";
import styled from "styled-components";

import { getRecentlyPlayed } from "../apiClient";
import { Main } from "../styles";
import { catchErrors } from "../utils";
import Loader from "./Loader";
import TrackItem from "./TrackItem";

const TracksContainer = styled.ul`
    margin-top: 50px;
`;

const RecentlyPlayed = () => {
    const [
        recentlyPlayed,
        setRecentlyPlayed,
    ] = React.useState<SpotifyApi.UsersRecentlyPlayedTracksResponse | null>(null);

    React.useEffect(() => {
        catchErrors(getData());
    }, []);

    const getData = async () => {
        const { data } = await getRecentlyPlayed();
        setRecentlyPlayed(data);
    };

    return (
        <Main>
            <h2>Recently Played Tracks</h2>
            <TracksContainer>
                {recentlyPlayed ? (
                    recentlyPlayed.items.map(({ track }, i) => <TrackItem track={track} key={i} />)
                ) : (
                    <Loader />
                )}
            </TracksContainer>
        </Main>
    );
};

export default RecentlyPlayed;
