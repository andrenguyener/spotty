import { useRouter } from "next/router";
import React from "react";

import { Artist as _Artist } from "./../../views";

const Artist = () => {
    const router = useRouter();
    const { id } = router.query;

    return <_Artist artistId={id as string} />;
};

export default Artist;
