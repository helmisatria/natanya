/* eslint-disable @next/next/no-img-element */
import { ArrowRightIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { Loader, Text, Title } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

import { getUser } from '@/lib/auth/user'
import { redirectTo } from '@/lib/helper'
import { IEvent } from '@/lib/types/types'

import { NatanyaIcon } from '@/components/icons/Natanya'
import Layout from '@/components/layout/Layout'
import Seo from '@/components/Seo'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const host = context.req.headers.host
  const event = await (await fetch(`http://${host}/api/event/` + context.query.id)).json()

  const user = await getUser(context)

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

      <main className='relative overflow-y-hidden'>
        <img
          data-sal='fade'
          data-sal-delay='100'
          data-sal-duration='900'
          className='absolute inset-x-0 -bottom-[30%] hidden h-[700px] min-h-0 w-[100%] min-w-[110%] object-cover object-top !opacity-80 sm:block lg:-bottom-[20%] xl:h-[720px] 2xl:-bottom-0'
          src='/images/mesh.png'
          alt=''
        ></img>

        <img
          className='absolute inset-0 -right-[10%] -top-[8%] block h-screen w-[100%] object-cover object-left opacity-80 sm:hidden'
          src='/images/mobile-mesh.png'
          alt=''
        ></img>

        <div className='relative z-20 mx-auto flex min-h-screen max-w-6xl flex-col overflow-y-hidden px-6 py-8 sm:py-20 sm:px-12 lg:max-w-7xl lg:px-28 xl:px-12'>
          <nav className='z-10'>
            <Link href='/'>
              <a>
                <div className='w-36 cursor-pointer opacity-70 transition-opacity duration-150 hover:opacity-100 sm:w-[164px]'>
                  <NatanyaIcon />
                </div>
              </a>
            </Link>
          </nav>

          <section className='mt-20 flex flex-1 flex-col justify-center sm:-mt-12'>
            <div>
              <Title
                data-sal='slide-up'
                data-sal-delay='0'
                className='inline-flex rounded-lg bg-sky-700 py-2 px-4 text-xl font-semibold leading-none text-white'
              >
                Joining {propsEvent.name}
              </Title>
            </div>
            <Text
              data-sal='slide-up'
              data-sal-delay='200'
              className='mt-5 text-6xl font-bold tracking-tight text-sky-900 sm:text-6xl'
            >
              Please enter your name to join
            </Text>
            <form
              data-sal='slide-up'
              data-sal-delay='400'
              onSubmit={onSubmit}
              className='mt-10 flex w-full flex-col items-end space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'
            >
              <div>
                <label htmlFor='user-name' className='mb-2 block text-lg font-semibold text-slate-600'>
                  Display Name
                </label>
                <div className='relative rounded-lg shadow-md'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6'>
                    <UserCircleIcon className='h-7 w-7 text-sky-800 text-opacity-50' />
                  </div>
                  <input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                    ref={input}
                    type='text'
                    required
                    name='user-name'
                    id='user-name'
                    className='block h-full w-full rounded-lg border-2 border-sky-600 py-6 px-16 text-lg focus:border-sky-700 focus:ring-sky-700 sm:text-2xl'
                    placeholder='Enter your name'
                    aria-describedby='user-name'
                  />
                </div>
              </div>

              <button
                disabled={mutation.isLoading}
                className='flex justify-center rounded-lg border-2 border-sky-600 p-6 text-center shadow-md transition-all duration-150 hover:border-sky-700 hover:bg-sky-50 focus-visible:border-sky-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200'
              >
                {mutation.isLoading ? (
                  <div className='flex items-center space-x-3 sm:space-x-0'>
                    <span className='block text-lg font-medium text-slate-600 sm:hidden'>Checking Event</span>
                    <Loader size={30} color='gray' />
                  </div>
                ) : (
                  <div className='flex items-center space-x-3 sm:space-x-0'>
                    <span className='block text-lg font-medium text-sky-900 sm:hidden'>Join Event</span>
                    <ArrowRightIcon className='h-[30px] w-[30px] text-sky-900' />
                  </div>
                )}
              </button>
            </form>
          </section>
        </div>
      </main>
    </Layout>
  )
}
