import { ArrowUturnLeftIcon, PlayIcon, PlusIcon, StopIcon } from '@heroicons/react/24/solid'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import clsxm from '@/lib/clsxm'
import { useEventStore } from '@/lib/hooks/useEventStore'
import { IQuestion } from '@/lib/types/types'

type AdminEventDetailLeftSectionProps = {
  setIsCreatingQuestion: (value: boolean) => void
}

export default function AdminEventDetailLeftSection({ setIsCreatingQuestion }: AdminEventDetailLeftSectionProps) {
  const {
    event,
    getQuestionAnsweredPercentage,
    computed: { participants, activeQuestion, selectedQuestion },
    setSelectedQuestionKey,
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

  const onCreateNewQuestion = () => {
    setIsCreatingQuestion(true)
  }

  return (
    <>
      <div>
        <div className='header flex flex-col flex-wrap justify-between space-y-3 md:flex-row md:items-center md:space-y-0'>
          {event?.questions ? (
            <div className='header-left flex items-center space-x-5'>
              <div className='flex items-center space-x-2'>
                {(event?.state === 'STARTED' || event?.state === 'ENDED') && (
                  <button
                    onClick={() => mutationUpdateEventState.mutate({ state: 'PRESTART' })}
                    className='flex items-center space-x-2 rounded-lg bg-green-800 py-2 px-3 ring-offset-2 hover:ring-2 focus:ring-2'
                  >
                    <ArrowUturnLeftIcon className='h-5 w-5 text-white' />
                  </button>
                )}

                {event?.state === 'PRESTART' && (
                  <button
                    onClick={() => mutationUpdateEventState.mutate({ state: 'STARTED' })}
                    className='flex items-center space-x-2 rounded-lg bg-green-800 py-2 px-3 ring-offset-2 hover:ring-2 focus:ring-2'
                  >
                    <PlayIcon className='h-5 w-5 text-white' />
                    <span className='text-sm font-bold text-white'>Start Event</span>
                  </button>
                )}

                {event?.state === 'STARTED' && (
                  <button
                    onClick={() => mutationUpdateEventState.mutate({ state: 'ENDED' })}
                    className='flex items-center space-x-2 rounded-lg bg-rose-800 py-2 px-3 ring-offset-2 hover:ring-2 focus:ring-2'
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
          ) : (
            <div></div>
          )}

          <div className='header-right'>
            <button
              onClick={onCreateNewQuestion}
              className='flex items-center space-x-2 rounded-lg border border-dashed border-sky-200 py-2 px-2.5 font-semibold text-sky-700 ring-offset-2 hover:ring-2 focus:ring-2'
            >
              <PlusIcon className='h-6 w-6 text-sky-700' />
              <span className='text-sm'>Add new question</span>
            </button>
          </div>
        </div>

        <section className='mt-8'>
          <ul className='space-y-3'>
            {Object.entries(questions)?.map?.(([questionKey, question]) => (
              <li
                key={question.id}
                data-sal='slide-up'
                className={clsxm([
                  'question-item cursor-pointer rounded ring-slate-400 ring-offset-2 transition-all duration-150 hover:ring-2',
                  selectedQuestion?.id === questionKey && 'ring-1 ring-sky-300 ',
                ])}
              >
                <div
                  tabIndex={0}
                  onClick={() => setSelectedQuestionKey(questionKey)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedQuestionKey(questionKey)
                    }
                  }}
                  className={clsxm(
                    'its flex w-full flex-col justify-between space-y-3 rounded-lg border-2 py-3 px-4 md:flex-row md:items-start md:space-y-0',
                    activeQuestion?.id === question.id && 'border-sky-300 bg-sky-50'
                  )}
                >
                  <div className='flex flex-col'>
                    <h3 className='text-left text-base font-semibold md:text-lg lg:mr-12'>{question.question}</h3>
                    <span className='text-left text-sm tracking-tight'>
                      Voters: {getQuestionAnsweredPercentage(question)}/{participants.length}
                    </span>
                  </div>

                  {question.options && (
                    <div className='flex space-x-2'>
                      <button
                        disabled={question.state === 'STARTED' && question.id === activeQuestion?.id}
                        onClick={() =>
                          mutationUpdateQuestionState.mutate({
                            questionKey,
                            state: 'STARTED',
                          })
                        }
                        className={clsxm(
                          'rounded-full border-2 border-green-600 bg-green-100 p-2',
                          question.state === 'STARTED' && question.id === activeQuestion?.id
                            ? 'opacity-50'
                            : 'ring-offset-2 hover:shadow-md hover:ring-2 focus:ring-2'
                        )}
                      >
                        <PlayIcon className='h-4 w-4 text-green-600 md:h-5 md:w-5' />
                      </button>
                      <button
                        disabled={question.state === 'ENDED' || question.id !== activeQuestion?.id}
                        onClick={() =>
                          mutationUpdateQuestionState.mutate({
                            questionKey,
                            state: 'ENDED',
                          })
                        }
                        className={clsxm(
                          'rounded-full border-2 border-pink-600 bg-pink-50 p-2',
                          question.state === 'ENDED' || question.id !== activeQuestion?.id
                            ? 'opacity-50'
                            : 'ring-offset-2 hover:shadow-md hover:ring-2 focus:ring-2'
                        )}
                      >
                        <StopIcon className='h-4 w-4 text-pink-600 md:h-5 md:w-5' />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
