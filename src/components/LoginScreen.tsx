import { signIn } from "next-auth/client";
import React from "react";
import styled from "styled-components";

import { IconSpotify } from "./icons";
import { Main, mixins, theme } from "../styles";
const { colors, fontSizes } = theme;

const Login = styled(Main)`
    ${mixins.flexCenter};
    flex-direction: column;
    min-height: 100vh;
    background-color: ${colors.lightBlack};
    h1 {
        font-size: ${fontSizes.xxl};
        letter-spacing: 0.25em;
    }
`;

const LoginButton = styled.div`
    margin-top: 2rem;
    padding: 1rem 1.5rem;
    position: relative;
    border: 2px solid white;
    color: ${colors.lightGrey};
    text-align: center;
    color: ${colors.white};
    letter-spacing: 2px;
    text-align: center;
    transition: 0.5s ${theme.easing.easeInOutCubic};

    &:hover,
    &:focus {
        background-color: ${colors.blue};
        cursor: pointer;
    }

    &::after,
    &::before {
        content: "";
        position: absolute;
        border: 2px solid white;
        width: calc(100% + 15px);
        height: 60px;
        transition: 0.5s ease;
    }

    &::after {
        top: -15px;
        left: -15px;
        border-right: none;
        border-bottom: none;
    }

    &::before {
        bottom: -15px;
        right: -15px;
        border-left: none;
        border-top: none;
    }

    &:hover:after,
    &:hover:before {
        width: calc(100% - 30px);
        height: 80px;
    }
`;

const Logo = styled.div`
    display: inline-block;
    width: 30px;
    margin-right: 12px;
`;

const LoginScreen = () => {
    const onLoginClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        signIn("spotify");
    };

    return (
        <Login>
            <h1>spotty</h1>
            <LoginButton onClick={onLoginClick}>
                <Logo>
                    <IconSpotify />
                </Logo>
                Login with Spotify
            </LoginButton>
        </Login>
    );
};

export default LoginScreen;
