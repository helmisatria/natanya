import { Title } from '@mantine/core'
import sortBy from 'lodash/sortBy'

import { useEventStore } from '@/lib/hooks/useEventStore'
import { IQuestion } from '@/lib/types/types'

type PollResultProps = {
  activeQuestion: IQuestion
}

export default function PollResult({ activeQuestion }: PollResultProps) {
  const {
    selectedQuestionKey,
    computed: { selectedQuestion },
  } = useEventStore()

  const displayPollingResult = selectedQuestionKey ? selectedQuestion : activeQuestion

  return (
    <div>
      <section className='sticky top-0 border-b px-5 py-7 sm:px-8'>
        <div data-sal='slide-up' data-sal-delay='0'>
          <p className='font-bold text-slate-800 underline'>Polling Result</p>
          <Title className='mt-2 text-4xl'>{displayPollingResult?.question}</Title>
        </div>
      </section>

      <section className='my-12 space-y-6 px-5 sm:px-8'>
        <OnlyPollingResult activeQuestion={activeQuestion} />
      </section>
    </div>
  )
}

const getProgressBarLength = (totalAnswer: number, totalQuestionAnswer: number) => {
  const result = totalAnswer / (totalQuestionAnswer || 1)
  if (result === 0) {
    return 1
  }

  return result * 100
}

export const OnlyPollingResult = ({ activeQuestion }: PollResultProps) => {
  const allOptions = activeQuestion.options || []
  const templateOptions = allOptions.reduce((prev, option) => ({ ...prev, [option]: 0 }), {} as Record<string, number>)

  const answers = Object.entries(activeQuestion?.answers || {}).reduce((prev, current) => {
    const [, answers] = current

    const answer = answers[0] as unknown as string
    const total = (prev?.[answer] || 0) + 1

    return {
      ...prev,
      [answer]: total,
    }
  }, templateOptions)

  const totalQuestionAnswer = Object.values(activeQuestion?.answers || {})?.length || 0

  const sortedAnswers = sortBy(Object.entries(answers), ([, total]) => total).reverse()

  return (
    <>
      {sortedAnswers.map(([answer, totalAnswer], index) => (
        <div
          data-sal='fade'
          data-sal-delay={150 * (index + 1)}
          className='space-y-1 md:space-y-2'
          key={String(index + 1)}
        >
          <p className='text-lg font-medium md:text-xl'>{answer}</p>
          <div className='flex items-center space-x-5 md:space-x-7'>
            <div
              className={`progress h-2 rounded-xl bg-sky-500 transition-all duration-150 md:h-3 ${
                index === 0 && 'bg-sky-900'
              }`}
              style={{ width: `${getProgressBarLength(totalAnswer, totalQuestionAnswer)}%` }}
            ></div>
            <span className='flex items-center text-lg font-semibold md:text-xl'>
              {((totalAnswer / (totalQuestionAnswer || 1)) * 100).toFixed(2)}%
              <span className='ml-2 whitespace-nowrap text-sm'>({totalAnswer} Voters)</span>
            </span>
          </div>
        </div>
      ))}
    </>
  )
}
