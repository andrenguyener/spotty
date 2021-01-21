import { signOut, useSession } from "next-auth/client";
import React from "react";
import styled from "styled-components";

import { GlobalStyle, media, theme } from "../styles";
import { setToken } from "./../apiClient";
import { Loader } from "./../components";
import { useDelayedRender } from "./../utils";
import { LoginScreen } from "./../views";
import Nav from "./Nav";

const StructureContainer = styled.div`
    height: 100%;
    min-height: 100vh;
    position: relative;
`;

const SiteWrapper = styled.div`
    padding-left: ${theme.navWidth};
    ${media.tablet`
    padding-left: 0;
    padding-bottom: 50px;
  `};
`;

const TopBar = styled.div`
    display: flex;
    justify-content: flex-end;
    margin: 1rem 2rem;
`;

const SignOutButton = styled.div`
    display: inline-block;
    padding: 1rem 1.5rem;
    color: ${theme.colors.lightGrey};

    &:hover {
        cursor: pointer;
    }
`;

const Structure: React.FC = (props) => {
    const [session, loading] = useSession();
    const delay = useDelayedRender(1500);
    const [isReady, setIsReady] = React.useState(false);

    React.useEffect(() => {
        if (session) {
            setToken(session);
            setIsReady(true);
        }
    }, [session]);

    const onSignOut = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        signOut();
    };

    return (
        <StructureContainer>
            <GlobalStyle />
            {loading || !delay ? (
                <Loader />
            ) : isReady ? (
                <SiteWrapper>
                    <Nav />
                    <TopBar>
                        <SignOutButton onClick={onSignOut}>Logout</SignOutButton>
                    </TopBar>
                    {props.children}
                </SiteWrapper>
            ) : (
                <LoginScreen />
            )}
        </StructureContainer>
    );
};

export default Structure;
