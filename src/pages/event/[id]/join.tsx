import { Button, Input, Text, Title } from '@mantine/core'
import axios, { AxiosError } from 'axios'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

import { getUser } from '@/lib/auth/user'
import { redirectTo } from '@/lib/helper'
import { IEvent } from '@/lib/types/types'

import Layout from '@/components/layout/Layout'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const host = context.req.headers.host
  const event = await (await fetch(`http://${host}/api/event/` + context.query.id)).json()

  const user = getUser(context)

  if (user) {
    return redirectTo('/event/' + context.query.id)
  }

  if (!event) return redirectTo('/')

  return {
    props: event,
  }
}

export default function JoinPage(propsEvent: IEvent) {
  const router = useRouter()
  const input = useRef<HTMLInputElement>(null)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    input.current?.focus()
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const address = `/api/event/${propsEvent.id}/join`

    try {
      const result = await axios.post(address, {
        name: userName,
      })

      if (result.status === 200) {
        toast.remove()
        return router.replace(`/event/${propsEvent.id}`)
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>
      if ((error as AxiosError)?.response?.status === 400) {
        return toast.error(error?.response?.data?.message ?? 'Unknown error')
      }
    }
  }

  return (
    <Layout>
      <div className='container mx-auto flex min-h-screen max-w-7xl px-6 lg:px-0'>
        <div className='-mt-24 flex min-h-screen flex-1 flex-col items-center justify-center'>
          <Title className='text-6xl'>Joining {propsEvent.name}</Title>
          <Text className='mt-24 mb-4 text-xl'>Please enter your name to join</Text>
          <form onSubmit={onSubmit} className='flex items-center'>
            <Input
              ref={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
              placeholder='Enter your name'
              autoFocus
              className='w-96'
              size='xl'
              style={{ textAlign: 'center' }}
            />
            <Button type='submit' variant='outline' className='ml-4' size='lg'>
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
