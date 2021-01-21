import { useRouter } from "next/router";
import React from "react";

import { Recommendations as _Recommendations } from "./../../views";

const Recommendations = () => {
    const router = useRouter();
    const { id } = router.query;

    return <_Recommendations playlistId={id as string} />;
};

export default Recommendations;
