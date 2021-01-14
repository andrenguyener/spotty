import { useSession } from "next-auth/client";
import React from "react";
import styled from "styled-components";

import { GlobalStyle, media, theme } from "../styles";
import { setToken } from "./../spotify";
import LoginScreen from "./LoginScreen";
import Nav from "./Nav";

const StructureContainer = styled.div`
    height: 100%;
    min-height: 100vh;
`;

const SiteWrapper = styled.div`
    padding-left: ${theme.navWidth};
    ${media.tablet`
    padding-left: 0;
    padding-bottom: 50px;
  `};
`;

const Structure: React.FC = (props) => {
    const [session, loading] = useSession();
    const [isReady, setIsReady] = React.useState(false);

    React.useEffect(() => {
        if (session) {
            setToken(session);
            setIsReady(true);
        }
    }, [session]);

    return (
        <StructureContainer>
            <GlobalStyle />

            {loading ? (
                <h1>Loading</h1>
            ) : isReady ? (
                <SiteWrapper>
                    <Nav />
                    {props.children}
                </SiteWrapper>
            ) : (
                <LoginScreen />
            )}
        </StructureContainer>
    );
};

export default Structure;
