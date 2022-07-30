//Import from next
import { AppProps } from 'next/app'

//Import from @chakra-ui
import { ChakraProvider } from '@chakra-ui/react'

//Import theme
import theme from '../theme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
  )
}

export default MyApp
