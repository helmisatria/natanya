/* eslint-disable @next/next/no-img-element */
import { PlusIcon } from '@heroicons/react/24/solid'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { unstable_getServerSession } from 'next-auth'
import { useState } from 'react'

import { IEvent } from '@/lib/types/types'

import AdminLayout from '@/components/layout/AdminLayout'
import DialogCreateEvent from '@/components/pages/admin/dashboard/DialogCreateEvent'
import Seo from '@/components/Seo'

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, nextAuthOptions)
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  return {
    props: {},
  }
}

export default function AppPage() {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)

  const [events, setEvents] = useState<IEvent[]>([])

  const { refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/events')
      setEvents(data)
    },
  })

  return (
    <AdminLayout>
      <Seo title='Natanya - Admin Dashboard' />

      <DialogCreateEvent open={isCreatingEvent} onClose={() => setIsCreatingEvent(false)} onSuccess={() => refetch()} />

      <header className='bg-sky-900 pt-[3rem] pb-[18rem] shadow sm:pt-[5.4rem]'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-5'>
          <h1 data-sal='fade' className='text-2xl font-bold text-white sm:text-4xl'>
            Polling Events
          </h1>

          <button
            onClick={() => setIsCreatingEvent(true)}
            className='flex items-center space-x-2.5 rounded-lg border-2 border-sky-700 bg-sky-800 py-2 px-4 shadow hover:bg-sky-700 sm:px-6 sm:py-3'
          >
            <PlusIcon className='h-6 w-6 text-white' />
            <span className='font-semibold text-white'>New Event</span>
          </button>
        </div>
      </header>

      <main className='mx-auto max-w-7xl px-5'>
        <div className='-mt-[15rem] min-h-[60vh] w-full rounded-lg bg-white shadow-md'>
          <ul className='space-y-3 p-4 sm:p-8'>
            {events.map((event) => (
              <li key={event.id} data-sal='slide-up'>
                <Link href={`/admin/events/${event.key}`} passHref>
                  <a
                    href={`/admin/events/${event.key}`}
                    className='flex w-full flex-col items-start rounded border bg-white py-4 px-7 text-xl shadow sm:flex-row sm:space-x-3'
                  >
                    <span className='text-xl font-semibold'>{event.name}</span>{' '}
                    <span className='font-semibold text-slate-600'>#{event.code}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </AdminLayout>
  )
}
