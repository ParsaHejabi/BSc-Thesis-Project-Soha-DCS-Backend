import { ApolloClient, InMemoryCache } from '@apollo/client'
import { split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'

const httpLink = new HttpLink({
  uri: 'http://127.0.0.1:4000/',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwtToken')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const wsLink = new WebSocketLink({
  uri: `ws://127.0.0.1:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: 'Bearer ' + localStorage.getItem('jwtToken'),
    },
  },
})

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
})
export const closeSocket = () => {
  wsLink.subscriptionClient.close()
  alert('SOCKET DC')
}
export const openSocket = () => {
  wsLink.subscriptionClient.connect()
  alert('SOCKET Connect')
}
export default client
