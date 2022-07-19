//Import from next
import { AppProps } from 'next/app'

//Import from @chakra-ui
import { ChakraProvider } from '@chakra-ui/react'

//Import theme
import theme from '../theme'

//Import from urql
import { Provider, createClient } from 'urql';

const client = createClient({ 
  url : 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include', // If this property is sett to 'include' & the back-end does not provide cors credintials, it will throw a cors error  
  }
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
