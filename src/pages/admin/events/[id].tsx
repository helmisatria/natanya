import { ClipboardDocumentCheckIcon, ClipboardIcon, PlusIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { CopyButton } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { onValue, ref } from 'firebase/database'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { unstable_getServerSession } from 'next-auth'
import { useState } from 'react'

import clsxm from '@/lib/clsxm'
import { db } from '@/lib/firebase/firebase-client'
import { getEventKey } from '@/lib/helper'
import { useEventStore } from '@/lib/hooks/useEventStore'
import { IEvent } from '@/lib/types/types'

import AdminLayout from '@/components/layout/AdminLayout'
import AdminEventDetailLeftSection from '@/components/pages/admin/events-detail/AdminEventDetailLeftSection'
import DialogCreateNewOption from '@/components/pages/admin/events-detail/DialogCreateNewOption'
import DialogCreateNewQuestion from '@/components/pages/admin/events-detail/DialogCreateNewQuestion'
import { AdminOnlyPollingResult } from '@/components/PollResultAdmin'
import Seo from '@/components/Seo'

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]'
import { adminGetEventDetail } from '@/server/events/event'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, nextAuthOptions)
  if (!session || !session?.user?.email) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  const event = await adminGetEventDetail(context.params?.id as string)
  const isCollaborator = event?.collaborators.includes(session.user?.email)

  if (!isCollaborator) {
    return { redirect: { destination: '/admin', permanent: false } }
  }

  return {
    props: {
      event,
    },
  }
}

export default function EventDetailPage({ event: eventProps }: { event: IEvent }) {
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false)
  const [isCreatingOption, setIsCreatingOption] = useState(false)

  const { query } = useRouter()

  const {
    setEvent,
    selectedQuestionKey,
    computed: { activeQuestion, selectedQuestion },
  } = useEventStore()

  const displayPollingResultQuestion = selectedQuestionKey ? selectedQuestion : activeQuestion ?? selectedQuestion

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
      <Seo title={`Natanya - ${eventProps?.name ?? ''}`} />

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

      <header className='bg-sky-900 bg-gradient-to-b from-sky-900 to-sky-800 pt-[3rem] pb-[18rem] shadow sm:pt-[6.2rem]'>
        <div className='mx-auto flex max-w-7xl px-5'>
          <div className='flex flex-col'>
            <div className='mb-1 opacity-0'>-</div>
            <Link href='/admin'>
              <a
                data-sal='fade'
                data-sal-delay='200'
                className='mr-4 flex h-8 w-8 items-center justify-center rounded-lg border border-sky-800 p-1 hover:ring-2'
              >
                <ChevronLeftIcon className='h-6 w-6 text-white' />
              </a>
            </Link>
          </div>
          <div className='flex flex-col'>
            <div className='flex flex-col'>
              <div data-sal='slide-right' className='flex space-x-3'>
                <span className='text-sky-200'>#{getEventKey(eventProps?.name)}</span>
                <span>
                  <span className='text-sky-200 text-opacity-40'>|</span>
                </span>
                <CopyButton value={`https://www.natanya.app/event/${query.id}`}>
                  {({ copy, copied }) => (
                    <button
                      onClick={copy}
                      className={clsxm([
                        'flex items-center space-x-1 text-sm text-sky-200',
                        !copied && 'hover:text-sky-300',
                      ])}
                    >
                      {copied ? (
                        <>
                          <ClipboardDocumentCheckIcon className='h-4 w-4 text-green-500' />
                          <span className='text-green-500'>Copied!</span>
                        </>
                      ) : (
                        <>
                          <ClipboardIcon className='h-4 w-4' />
                          <span>Copy link</span>
                        </>
                      )}
                    </button>
                  )}
                </CopyButton>
              </div>
              <h1 className='text-2xl font-bold text-white sm:text-4xl'>{eventProps?.name}</h1>
            </div>
            {eventProps?.description && (
              <div className='mt-1'>
                <p data-sal='slide-right' data-sal-delay='200' className='text-sky-200'>
                  {eventProps?.description}
                </p>
              </div>
            )}
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

            {displayPollingResultQuestion && (
              <div className='mt-2 space-y-4 p-8'>
                <AdminOnlyPollingResult />
              </div>
            )}

            <div className='m-6'>
              <button
                onClick={() => setIsCreatingOption(true)}
                className='flex items-center space-x-2 rounded-lg border border-dashed border-sky-200 py-2 px-2.5 font-semibold text-sky-700 ring-offset-2 hover:ring-2 focus:ring-2'
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
