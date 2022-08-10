import { Title } from '@mantine/core'

import { IQuestion } from '@/lib/types/types'

type PollResultProps = {
  activeQuestion: IQuestion
}

export default function PollResult({ activeQuestion }: PollResultProps) {
  const totalQuestionAnswer = Object.values(activeQuestion.answers)?.length || 0
  const answers = Object.entries(activeQuestion.answers).reduce((prev, current) => {
    const [, answers] = current

    const answer = answers[0] as unknown as string
    const total = (prev?.[answer] || 0) + 1

    return {
      ...prev,
      [answer]: total,
    }
  }, {} as { [key: string]: number })

  return (
    <div>
      <section className='sticky top-0 border-b bg-white py-7'>
        <div data-sal='slide-up' data-sal-delay='0'>
          <p className='font-bold text-slate-800 underline'>Polling Result</p>
          <Title className='mt-2 text-4xl'>{activeQuestion.question}</Title>
        </div>
      </section>

      <section className='my-12 space-y-6'>
        {Object.entries(answers).map(([answer, totalAnswer], index) => (
          <div
            data-sal='fade'
            data-sal-delay={150 * (index + 1)}
            className='space-y-1 md:space-y-2'
            key={String(index + 1)}
          >
            <p className='text-lg font-medium md:text-xl'>{answer}</p>
            <div className='flex items-center space-x-5 md:space-x-7'>
              <div
                className={`progress h-2 rounded-xl bg-cyan-500 transition-all duration-150 md:h-3 ${
                  index === 0 && 'bg-cyan-900'
                }`}
                style={{ width: `${(totalAnswer / totalQuestionAnswer) * 100}%` }}
              ></div>
              <span className='text-lg font-semibold md:text-xl'>
                {((totalAnswer / totalQuestionAnswer) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}