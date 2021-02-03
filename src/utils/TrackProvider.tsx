import React from "react";

type TrackInfo = {
    name?: string;
    artist?: string;
    src?: string | null;
    artworkSrc?: string;
    id?: string;
};

type TracksList = SpotifyApi.TrackObjectFull[] | SpotifyApi.TrackObjectSimplified[];

interface TrackProps {
    trackInfo: TrackInfo;
    setTrackInfo: React.Dispatch<React.SetStateAction<TrackInfo>>;
    tracksList: TracksList;
    setTracksList: React.Dispatch<React.SetStateAction<TracksList>>;
}

// tslint:disable-next-line:no-object-literal-type-assertion
export const TrackContext = React.createContext<TrackProps>({} as TrackProps);

export const TrackContextProvider: React.FC = (props) => {
    const [trackInfo, setTrackInfo] = React.useState<TrackInfo>({});
    const [tracksList, setTracksList] = React.useState<TracksList>([]);

    const trackContext = { trackInfo, setTrackInfo, tracksList, setTracksList };

    return <TrackContext.Provider value={trackContext}>{props.children}</TrackContext.Provider>;
};

export const { Consumer: TrackContextConsumer } = TrackContext;
