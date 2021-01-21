import { useRouter } from "next/router";
import React from "react";

import SingleArtist from "./../../components/Artist";

const Artist = () => {
    const router = useRouter();
    const { id } = router.query;

    return <SingleArtist artistId={id as string} />;
};

export default Artist;
