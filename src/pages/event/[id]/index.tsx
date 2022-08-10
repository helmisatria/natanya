import { Title } from '@mantine/core'
import axios, { AxiosError } from 'axios'
import { onValue, ref } from 'firebase/database'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'

import { getUser } from '@/lib/auth/user'
import { db } from '@/lib/firebase/firebase-client'
import { notify } from '@/lib/helper'
import { IEvent, IUser } from '@/lib/types/types'

import EventEndedContent from '@/components/EventEnded'
import Layout from '@/components/layout/Layout'
import PollResult from '@/components/PollResult'
import RadioBlock from '@/components/RadioBlock'
import Seo from '@/components/Seo'
import WaitingEventStarted from '@/components/WaitingEventStarted'

const redirectTo = (path: string) => {
  return {
    redirect: {
      permanent: false,
      destination: path,
    },
    props: {},
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const host = context.req.headers.host
  const joinPath = `/event/${context.query.id}/join`

  try {
    const { data: event } = await axios.get(`http://${host}/api/event/${context.query.id}`)

    const user = getUser(context)

    if (!event) return redirectTo('/')
    if (!user) return redirectTo(joinPath)

    return {
      props: { event, user },
    }
  } catch (error) {
    if ((error as AxiosError)?.response?.status === 401) {
      return redirectTo(joinPath)
    }
  }

  return redirectTo('/')
}

export default function HomePage({ event: propsEvent }: { event: IEvent; user: IUser }) {
  const [answer, setAnswer] = useState('')
  const [event, setEvent] = useState(propsEvent)

  const activeQuestion = event.questions[event.activeQuestionKey ?? '0']
  const participants = Object.values(event.userNames || {})
  const questionAnswers = Object.values(activeQuestion.answers || {})
  const answeredPercentage = ((questionAnswers.length / participants.length) * 100).toFixed(2)

  useEffect(() => {
    const events = ref(db, 'events/' + event.id)
    onValue(events, (snapshot) => {
      const data = snapshot.val()

      setEvent(data)
    })
  }, [event.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const address = `/api/event/${event.id}/answer`

    try {
      const result = await axios.post(address, {
        answers: [answer],
      })

      if (result.status === 200) {
        notify.success('Answer submitted')
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>
      if ((error as AxiosError)?.response?.status === 400) {
        return notify.error(error?.response?.data?.message ?? 'Unknown error')
      }
    }
  }

  return (
    <Layout key={event.activeQuestionKey}>
      <Seo />

      <div className='container mx-auto flex min-h-screen max-w-7xl flex-col px-6 lg:px-0'>
        <p
          data-sal='fade'
          data-sal-delay='800'
          data-sal-duration='1000'
          className='relative z-10 pt-6 text-center text-sm font-semibold text-slate-600 md:text-lg lg:pt-12 2xl:pt-16'
        >
          {event.name}
        </p>

        {event.state === 'ENDED' ? (
          <main className='mx-auto -mt-32 flex w-full max-w-screen-md flex-1 flex-col justify-center 2xl:max-w-screen-lg'>
            <EventEndedContent />
          </main>
        ) : event.state === 'PRESTART' ? (
          <main className='mx-auto -mt-32 flex w-full max-w-screen-md flex-1 flex-col justify-center 2xl:max-w-screen-lg'>
            <WaitingEventStarted />
          </main>
        ) : activeQuestion.state === 'ENDED' ? (
          <main className='mx-auto -mt-12 flex w-full max-w-screen-md flex-1 flex-col justify-center'>
            <PollResult activeQuestion={activeQuestion} />
          </main>
        ) : (
          <main className='2xl:-mt-42 flex flex-1 flex-col justify-center lg:-mt-24 xl:-mt-44'>
            <div>
              <div className='mx-auto max-w-3xl xl:max-w-4xl 2xl:max-w-7xl'>
                <Title
                  data-sal='slide-up'
                  className='mt-12 text-center font-primary text-3xl text-gray-800 sm:text-5xl lg:mt-32 xl:mt-52 xl:text-6xl 2xl:text-7xl'
                >
                  {activeQuestion.question}
                </Title>
              </div>

              {activeQuestion.state === 'PRESTART' && (
                <div
                  data-sal='slide-up'
                  data-sal-delay='300'
                  className='mx-auto my-12 flex w-full items-center justify-center space-x-2'
                >
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18C7.87827 18 5.84344 17.1571 4.34315 15.6569C2.84285 14.1566 2 12.1217 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10V10ZM11 6C11 6.26522 10.8946 6.51957 10.7071 6.70711C10.5196 6.89464 10.2652 7 10 7C9.73478 7 9.48043 6.89464 9.29289 6.70711C9.10536 6.51957 9 6.26522 9 6C9 5.73478 9.10536 5.48043 9.29289 5.29289C9.48043 5.10536 9.73478 5 10 5C10.2652 5 10.5196 5.10536 10.7071 5.29289C10.8946 5.48043 11 5.73478 11 6ZM9 9C8.73478 9 8.48043 9.10536 8.29289 9.29289C8.10536 9.48043 8 9.73478 8 10C8 10.2652 8.10536 10.5196 8.29289 10.7071C8.48043 10.8946 8.73478 11 9 11V14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15H11C11.2652 15 11.5196 14.8946 11.7071 14.7071C11.8946 14.5196 12 14.2652 12 14C12 13.7348 11.8946 13.4804 11.7071 13.2929C11.5196 13.1054 11.2652 13 11 13V10C11 9.73478 10.8946 9.48043 10.7071 9.29289C10.5196 9.10536 10.2652 9 10 9H9Z'
                      fill='#374151'
                    />
                  </svg>

                  <p className='text-sm text-slate-800 md:text-base'>Answers will appear soon</p>
                </div>
              )}

              {activeQuestion.state === 'STARTED' && (
                <div className='mt-16 flex justify-center'>
                  <form
                    data-sal='slide-up'
                    data-sal-delay='300'
                    onSubmit={handleSubmit}
                    className='flex w-full max-w-6xl flex-col items-center justify-center md:max-w-5xl lg:px-12 2xl:max-w-7xl'
                  >
                    <div className='grid w-full gap-y-2 gap-x-4 sm:grid-cols-2 md:gap-y-4'>
                      {activeQuestion.options.map((option, i) => (
                        <RadioBlock key={i} id={String(i)} value={option} onChange={(e) => setAnswer(e.target.value)} />
                      ))}
                    </div>

                    <button
                      data-sal='slide-up'
                      data-sal-delay='600'
                      className='mt-16 rounded-lg border-4 border-cyan-600 bg-cyan-800 py-4 px-12 text-2xl font-bold text-white ring-offset-2 transition-all duration-200 hover:ring-4 active:bg-cyan-700'
                    >
                      Submit Answer
                    </button>
                  </form>
                </div>
              )}
            </div>
          </main>
        )}

        {event.state === 'STARTED' && (
          <footer data-sal='fade' data-sal-delay='800' data-sal-duration='1000'>
            <div className='flex flex-col justify-center py-8 text-lg text-slate-500 sm:flex-row sm:space-x-2'>
              <p>People joined: {participants.length}</p>
              {activeQuestion.state === 'STARTED' && (
                <>
                  <span className='hidden sm:block'>•</span>
                  <p>
                    People answered: {questionAnswers.length} ({answeredPercentage}%)
                  </p>
                </>
              )}
            </div>
          </footer>
        )}
      </div>
    </Layout>
  )
}
