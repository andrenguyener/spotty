import { useRouter } from "next/router";
import React from "react";

import { Playlist as _Playlist } from "./../../views";

const Playlist = () => {
    const router = useRouter();
    const { id } = router.query;

    return <_Playlist playlistId={id as string} />;
};

export default Playlist;
