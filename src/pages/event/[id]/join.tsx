import { Button, Input, Text, Title } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

import { getUser } from '@/lib/auth/user'
import { redirectTo } from '@/lib/helper'
import { IEvent } from '@/lib/types/types'

import Layout from '@/components/layout/Layout'
import Seo from '@/components/Seo'

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

  const mutation = useMutation((userName: string) => {
    const address = `/api/event/${propsEvent.id}/join`
    return axios.post(address, { name: userName })
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutation.mutate(userName, {
      onSuccess: () => {
        toast.remove()
        router.replace(`/event/${propsEvent.id}`)
      },
      onError: (err) => {
        const error = err as AxiosError<{ message: string }>
        if (error?.response?.status === 400) {
          toast.error(error?.response?.data?.message ?? 'Unknown error')
        }
      },
    })
  }

  return (
    <Layout>
      <Seo />

      <div className='flex min-h-screen min-w-full flex-col items-center justify-center px-6 lg:max-w-7xl lg:px-0'>
        <div className='-mt-32 flex min-h-screen w-full flex-col items-center justify-center lg:-mt-24'>
          <Title
            data-sal='slide-up'
            data-sal-delay='0'
            className='text-6xl font-black text-cyan-800 sm:text-center lg:text-8xl'
          >
            Joining{' '}
            <Text inherit variant='gradient' component='span'>
              {propsEvent.name}
            </Text>
          </Title>
          <Text
            data-sal='slide-up'
            data-sal-delay='300'
            className='mt-20 mb-4 w-full text-left text-xl font-semibold sm:text-center sm:text-2xl'
          >
            Please enter your name to join
          </Text>
          <form
            data-sal='slide-up'
            data-sal-delay='300'
            onSubmit={onSubmit}
            className='flex w-full flex-col items-center justify-center sm:flex-row'
          >
            <Input
              ref={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
              placeholder='Enter your name'
              autoFocus
              className='w-full sm:w-96'
              size='xl'
              style={{ textAlign: 'center' }}
            />
            <Button
              loading={mutation.isLoading}
              type='submit'
              variant='outline'
              className='mt-2 min-h-full w-full sm:ml-4 sm:mt-0 sm:w-auto'
              size='lg'
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
