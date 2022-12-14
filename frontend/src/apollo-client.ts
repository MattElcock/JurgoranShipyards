import { ApolloClient, InMemoryCache } from '@apollo/client'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const client = new ApolloClient({
  uri: `${publicRuntimeConfig.databaseURI}/graphql`,
  cache: new InMemoryCache(),
})

export { client }
