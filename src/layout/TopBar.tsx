import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";
import styled, { css } from "styled-components";

import { media, theme } from "../styles";

const TopBarContainer = styled.div<{ isTop: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    z-index: 1;
    width: calc(100% - ${theme.navWidth});
    padding: 15px 40px;
    transition: ${theme.transition};
    border-bottom: 1px solid transparent;

    ${(props) => {
        const _css = [];
        if (!props.isTop) {
            _css.push(css`
                background-color: ${theme.colors.black};
                border-bottom: 1px solid #2a2b31;
                opacity: 0.75;
            `);
        }
        return _css;
    }}

    ${media.tablet`
    width: 100%;
    padding: 10px 25px;
    `}
`;

const SignOutButton = styled.button`
    display: inline-block;
    padding: 10px 15px;
    color: ${theme.colors.lightGrey};
    background-color: transparent;

    &:hover {
        cursor: pointer;
        color: ${theme.colors.white};
    }
`;

const ArrowContainer = styled.div`
    position: relative;
`;

const Arrow = styled.a`
    display: block;
    position: relative;
    width: 35px;
    height: 35px;

    transform: scaleX(-1);

    i {
        display: block;
        position: absolute;
        margin: -10px 0 0 -10px;
        width: 20px;
        height: 20px;
        left: 50%;
        top: 50%;
        &:before,
        &:after {
            content: "";
            width: 10px;
            height: 2px;
            border-radius: 1px;
            position: absolute;
            left: 50%;
            top: 50%;
            background: ${theme.colors.white};
            margin: -1px 0 0 -5px;
            display: block;
            transform-origin: 9px 50%;
        }
        &:before {
            transform: rotate(-40deg);
        }
        &:after {
            transform: rotate(40deg);
        }
    }
    &:before,
    &:after {
        content: "";
        display: block;
        position: absolute;
        left: 1px;
        right: 1px;
        top: 1px;
        bottom: 1px;
        border-radius: 50%;
        border: 2px solid ${theme.colors.lightGrey};
        transition: ${theme.transition};
    }
    svg {
        width: 44px;
        height: 44px;
        display: block;
        position: relative;
        z-index: 1;
        color: ${theme.colors.white};
        stroke-width: 2px;
        stroke-dashoffset: 126;
        stroke-dasharray: 126 126 0;
        transform: rotate(0deg);
    }
    &:hover {
        &:before,
        &:after {
            border: 2px solid ${theme.colors.blue};
        }
    }
`;

const useIsTopInView = () => {
    const [isTop, setIsTop] = React.useState(true);

    React.useEffect(() => {
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });
    const handleScroll = () => {
        if (window.scrollY <= 150) {
            if (isTop !== true) {
                setIsTop(true);
            }
        } else {
            if (isTop === true) {
                setIsTop(false);
            }
        }
    };

    return isTop;
};

const TopBar: React.FC = () => {
    const router = useRouter();

    const isTop = useIsTopInView();

    const onSignOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        signOut();
    };

    const onBackClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        router.back();
    };

    return (
        <TopBarContainer isTop={isTop}>
            <ArrowContainer>
                <Arrow onClick={onBackClick}>
                    <i />
                    <svg>
                        <use xlinkHref="#circle" />
                    </svg>
                </Arrow>
            </ArrowContainer>
            <SignOutButton onClick={onSignOut}>Logout</SignOutButton>
        </TopBarContainer>
    );
};

export default TopBar;
