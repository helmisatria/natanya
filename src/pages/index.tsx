import { Anchor, Text, Title } from '@mantine/core'
import * as React from 'react'

import Layout from '@/components/layout/Layout'
import Seo from '@/components/Seo'

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <Title align='center' mt={100}>
        Welcome to{' '}
        <Text inherit variant='gradient' component='span'>
          Natanya
        </Text>
      </Title>
      <Text
        color='dimmed'
        align='center'
        size='lg'
        sx={{ maxWidth: 580 }}
        mx='auto'
        mt='xl'
      >
        This starter Next.js project includes a minimal setup for server side
        rendering, if you want to learn more on Natanya + Next.js integration
        follow{' '}
        <Anchor href='https://mantine.dev/guides/next/' size='lg'>
          this guide
        </Anchor>
        . To get started edit index.tsx file.
      </Text>
    </Layout>
  )
}
