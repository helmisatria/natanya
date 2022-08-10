import { Title } from '@mantine/core'

export default function PollResult() {
  return (
    <div>
      <section className='sticky top-0 border-b bg-white py-7'>
        <div data-sal='slide-up' data-sal-delay='0'>
          <p className='font-bold text-slate-800 underline'>Polling Result</p>
          <Title className='mt-2 text-4xl'>Siapa ketua kelas terbaik?</Title>
        </div>
      </section>

      <section className='my-12 space-y-6'>
        {Array(3)
          .fill(0)
          .map((_, i) => i + 1)
          .map((i, index) => (
            <div data-sal='fade' data-sal-delay={150 * i} className='space-y-1 md:space-y-2' key={String(i)}>
              <p className='text-lg font-medium md:text-xl'>Option 4</p>
              <div className='flex items-center space-x-5 md:space-x-7'>
                <div
                  className={`progress h-2 rounded-xl bg-cyan-500 transition-all duration-150 md:h-3 ${
                    index === 0 && 'bg-cyan-900'
                  }`}
                  style={{ width: `${100 - 10 * i}%` }}
                ></div>
                <span className='text-lg font-semibold md:text-xl'>{100 - 10 * i}%</span>
              </div>
            </div>
          ))}
      </section>
    </div>
  )
}
