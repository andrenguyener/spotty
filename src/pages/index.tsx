import { signOut } from "next-auth/client";
import React from "react";
import Profile from "./../components/Profile";

const App = () => {
    return (
        <>
            <Profile />
            <button onClick={signOut as any}>Sign out</button>
        </>
    );
};

export default App;
