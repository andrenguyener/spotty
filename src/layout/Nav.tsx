import Link from "next/link";
import { useRouter } from "next/router";
import { rgba } from "polished";
import React from "react";
import styled from "styled-components";

import { media, mixins, theme } from "../styles";
import { Icons } from "./../components";

const { IconMicrophone, IconMusic, IconPlaylist, IconTime, IconUser } = Icons;
const { colors } = theme;

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
    border-right: 1px solid #2a2b31;
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
    border-left: 5px solid transparent;
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

const NavLink: React.FC<{ href: string }> = (props) => {
    const router = useRouter();

    return (
        <Link href={props.href} passHref={true}>
            <NavLinkItem className={router.pathname === props.href ? "active" : undefined}>
                {props.children}
            </NavLinkItem>
        </Link>
    );
};

const Nav = () => {
    return (
        <Container>
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
                            <div>Top Artists</div>
                        </>
                    </NavLink>
                </MenuItem>
                <MenuItem>
                    <NavLink href="/tracks">
                        <>
                            <IconMusic />
                            <div>Top Tracks</div>
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
