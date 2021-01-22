import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { GlobalStyle, media, theme } from "../styles";
import { setToken } from "./../apiClient";
import { Loader, ScrollToTop } from "./../components";
import { useDelayedRender } from "./../utils";
import { LoginScreen } from "./../views";
import Nav from "./Nav";
import TopBar from "./TopBar";

const StructureContainer = styled.div`
    height: 100%;
    min-height: 100vh;
    position: relative;
`;

const SiteWrapper = styled.div`
    position: relative;
    padding-left: ${theme.navWidth};
    ${media.tablet`
    padding-left: 0;
    padding-bottom: 50px;
  `};
`;

const Structure: React.FC = (props) => {
    const [session, loading] = useSession();
    const delay = useDelayedRender(1500);
    const router = useRouter();
    const [isReady, setIsReady] = React.useState(false);

    const path = router.route;

    React.useEffect(() => {
        if (session) {
            setToken(session);
            setIsReady(true);
        }
    }, [session]);

    return (
        <StructureContainer>
            <GlobalStyle />
            {loading || !delay ? (
                <Loader />
            ) : isReady ? (
                <SiteWrapper>
                    <ScrollToTop pathName={path}>
                        <Nav />
                        <TopBar />
                        {props.children}
                    </ScrollToTop>
                </SiteWrapper>
            ) : (
                <LoginScreen />
            )}
        </StructureContainer>
    );
};

export default Structure;
