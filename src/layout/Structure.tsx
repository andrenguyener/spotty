import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";
import { AudioPlayerProvider } from "react-use-audio-player";
import styled from "styled-components";

import { GlobalStyle, media, theme } from "../styles";
import { setToken } from "./../apiClient";
import { AudioPlayer, Loader, ScrollToTop } from "./../components";
import { TrackContextProvider, useDelayedRender } from "./../utils";
import { LoginScreen } from "./../views";
import Nav from "./Nav";
import TopBar from "./TopBar";

const { AudioVisualizer, Player } = AudioPlayer;

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

const AudioVisualizerContainer = styled.div`
    position: fixed;
    bottom: 0;
    width: calc(100% - ${theme.navWidth});
    opacity: 0.7;
    overflow: visible;
    z-index: -1;
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
                    <AudioPlayerProvider>
                        <TrackContextProvider>
                            <ScrollToTop pathName={path}>
                                <Nav />
                                <TopBar />
                                <Player />
                                <AudioVisualizerContainer>
                                    <AudioVisualizer />
                                </AudioVisualizerContainer>
                                {props.children}
                            </ScrollToTop>
                        </TrackContextProvider>
                    </AudioPlayerProvider>
                </SiteWrapper>
            ) : (
                <LoginScreen />
            )}
        </StructureContainer>
    );
};

export default Structure;
