import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { AppProps } from 'next/app'
import * as React from 'react'

import '@/styles/globals.css'

function MyApp(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props

  const [colorScheme, setColorScheme] = React.useState<ColorScheme>(props.colorScheme)

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark')
    setColorScheme(nextColorScheme)
  }

  return (
    <>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <Component {...pageProps} />
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  )
}

export default MyApp
