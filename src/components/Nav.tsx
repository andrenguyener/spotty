import React from "react";
import Link from "next/link";
import { rgba } from "polished";
import { useRouter } from "next/router";

import {
    IconSpotify,
    IconUser,
    IconTime,
    IconMicrophone,
    IconPlaylist,
    IconMusic,
    IconGithub,
} from "./icons";

import styled from "styled-components";
import { theme, mixins, media } from "../styles";
const { colors } = theme;

// const Link = (props) => <div>{props.children}</div>;

const Container = styled.nav`
    ${mixins.coverShadow};
    ${mixins.flexBetween};
    flex-direction: column;
    min-height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    width: ${theme.navWidth};
    background-color: ${colors.navBlack};
    text-align: center;
    z-index: 99;
    ${media.tablet`
    top: auto;
    bottom: 0;
    right: 0;
    width: 100%;
    min-height: ${theme.navHeight};
    height: ${theme.navHeight};
    flex-direction: row;
  `};
    & > * {
        width: 100%;
        ${media.tablet`
      height: 100%;
    `};
    }
`;
const Logo = styled.div`
    color: ${colors.green};
    margin-top: 30px;
    width: 70px;
    height: 70px;
    transition: ${theme.transition};
    ${media.tablet`
    display: none;
  `};
    &:hover,
    &:focus {
        color: ${colors.offGreen};
    }
    svg {
        width: 50px;
    }
`;
const Github = styled.div`
    color: ${colors.lightGrey};
    width: 45px;
    height: 45px;
    margin-bottom: 30px;
    ${media.tablet`
    display: none;
  `};
    a {
        &:hover,
        &:focus,
        &.active {
            color: ${colors.blue};
        }
        svg {
            width: 30px;
        }
    }
`;
const Menu = styled.ul`
    display: flex;
    flex-direction: column;
    padding: 40px 20px;
    ${media.tablet`
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    padding: 0;
  `};
`;
const MenuItem = styled.li`
    color: ${colors.lightGrey};
    ${media.tablet`
    flex-grow: 1;
    flex-basis: 100%;
    height: 100%;
  `};
`;

const NavLinkItem = styled.a`
    padding: 10px 0;
    /* margin: 0 15px; */
    border-left: 5px solid transparent;
    /* width: 100%; */
    display: flex;
    align-items: center;

    ${media.tablet`
      ${mixins.flexCenter};
      flex-direction: column;
      padding: 0;
      border-left: 0;
      border-top: 3px solid transparent;
      height: 100%;
    `};
    &:hover,
    &:focus,
    &.active {
        color: ${colors.white};
        background-color: ${colors.blue};
        border-radius: 5px;
        box-shadow: 0.1em 0.1em 3em ${rgba(colors.blue, 0.5)};
    }
    .active {
        background-color: ${colors.blue};
    }
    svg {
        width: 20px;
        height: 20px;
        margin-bottom: 7px;
        margin: 0 10px;
    }
`;

const NavLink = (props) => {
    const router = useRouter();

    return (
        <Link href={props.href} passHref={true}>
            <NavLinkItem className={router.pathname === props.href ? "active" : undefined}>
                {props.children}
            </NavLinkItem>
        </Link>
        // <NavLinkItem className={router.pathname === props.href ? "active" : undefined}>
        //     <Link {...props} />
        // </NavLinkItem>
    );
};

const Nav = () => {
    return (
        <Container>
            {/* <Logo>
      <Link to="/">
        <IconSpotify />
      </Link>
    </Logo> */}
            <Menu>
                <MenuItem>
                    <NavLink href="/">
                        <>
                            <IconUser />
                            <div>Profile</div>
                        </>
                    </NavLink>
                </MenuItem>
                <MenuItem>
                    <NavLink href="/artists">
                        <>
                            <IconMicrophone />
                            <div>hrefp Artists</div>
                        </>
                    </NavLink>
                </MenuItem>
                <MenuItem>
                    <NavLink href="/tracks">
                        <>
                            <IconMusic />
                            <div>hrefp Tracks</div>
                        </>
                    </NavLink>
                </MenuItem>
                <MenuItem>
                    <NavLink href="/recent">
                        <>
                            <IconTime />
                            <div>Recent</div>
                        </>
                    </NavLink>
                </MenuItem>
                <MenuItem>
                    <NavLink href="/playlists">
                        <>
                            <IconPlaylist />
                            <div>Playlists</div>
                        </>
                    </NavLink>
                </MenuItem>
            </Menu>
        </Container>
    );
};

export default Nav;
