import React from "react";
import styled from "styled-components";

import { getRecentlyPlayed } from "../apiClient";
import { Main } from "../styles";
import { catchErrors, TrackContext } from "../utils";
import { Loader, TrackItem } from "./../components";

const TracksContainer = styled.ul`
    margin-top: 50px;
`;

const RecentlyPlayed = () => {
    const [
        recentlyPlayed,
        setRecentlyPlayed,
    ] = React.useState<SpotifyApi.UsersRecentlyPlayedTracksResponse | null>(null);
    const { setTracksList } = React.useContext(TrackContext);

    React.useEffect(() => {
        catchErrors(getData());
    }, []);

    const getData = async () => {
        const { data } = await getRecentlyPlayed();
        setRecentlyPlayed(data);
    };

    const onTrackClick = () => {
        const tracks = recentlyPlayed?.items.map((item) => item.track) ?? [];
        setTracksList(tracks);
    };

    return (
        <Main>
            <h2>Recently Played Tracks</h2>
            <TracksContainer>
                {recentlyPlayed ? (
                    recentlyPlayed.items.map(({ track }, i) => (
                        <TrackItem track={track} key={i} onClick={onTrackClick} />
                    ))
                ) : (
                    <Loader />
                )}
            </TracksContainer>
        </Main>
    );
};

export default RecentlyPlayed;
