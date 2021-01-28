import React from "react";

type TrackInfo = {
    name?: string;
    artist?: string;
    src?: string;
    artworkSrc?: string;
};

interface TrackProps {
    trackInfo: TrackInfo;
    setTrackInfo: React.Dispatch<React.SetStateAction<TrackInfo>>;
}

// tslint:disable-next-line:no-object-literal-type-assertion
export const TrackContext = React.createContext<TrackProps>({} as TrackProps);

export const TrackContextProvider: React.FC = (props) => {
    const [trackInfo, setTrackInfo] = React.useState({});

    const trackContext = { trackInfo, setTrackInfo };

    return <TrackContext.Provider value={trackContext}>{props.children}</TrackContext.Provider>;
};

export const { Consumer: TrackContextConsumer } = TrackContext;
