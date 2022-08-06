import { Radio, Title } from '@mantine/core'
import { GetServerSideProps } from 'next'
import { useState } from 'react'

import { IEvent } from '@/lib/types/event'

import Layout from '@/components/layout/Layout'

// next serverside props
export const getServerSideProps: GetServerSideProps = async (context) => {
  const host = context.req.headers.host
  const event = await (await fetch(`http://${host}/api/event/` + context.query.id)).json()

  if (!event) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {},
    }
  }

  return {
    props: event,
  }
}

export default function HomePage(event: IEvent) {
  const [value, setValue] = useState('react')

  return (
    <Layout>
      <div className='container mx-auto min-h-screen max-w-7xl px-6 lg:px-0'>
        <p className='pt-16 text-center text-lg font-semibold text-slate-600'>{event.name}</p>

        <Title className='mt-32 text-center font-primary text-5xl font-black text-cyan-800 md:mt-44 md:text-7xl'>
          {event.questions[0].question}
        </Title>

        <div className='mt-16 flex justify-center'>
          <form onSubmit={(e) => e.preventDefault()} className='flex flex-col items-center'>
            <Radio.Group size='xl' value={value} onChange={setValue} required>
              <Radio value='react' label='React' />
              <Radio value='svelte' label='Svelte' />
              <Radio value='ng' label='Angular' />
              <Radio value='vue' label='Vue' />
            </Radio.Group>

            <button className='mt-16 rounded-lg border-4 border-cyan-600 bg-cyan-800 py-4 px-12 text-2xl font-bold text-white ring-offset-2 transition-all duration-200 hover:ring-4 active:bg-cyan-600'>
              Submit
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
