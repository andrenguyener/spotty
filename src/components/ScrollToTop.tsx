import React from "react";

const ScrollToTop: React.FC<{ pathName: string }> = ({ pathName }) => {
    React.useEffect(() => window.scrollTo(0, 0), [pathName]);
    return null;
};

export default ScrollToTop;
