import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import * as React from 'react'

const queryClient = new QueryClient()

import '@/styles/globals.css'

function MyApp(props: AppProps & { colorScheme: ColorScheme }) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props

  const [colorScheme, setColorScheme] = React.useState<ColorScheme>(props.colorScheme)

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark')
    setColorScheme(nextColorScheme)
  }

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <Component {...pageProps} />
          </MantineProvider>
        </ColorSchemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default MyApp
