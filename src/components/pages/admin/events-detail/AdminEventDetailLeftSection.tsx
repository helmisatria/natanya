import { ArrowUturnLeftIcon, PlayIcon, PlusIcon, StopIcon } from '@heroicons/react/24/solid'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import clsxm from '@/lib/clsxm'
import { useEventStore } from '@/lib/hooks/useEventStore'
import { IQuestion } from '@/lib/types/types'

export default function AdminEventDetailLeftSection() {
  const {
    event,
    getQuestionAnsweredPercentage,
    computed: { participants, activeQuestion },
  } = useEventStore()

  const questions = (event?.questions || []) as IQuestion[]

  const mutationUpdateEventState = useMutation(({ state }: { state: IQuestion['state'] }) => {
    return axios.put(`/api/admin/events/${event?.id}`, {
      state,
    })
  })

  const mutationUpdateQuestionState = useMutation(
    ({ questionKey, state }: { questionKey: string; state: IQuestion['state'] }) => {
      return axios.put(`/api/admin/events/${event?.id}/questions/${questionKey}`, {
        state,
      })
    }
  )

  return (
    <>
      <div>
        <div className='header flex flex-col flex-wrap justify-between space-y-3 md:flex-row md:items-center md:space-y-0'>
          <div className='header-left flex items-center space-x-5'>
            <div className='flex items-center space-x-2'>
              {(event?.state === 'STARTED' || event?.state === 'ENDED') && (
                <button
                  onClick={() => mutationUpdateEventState.mutate({ state: 'PRESTART' })}
                  className='flex items-center space-x-2 rounded-lg bg-green-800 py-2 px-3'
                >
                  <ArrowUturnLeftIcon className='h-5 w-5 text-white' />
                </button>
              )}

              {event?.state === 'PRESTART' && (
                <button
                  onClick={() => mutationUpdateEventState.mutate({ state: 'STARTED' })}
                  className='flex items-center space-x-2 rounded-lg bg-green-800 py-2 px-3'
                >
                  <PlayIcon className='h-5 w-5 text-white' />
                  <span className='text-sm font-bold text-white'>Start Event</span>
                </button>
              )}

              {event?.state === 'STARTED' && (
                <button
                  onClick={() => mutationUpdateEventState.mutate({ state: 'ENDED' })}
                  className='flex items-center space-x-2 rounded-lg bg-rose-800 py-2 px-3'
                >
                  <StopIcon className='h-5 w-5 text-white' />
                  <span className='text-sm font-bold text-white'>Stop Event</span>
                </button>
              )}
            </div>
            {event?.state === 'STARTED' && (
              <div className='flex items-center space-x-2.5'>
                <div className='h-[6px] w-[6px] rounded-full bg-green-600'></div>
                <span className='text-xs font-semibold text-green-600'>Event Started</span>
              </div>
            )}
            {event?.state === 'PRESTART' && (
              <div className='flex items-center space-x-2.5'>
                <div className='h-[6px] w-[6px] rounded-full bg-gray-600'></div>
                <span className='text-xs font-semibold text-gray-600'>Event Not Started</span>
              </div>
            )}
            {event?.state === 'ENDED' && (
              <div className='flex items-center space-x-2.5'>
                <div className='h-[6px] w-[6px] rounded-full bg-red-600'></div>
                <span className='text-xs font-semibold text-red-600'>Event Ended</span>
              </div>
            )}
          </div>
          <div className='header-right'>
            <button className='flex items-center space-x-2 rounded-lg border border-dashed border-sky-200 py-2 px-2.5 font-semibold text-sky-700'>
              <PlusIcon className='h-6 w-6 text-sky-700' />
              <span className='text-sm'>Add new question</span>
            </button>
          </div>
        </div>

        <section className='mt-8'>
          <ul className='space-y-3'>
            {questions?.map?.((question, index) => (
              <li key={question.id} data-sal='slide-up' className='question-item'>
                <div
                  className={clsxm(
                    'flex flex-col justify-between space-y-3 rounded-lg border-2  py-3 px-4 md:flex-row md:items-start md:space-y-0',
                    activeQuestion?.id === question.id && 'border-sky-300 bg-sky-50'
                  )}
                >
                  <div>
                    <h3 className='text-base font-semibold md:text-lg lg:mr-12'>{question.question}</h3>
                    <span className='text-sm tracking-tight'>
                      Voters: {getQuestionAnsweredPercentage(question)}/{participants.length}
                    </span>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      disabled={question.state === 'STARTED' && question.id === activeQuestion?.id}
                      onClick={() =>
                        mutationUpdateQuestionState.mutate({
                          questionKey: String(index),
                          state: 'STARTED',
                        })
                      }
                      className={clsxm(
                        'rounded-full border-2 border-green-600 bg-green-100 p-2',
                        question.state === 'STARTED' && question.id === activeQuestion?.id
                          ? 'opacity-50'
                          : 'hover:shadow-md'
                      )}
                    >
                      <PlayIcon className='h-4 w-4 text-green-600 md:h-5 md:w-5' />
                    </button>
                    <button
                      disabled={question.state === 'ENDED' || question.id !== activeQuestion?.id}
                      onClick={() =>
                        mutationUpdateQuestionState.mutate({
                          questionKey: String(index),
                          state: 'ENDED',
                        })
                      }
                      className={clsxm(
                        'rounded-full border-2 border-pink-600 bg-pink-50 p-2',
                        question.state === 'ENDED' || question.id !== activeQuestion?.id
                          ? 'opacity-50'
                          : 'hover:shadow-md'
                      )}
                    >
                      <StopIcon className='h-4 w-4 text-pink-600 md:h-5 md:w-5' />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
