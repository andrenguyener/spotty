import { useRouter } from "next/router";
import React from "react";

import SingleTrack from "./../../components/Track";

const Track = () => {
    const router = useRouter();
    const { id } = router.query;

    return <SingleTrack trackId={id as string} />;
};

export default Track;
