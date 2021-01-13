import { Provider } from "next-auth/client";
import { AppProps } from "next/app";
import "./../styles.css";

const App = ({ Component, pageProps }: AppProps) => {
    const { session } = pageProps;
    return (
        <Provider session={session}>
            <Component {...pageProps} />
        </Provider>
    );
};

export default App;
