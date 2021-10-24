import { ApolloClient, InMemoryCache } from "@apollo/client";

const HASURA_ADMIN_KEY =
  "t1HyEpkPDtCQ6M454UGI9QqGLb7euyDj8XU0Tn7WQ2Nl32lh5GSqoKMN09ds6CiJ";

const client = new ApolloClient({
  uri: "https://austin-david-coffee.hasura.app/v1/graphql",
  cache: new InMemoryCache(),
  headers: {
    "x-hasura-admin-secret": HASURA_ADMIN_KEY,
  },
});

export default client;
