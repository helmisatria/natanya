import sortBy from 'lodash/sortBy'

import { useEventStore } from '@/lib/hooks/useEventStore'
import { IQuestion } from '@/lib/types/types'

type PollResultProps = {
  activeQuestion: IQuestion
}

export const AdminOnlyPollingResult = ({ activeQuestion }: PollResultProps) => {
  const {
    event,
    selectedQuestionKey,
    computed: { selectedQuestion },
  } = useEventStore()

  const displayPollingResult = selectedQuestionKey ? selectedQuestion : activeQuestion

  const allOptions = (event?.questions?.[displayPollingResult?.id ?? ''] || {}).options || []
  const templateOptions = allOptions.reduce((prev, option) => ({ ...prev, [option]: 0 }), {} as Record<string, number>)

  const answers = Object.entries(displayPollingResult?.answers || {}).reduce((prev, current) => {
    const [, answers] = current

    const answer = answers[0] as unknown as string
    const total = (prev?.[answer] || 0) + 1

    return {
      ...prev,
      [answer]: total,
    }
  }, templateOptions)

  const totalQuestionAnswer = Object.values(displayPollingResult?.answers || {})?.length || 0

  const sortedAnswers = sortBy(Object.entries(answers), ([, total]) => total).reverse()

  const getProgressBarLength = (totalAnswer: number) => {
    const result = totalAnswer / (totalQuestionAnswer || 1)
    if (result === 0) {
      return 1
    }

    return result * 100
  }

  return (
    <>
      {sortedAnswers.map(([answer, totalAnswer], index) => (
        <div
          data-sal='fade'
          data-sal-delay={150 * (index + 1)}
          className='space-y-1 md:space-y-2'
          key={String(index + 1)}
        >
          <p className='font-medium'>{answer}</p>
          <div className='flex items-center space-x-5 md:space-x-7'>
            <div
              className={`progress h-2 rounded-xl bg-sky-500 transition-all duration-150 ${
                index === 0 && 'bg-sky-900'
              }`}
              style={{ width: `${getProgressBarLength(totalAnswer)}%` }}
            ></div>
            <span className='flex items-center text-lg font-semibold'>
              {((totalAnswer / (totalQuestionAnswer || 1)) * 100).toFixed(2)}%
              <span className='ml-2 whitespace-nowrap text-sm'>
                (<strong>{totalAnswer}</strong>/{totalQuestionAnswer} Voters)
              </span>
            </span>
          </div>
        </div>
      ))}
    </>
  )
}
