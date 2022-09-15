import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { onValue, ref } from 'firebase/database'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { unstable_getServerSession } from 'next-auth'
import { useEffect } from 'react'

import { db } from '@/lib/firebase/firebase-client'
import { useEventStore } from '@/lib/hooks/useEventStore'
import { IEvent } from '@/lib/types/types'

import AdminLayout from '@/components/layout/AdminLayout'
import AdminEventDetailLeftSection from '@/components/pages/admin/events-detail/AdminEventDetailLeftSection'
import { OnlyPollingResult } from '@/components/PollResult'
import Seo from '@/components/Seo'

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]'
import { adminGetEventDetail } from '@/pages/server/events/event'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, nextAuthOptions)
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  const event = await adminGetEventDetail(context.params?.id as string)

  return {
    props: {
      event,
    },
  }
}

export default function EventDetailPage({ event: eventProps }: { event: IEvent }) {
  const {
    event,
    setEvent,
    computed: { activeQuestion },
  } = useEventStore()

  useEffect(() => {
    setEvent(eventProps)

    const eventDetail = ref(db, `events/${eventProps?.id}`)
    onValue(eventDetail, async (snapshot) => {
      const data = snapshot.val()
      setEvent(data)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id, eventProps, setEvent])

  return (
    <AdminLayout>
      <Seo title={`Natanya - ${event?.name}`} />

      <header className='bg-sky-900 pt-[3rem] pb-[18rem] shadow sm:pt-[6.6rem]'>
        <div className='mx-auto flex max-w-7xl items-center px-5'>
          <Link href='/admin'>
            <a
              data-sal='fade'
              data-sal-delay='200'
              className='mr-4 flex h-8 w-8 items-center justify-center rounded-lg border border-sky-800 p-1'
            >
              <ChevronLeftIcon className='h-6 w-6 text-white' />
            </a>
          </Link>
          <div data-sal='slide-right' className='flex items-baseline space-x-4'>
            <h1 className='text-2xl font-bold text-white sm:text-4xl'>{event?.name}</h1>
            <span className='text-sky-200'>#{event?.code}</span>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-7xl px-5'>
        <div className='-mt-[15rem] grid min-h-[70vh] w-full gap-x-5 gap-y-8 md:grid-cols-2'>
          <div className='flex-1 rounded-lg bg-white p-4 shadow md:p-8'>
            <AdminEventDetailLeftSection />
          </div>
          <div className='flex-1 rounded-lg bg-white shadow'>
            <div className='border-b border-sky-400 p-8'>
              <h2 className='text-2xl font-semibold'>{activeQuestion?.question}</h2>
            </div>
            {activeQuestion && (
              <div className='mt-2 space-y-4 p-8'>
                <OnlyPollingResult activeQuestion={activeQuestion} />
              </div>
            )}
          </div>
        </div>
      </main>
    </AdminLayout>
  )
}
