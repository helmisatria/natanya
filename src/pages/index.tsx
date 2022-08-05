import { Button, Input, Text, Title } from '@mantine/core'
import * as React from 'react'

import Layout from '@/components/layout/Layout'
import Seo from '@/components/Seo'

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <div className='container mx-auto -mt-12 flex min-h-screen flex-col items-center justify-center'>
        <Title
          align='center'
          className='px-4 font-primary text-7xl tracking-tight md:text-7xl lg:text-8xl'
        >
          Joining{' '}
          <Text inherit variant='gradient' component='span'>
            polling
          </Text>{' '}
          event?
        </Title>

        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
          className='mt-12 flex w-full flex-col justify-center px-4 sm:flex-row'
        >
          <Input placeholder='Enter event code here' size='xl' autoFocus />
          <Button
            size='xl'
            color='#fff'
            variant='default'
            className='mt-2 bg-primary-50 sm:mt-0 sm:ml-4'
          >
            Submit
          </Button>
        </form>
      </div>
    </Layout>
  )
}
