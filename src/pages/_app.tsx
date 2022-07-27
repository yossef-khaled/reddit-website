//Import from next
import { AppProps } from 'next/app'

//Import from @chakra-ui
import { ChakraProvider } from '@chakra-ui/react'

//Import theme
import theme from '../theme'

//Import from urql
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';

//Import urql auto generated types
import { MeDocument, LoginMutation, RegisterMutation, MeQuery } from '../generated/graphql';

// This function is a better way to declare cache.updateQuery args types
function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any)
}

const client = createClient({ 
  url : 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include', // If this property is sett to 'include' & the back-end does not provide cors credintials, it will throw a cors error  
  },
  // graphql cache stuff
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (_result, args, cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery> (
            cache,
            {query: MeDocument},
            _result,
            (result, query) => {
              if(result.login.errors) {
                return query
              } 
              return {
                me: result.login.user,
              }
            }
          )
        },
        register: (_result, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, MeQuery> (
            cache,
            {query: MeDocument},
            _result,
            (result, query) => {
              if(result.register.errors) {
                return query
              } 
              return {
                me: result.register.user,
              }
            }
          )
        },
      },
    }
  }), fetchExchange],
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
