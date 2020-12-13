import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from 'apollo-link-context'

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken')
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default client
