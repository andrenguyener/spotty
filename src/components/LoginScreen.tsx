import { signIn } from "next-auth/client";
import React from "react";
import styled from "styled-components";

import { Main, mixins, theme } from "../styles";
const { colors, fontSizes } = theme;

const Login = styled(Main)`
    ${mixins.flexCenter};
    flex-direction: column;
    min-height: 100vh;
    h1 {
        font-size: ${fontSizes.xxl};
    }
`;
const LoginButton = styled.button`
    display: inline-block;
    background-color: ${colors.green};
    color: ${colors.white};
    border-radius: 30px;
    padding: 17px 35px;
    margin: 20px 0 70px;
    min-width: 160px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-align: center;
    &:hover,
    &:focus {
        background-color: ${colors.offGreen};
    }
`;

const LoginScreen = () => (
    <Login>
        <h1>Spotify Profile</h1>
        <LoginButton
            onClick={(e) => {
                e.preventDefault();
                signIn("spotify");
            }}
        >
            Log in to Spotify
        </LoginButton>
    </Login>
);

export default LoginScreen;
