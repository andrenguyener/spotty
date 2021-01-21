import { Provider } from "next-auth/client";
import GoogleFonts from "next-google-fonts";
import { AppProps } from "next/app";
import Head from "next/head";

import Structure from "./../layout/Structure";
import { config } from "./../utils";

const App = ({ Component, pageProps }: AppProps) => {
    const { session } = pageProps;

    return (
        <>
            <GoogleFonts href="https://fonts.googleapis.com/css2?family=Rosario:wght@300&family=Space+Mono&display=swap" />
            <GoogleFonts href="https://fonts.googleapis.com/css2?family=Darker+Grotesque&display=swap" />
            <Head>
                {/* tslint:disable-next-line:react-a11y-titles */}
                <title>spotty</title>
                <meta property="og:title" content="spotty" key="music profile" />
            </Head>
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
        </>
    );
};

export default App;
