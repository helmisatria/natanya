import { PlusIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { useQuery } from '@tanstack/react-query'
import { onValue, ref } from 'firebase/database'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { unstable_getServerSession } from 'next-auth'
import { useState } from 'react'

import { db } from '@/lib/firebase/firebase-client'
import { useEventStore } from '@/lib/hooks/useEventStore'

import AdminLayout from '@/components/layout/AdminLayout'
import AdminEventDetailLeftSection from '@/components/pages/admin/events-detail/AdminEventDetailLeftSection'
import DialogCreateNewOption from '@/components/pages/admin/events-detail/DialogCreateNewOption'
import DialogCreateNewQuestion from '@/components/pages/admin/events-detail/DialogCreateNewQuestion'
import { OnlyPollingResult } from '@/components/PollResult'
import Seo from '@/components/Seo'

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, nextAuthOptions)
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  // const event = await adminGetEventDetail(context.params?.id as string)

  return {
    props: {},
  }
}

export default function EventDetailPage() {
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false)
  const [isCreatingOption, setIsCreatingOption] = useState(false)

  const { query } = useRouter()

  const {
    event,
    setEvent,
    selectedQuestionKey,
    computed: { activeQuestion, selectedQuestion },
  } = useEventStore()

  const displayPollingResultQuestion = selectedQuestionKey ? selectedQuestion : activeQuestion

  const { refetch } = useQuery({
    queryKey: ['event', query?.id],
    queryFn: async () => {
      const eventDetail = ref(db, `events/${query?.id}`)
      onValue(eventDetail, async (snapshot) => {
        const data = await snapshot.val()
        setEvent(data)
      })
    },
    keepPreviousData: true,
  })

  return (
    <AdminLayout>
      <Seo title={`Natanya - ${event?.name}`} />

      <DialogCreateNewOption
        open={isCreatingOption}
        onClose={() => setIsCreatingOption(false)}
        onSuccess={refetch}
        questionId={activeQuestion?.id || ''}
      />

      <DialogCreateNewQuestion
        open={isCreatingQuestion}
        onClose={() => setIsCreatingQuestion(false)}
        onSuccess={refetch}
      />

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
            <AdminEventDetailLeftSection setIsCreatingQuestion={setIsCreatingQuestion} />
          </div>
          <div className='flex-1 rounded-lg bg-white shadow'>
            <div className='border-b border-sky-600 p-8'>
              <h2 className='text-2xl font-semibold'>{displayPollingResultQuestion?.question}</h2>
            </div>

            {activeQuestion && (
              <div className='mt-2 space-y-4 p-8'>
                <OnlyPollingResult activeQuestion={activeQuestion} />
              </div>
            )}

            <div className='m-6'>
              <button
                onClick={() => setIsCreatingOption(true)}
                className='flex items-center space-x-2 rounded-lg border border-dashed border-sky-200 py-2 px-2.5 font-semibold text-sky-700'
              >
                <PlusIcon className='h-6 w-6 text-sky-700' />
                <span className='text-sm'>Add new options</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  )
}
