import { Provider } from "next-auth/client";
import { AppProps } from "next/app";

import Structure from "./../components/Structure";
import { config } from "./../utils";

const App = ({ Component, pageProps }: AppProps) => {
    const { session } = pageProps;

    return (
        <Provider
            session={session}
            options={{
                clientMaxAge: config.EXPIRATION_TIME,
                keepAlive: config.KEEP_ALIVE,
            }}
        >
            <Structure>
                <Component {...pageProps} />
            </Structure>
        </Provider>
    );
};

export default App;
