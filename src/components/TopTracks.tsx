import React from "react";
import styled from "styled-components";

import { getTopTracksLong, getTopTracksMedium, getTopTracksShort } from "../apiClient";
import { catchErrors } from "../utils";
import Loader from "./Loader";
import TrackItem from "./TrackItem";

import { Main, media, mixins, theme } from "../styles";
const { colors, fontSizes } = theme;

const Header = styled.header`
    ${mixins.flexBetween};
    ${media.tablet`
    display: block;
  `};
    h2 {
        margin: 0;
    }
`;
const Ranges = styled.div`
    display: flex;
    margin-right: -11px;
    ${media.tablet`
    justify-content: space-around;
    margin: 30px 0 0;
  `};
`;
const RangeButton = styled.button<{ isActive: boolean }>`
    background-color: transparent;
    color: ${(props) => (props.isActive ? colors.white : colors.lightGrey)};
    font-size: ${fontSizes.base};
    font-weight: 500;
    padding: 10px;
    ${media.phablet`
    font-size: ${fontSizes.sm};
  `};
    span {
        padding-bottom: 2px;
        border-bottom: 1px solid ${(props) => (props.isActive ? colors.white : `transparent`)};
        line-height: 1.5;
        white-space: nowrap;
    }
`;
const TracksContainer = styled.ul`
    margin-top: 50px;
`;

const TopTracks: React.FC = () => {
    const [topTracks, setTopTracks] = React.useState<SpotifyApi.UsersTopTracksResponse | null>(
        null
    );
    const [activeRange, setActiveRange] = React.useState<"short" | "medium" | "long">("long");

    const apiCalls = {
        long: getTopTracksLong(),
        medium: getTopTracksMedium(),
        short: getTopTracksShort(),
    };

    React.useEffect(() => {
        catchErrors(getData());
    }, []);

    const getData = async () => {
        const { data } = await getTopTracksLong();
        setTopTracks(data);
    };

    const changeRange = async (range: "short" | "medium" | "long") => {
        const { data } = await apiCalls[range];
        setTopTracks(data);
        setActiveRange(range);
    };

    const onRangeClick = (range: "short" | "medium" | "long") => (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.preventDefault();
        catchErrors(changeRange(range));
    };

    return (
        <Main>
            <Header>
                <h2>Top Tracks</h2>
                <Ranges>
                    <RangeButton isActive={activeRange === "long"} onClick={onRangeClick("long")}>
                        <span>All Time</span>
                    </RangeButton>
                    <RangeButton
                        isActive={activeRange === "medium"}
                        onClick={onRangeClick("medium")}
                    >
                        <span>Last 6 Months</span>
                    </RangeButton>
                    <RangeButton isActive={activeRange === "short"} onClick={onRangeClick("short")}>
                        <span>Last 4 Weeks</span>
                    </RangeButton>
                </Ranges>
            </Header>
            <TracksContainer>
                {topTracks ? (
                    topTracks.items.map((track, i) => <TrackItem track={track} key={i} />)
                ) : (
                    <Loader />
                )}
            </TracksContainer>
        </Main>
    );
};

export default TopTracks;
