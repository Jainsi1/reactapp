import { ApolloClient } from '@apollo/client/core'
import { InMemoryCache } from '@apollo/client/cache'
import { HttpLink, ApolloLink, from } from '@apollo/client'

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SERVER_GRAPH_URL,
  credentials: 'include',
});

const authMiddleware = new ApolloLink((operation, forward) => {

  let authorization = {};

  if (JSON.parse(localStorage.getItem('token'))) {
    authorization = {
      authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
    }
  }

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...authorization
    }
  }));

  return forward(operation);
})

const client = new ApolloClient({
  link: from([authMiddleware, httpLink]),
  cache: new InMemoryCache(),
});

export default client
