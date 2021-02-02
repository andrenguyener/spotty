import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { getTopArtistsLong, getTopArtistsMedium, getTopArtistsShort } from "../apiClient";
import { Main, media, mixins, theme } from "../styles";
import { catchErrors } from "../utils";
import { Icons, Loader } from "./../components";

const { IconInfo } = Icons;

const { colors, fontSizes, spacing } = theme;

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
const ArtistsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 20px;
    margin-top: 50px;
    ${media.tablet`
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  `};
    ${media.phablet`
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  `};
`;
const Artist = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
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
    /* border-radius: 10px; */
    font-size: 20px;
    color: ${colors.white};
    opacity: 0;
    transition: ${theme.transition};
    svg {
        width: 25px;
    }
`;
const ArtistArtwork = styled.a`
    display: inline-block;
    position: relative;
    width: 200px;
    height: 200px;
    ${media.tablet`
    width: 150px;
    height: 150px;
  `};
    ${media.phablet`
    width: 120px;
    height: 120px;
  `};
    &:hover,
    &:focus {
        ${Mask} {
            opacity: 1;
        }
    }
    img {
        /* border-radius: 10px; */
        object-fit: cover;
        width: 200px;
        height: 200px;
        ${media.tablet`
      width: 150px;
      height: 150px;
    `};
        ${media.phablet`
      width: 120px;
      height: 120px;
    `};
    }
`;
const ArtistName = styled.a`
    margin: ${spacing.base} 0;
    border-bottom: 1px solid transparent;
    &:hover,
    &:focus {
        border-bottom: 1px solid ${colors.white};
    }
`;

const TopArtists: React.FC = () => {
    const [topArtists, setTopArtists] = React.useState<SpotifyApi.UsersTopArtistsResponse | null>(
        null
    );
    const [activeRange, setActiveRange] = React.useState<"short" | "medium" | "long">("long");

    const apiCalls = {
        long: getTopArtistsLong(),
        medium: getTopArtistsMedium(),
        short: getTopArtistsShort(),
    };

    React.useEffect(() => {
        catchErrors(getData());
    }, []);

    const getData = async () => {
        const { data } = await getTopArtistsLong();
        setTopArtists(data);
    };

    const changeRange = async (range: "short" | "medium" | "long") => {
        const { data } = await apiCalls[range];
        setTopArtists(data);
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
                <h2>Top Artists</h2>
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
            <ArtistsContainer>
                {topArtists ? (
                    topArtists.items.map(({ id, external_urls, images, name }, i) => (
                        <Artist key={i}>
                            <Link href={`/artist/${id}`} passHref={true}>
                                <ArtistArtwork>
                                    {images.length && <img src={images[1].url} alt="Artist" />}
                                    <Mask>
                                        <IconInfo />
                                    </Mask>
                                </ArtistArtwork>
                            </Link>
                            <ArtistName
                                href={external_urls.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {name}
                            </ArtistName>
                        </Artist>
                    ))
                ) : (
                    <Loader />
                )}
            </ArtistsContainer>
        </Main>
    );
};

export default TopArtists;
