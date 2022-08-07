import { Radio, Title } from '@mantine/core'
import axios, { AxiosError } from 'axios'
import { onValue, ref } from 'firebase/database'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'

import { getUser } from '@/lib/auth/user'
import { db } from '@/lib/firebase/firebase-client'
import { notify } from '@/lib/helper'
import { IEvent, IUser } from '@/lib/types/types'

import Layout from '@/components/layout/Layout'

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
    <Layout>
      <div className='container mx-auto flex min-h-screen max-w-7xl flex-col px-6 lg:px-0'>
        <p className='pt-16 text-center text-lg font-semibold text-slate-600'>{event.name}</p>

        <main className='flex-1'>
          <div className='mx-auto max-w-3xl xl:max-w-none'>
            <Title className='mt-32 text-center font-primary text-3xl font-black text-cyan-800 sm:text-5xl md:mt-52 xl:text-7xl'>
              {activeQuestion.question}
            </Title>
          </div>

          <div className='mt-16 flex justify-center'>
            <form onSubmit={handleSubmit} className='flex flex-col items-center'>
              <Radio.Group size='xl' value={answer} onChange={setAnswer} required>
                {activeQuestion.options.map((option, i) => (
                  <Radio key={i} value={option} label={option} />
                ))}
              </Radio.Group>

              <button className='mt-16 rounded-lg border-4 border-cyan-600 bg-cyan-800 py-4 px-12 text-2xl font-bold text-white ring-offset-2 transition-all duration-200 hover:ring-4 active:bg-cyan-700'>
                Submit
              </button>
            </form>
          </div>
        </main>

        <footer>
          <div className='flex justify-center space-x-2 py-8 text-lg'>
            <p>People joined: {participants.length}</p>
            <p>
              People answered: {questionAnswers.length} ({answeredPercentage}%)
            </p>
          </div>
        </footer>
      </div>
    </Layout>
  )
}
