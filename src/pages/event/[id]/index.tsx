/* eslint-disable @next/next/no-img-element */
import { Loader, Title } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { onValue, ref } from 'firebase/database'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { getUser } from '@/lib/auth/user'
import clsxm from '@/lib/clsxm'
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

    const user = await getUser(context)

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

export default function HomePage({ event: propsEvent, user }: { event: IEvent; user: IUser }) {
  const [answer, setAnswer] = useState('')
  const [event, setEvent] = useState(propsEvent)
  const router = useRouter()

  const activeQuestion = event.questions?.[event.activeQuestionKey ?? '0']
  const participants = Object.values(event.userNames || {})
  const questionAnswers = Object.values(activeQuestion?.answers || {})
  const answeredPercentage = ((questionAnswers.length / participants.length || 0) * 100).toFixed(2)

  useEffect(() => {
    const events = ref(db, 'events/' + event.id)
    onValue(events, (snapshot) => {
      const data = snapshot.val()

      setEvent(data)
    })
  }, [event.id])

  const mutation = useMutation(
    (answer: string) => {
      const address = `/api/event/${event.id}/answer`
      return axios.post(address, { answers: [answer] })
    },
    {
      onError: (err) => {
        const error = err as AxiosError<{ message: string }>
        if (error?.response?.status === 401) {
          router.replace(`/event/${event.id}/join`)
        }
      },
    }
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate(answer, {
      onSuccess: () => {
        notify.success('Answer submitted')
      },
      onError: (err) => {
        const error = err as AxiosError<{ message: string }>
        if (error?.response?.status === 400) {
          notify.error(error?.response?.data?.message ?? 'Unknown error')
        }
      },
    })
  }

  const isAnsweredOption = (option: string) => {
    return (activeQuestion.answers || {})?.[user.name]?.[0] === option
  }

  const { ref: trackSizeRef, height: formHeight, width: formWidth } = useElementSize()

  return (
    <Layout key={event.activeQuestionKey}>
      <Seo />

      <div className='fixed inset-0 -bottom-[50px] z-[1] opacity-40'>
        <img
          data-sal='fade'
          data-sal-delay='200'
          data-sal-duration='900'
          className='absolute inset-x-0 -bottom-[30%] hidden h-[700px] min-h-0 w-[100%] min-w-[110%] object-cover object-top !opacity-80 sm:block lg:-bottom-[20%] xl:h-[720px] 2xl:-bottom-0'
          src='/images/mesh.png'
          alt=''
        ></img>
      </div>

      <div className='flex min-h-screen flex-col'>
        <nav className='mb-8 flex items-center justify-center'>
          <div data-sal='fade' data-sal-delay='800' data-sal-duration='1000' className='mt-6 rounded-lg bg-sky-50'>
            <p className='relative z-10 py-1 px-4 text-center text-sm font-semibold tracking-tight text-sky-500 sm:text-base'>
              {event.name}
            </p>
          </div>
        </nav>

        <section className='flex flex-1 flex-col'>
          {event.state === 'ENDED' ? (
            <div className='z-[2] mx-auto -mt-20 flex h-full w-full max-w-screen-lg flex-1 flex-col justify-center px-10 xl:px-0  '>
              <EventEndedContent />
            </div>
          ) : event.state === 'PRESTART' ? (
            <div className='z-[2] mx-auto -mt-20 flex h-full w-full max-w-screen-lg flex-1 flex-col justify-center px-10 xl:px-0 '>
              <WaitingEventStarted />
            </div>
          ) : activeQuestion.state === 'ENDED' ? (
            <div className='z-[2] mx-auto -mt-20 flex h-full w-full max-w-screen-lg flex-1 flex-col justify-center  '>
              <PollResult activeQuestion={activeQuestion} />
            </div>
          ) : (
            <div className={clsxm('z-[2] flex flex-1 flex-col sm:mt-8 lg:mt-10 lg:justify-start xl:mt-24 2xl:mt-36')}>
              <div>
                <div
                  className='sticky top-0 z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-5 pt-4 sm:px-8'
                  style={{
                    background:
                      'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.588542) 70.44%, rgba(255, 255, 255, 0) 100%)',
                  }}
                >
                  <Title
                    data-sal='slide-up'
                    className='text-center text-3xl text-gray-800 lg:max-w-[80%] lg:text-4xl xl:max-w-[70%] xl:text-5xl'
                  >
                    {activeQuestion.question}
                  </Title>
                  <p data-sal='slide-up' data-sal-delay='150' className='mt-2 text-sm text-slate-600 sm:text-base'>
                    Please choose one of the answer
                  </p>
                </div>

                {activeQuestion.state === 'PRESTART' && (
                  <div
                    data-sal='slide-up'
                    data-sal-delay='300'
                    className='z-[2] mx-auto my-12 flex w-full max-w-7xl items-center justify-center space-x-2 px-5 sm:px-8'
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
                  <div className='mt-12 flex'>
                    <form
                      onSubmit={handleSubmit}
                      ref={trackSizeRef}
                      className='z-[2] mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-5 sm:px-16'
                    >
                      <div className='grid w-full gap-y-2 gap-x-4 sm:grid-cols-2 md:gap-y-3'>
                        {activeQuestion?.options?.map((option, i) => (
                          <RadioBlock
                            key={i}
                            id={String(i)}
                            isAnsweredOption={isAnsweredOption(option)}
                            value={option}
                            onChange={(e) => setAnswer(e.target.value)}
                          />
                        ))}
                      </div>

                      <div className={clsxm(formHeight > 650 || formWidth < 360 ? 'mt-32' : 'mt-12')}></div>
                      <div className='sticky bottom-14 md:bottom-[80px]'>
                        <button
                          data-sal='slide-up'
                          data-sal-delay='600'
                          disabled={mutation.isLoading}
                          className={clsxm(
                            mutation.isLoading && 'cursor-wait border-none !bg-gray-400 !ring-0',
                            'flex items-center space-x-4 rounded-lg border-4 border-sky-700 bg-sky-600 py-2 px-6 text-lg font-bold text-white ring-sky-500 ring-offset-2 transition-all duration-200 focus-within:ring-4 hover:bg-opacity-95 hover:ring-4 active:bg-sky-700 md:py-[10px] md:px-10 md:text-xl'
                          )}
                        >
                          {mutation.isLoading && <Loader color='white' className='m-1 h-7 w-7' />}
                          <span>Submit answer</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {event.state === 'STARTED' && (
            <footer
              className='fixed inset-x-0 bottom-0 flex w-screen justify-center'
              style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 20%, #FFFFFF 100%)' }}
              data-sal='fade'
              data-sal-delay='800'
              data-sal-duration='1000'
            >
              <div className='flex flex-wrap justify-center space-x-2 px-5 py-6 text-xs text-slate-500 sm:text-sm'>
                <p>People joined: {participants.length}</p>
                {activeQuestion.state === 'STARTED' && (
                  <>
                    <span className=''>•</span>
                    <p>
                      People answered: {questionAnswers.length} ({answeredPercentage}%)
                    </p>
                  </>
                )}
              </div>
            </footer>
          )}
        </section>
      </div>
    </Layout>
  )
}
