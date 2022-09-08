/* eslint-disable @next/next/no-img-element */
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { Loader, Title } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import * as React from 'react'

import { notify } from '@/lib/helper'

import { NatanyaIcon } from '@/components/icons/Natanya'
import Layout from '@/components/layout/Layout'
import Seo from '@/components/Seo'

export default function HomePage() {
  const router = useRouter()
  const input = React.useRef<HTMLInputElement>(null)

  const mutation = useMutation((code: string) => {
    return axios.get(`/api/event/${code}`)
  })

  const [eventCode, setEventCode] = React.useState('')

  React.useEffect(() => {
    input.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutation.mutate(eventCode, {
      onSuccess: ({ data }) => {
        if (!data) {
          notify.error('Event not found')
        }

        router.push(`/event/${data.id}`)
      },
    })
  }

  return (
    <Layout>
      <Seo />
      <main className='relative overflow-y-hidden'>
        <img
          className='absolute inset-x-0 -bottom-[30%] hidden h-[700px] min-h-0 w-[100%] min-w-[110%] object-cover object-top opacity-80 sm:block lg:-bottom-[20%] xl:h-[720px] 2xl:-bottom-0'
          src='/images/mesh.png'
          alt=''
        ></img>

        <img
          className='absolute inset-0 -right-[10%] -top-[8%] block h-screen w-[100%] object-cover object-left opacity-80 sm:hidden'
          src='/images/mobile-mesh.png'
          alt=''
        ></img>

        <div className='relative z-20 mx-auto flex min-h-screen max-w-6xl flex-col overflow-y-hidden px-6 py-20 sm:px-12 lg:max-w-7xl lg:px-28 xl:px-12'>
          <nav>
            <div className='w-36 opacity-70 sm:w-[164px]'>
              <NatanyaIcon />
            </div>
          </nav>

          <section className='flex flex-1 flex-col justify-center lg:-mt-24'>
            <Title data-sal='slide-up' className='text-6xl font-bold tracking-tight text-sky-900 sm:text-7xl'>
              Joining Polling Event?
            </Title>

            <form
              data-sal='slide-up'
              data-sal-delay='300'
              onSubmit={handleSubmit}
              className='mt-8 flex w-full flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'
            >
              <div className='relative rounded-lg shadow-md'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6'>
                  <svg width='18' height='22' viewBox='0 0 18 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M2.25 7.25H17.25M0.75 14.75H15.75M13.95 1.25L10.05 20.75M7.95 1.25L4.05 20.75'
                      stroke='#6B7280'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventCode(e.target.value)}
                  ref={input}
                  type='text'
                  required
                  name='event-code'
                  id='event-code'
                  className='block h-full w-full rounded-lg border-2 border-sky-600 py-6 px-16 text-xl focus:border-sky-700 focus:ring-sky-700 sm:text-2xl'
                  placeholder='Enter event code here'
                  aria-describedby='event-code'
                />
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
