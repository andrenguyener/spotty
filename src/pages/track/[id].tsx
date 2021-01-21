import { useRouter } from "next/router";
import React from "react";

import { Track as _Track } from "./../../views";

const Track = () => {
    const router = useRouter();
    const { id } = router.query;

    return <_Track trackId={id as string} />;
};

export default Track;
