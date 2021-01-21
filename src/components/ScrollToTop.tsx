import React from "react";

const ScrollToTop: React.FC<{ pathName: string }> = ({ children, pathName }) => {
    console.warn(pathName);
    React.useEffect(() => window.scrollTo(0, 0), [pathName]);
    return <>{children}</>;
};

export default ScrollToTop;
