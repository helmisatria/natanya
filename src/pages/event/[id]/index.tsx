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
            </div>
          </main>
        )}

        {event.state === 'STARTED' && (
          <footer data-sal='fade' data-sal-delay='800' data-sal-duration='1000'>
            <div className='flex flex-col justify-center py-8 text-lg text-slate-500 sm:flex-row sm:space-x-2'>
              <p>People joined: {participants.length}</p>
              <span className='hidden sm:block'>•</span>
              <p>
                People answered: {questionAnswers.length} ({answeredPercentage}%)
              </p>
            </div>
          </footer>
        )}
      </div>
    </Layout>
  )
}
