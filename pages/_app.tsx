import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

import Layout from "../components/Layout";
import client from "../config/apollo";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}
export default MyApp;
