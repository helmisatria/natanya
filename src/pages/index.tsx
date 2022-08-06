import { Button, Input, Text, Title } from '@mantine/core'
import { useRouter } from 'next/router'
import * as React from 'react'

import Layout from '@/components/layout/Layout'
import Seo from '@/components/Seo'

export default function HomePage() {
  const router = useRouter()

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
            router.push('/event/123')
          }}
          className='mt-12 flex w-full flex-col justify-center px-4 sm:flex-row'
        >
          <Input
            icon={
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z'
                  clipRule='evenodd'
                />
              </svg>
            }
            placeholder='Enter event code here'
            size='xl'
            autoFocus
          />
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
