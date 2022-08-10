import { Title } from '@mantine/core'

export default function EventEndedContent() {
  return (
    <div>
      <section className='flex flex-col items-center py-7'>
        <span className='text-5xl'>👋</span>
        <Title className='mt-8 text-center text-2xl md:text-4xl 2xl:text-5xl' data-sal='slide-up' data-sal-delay=''>
          Event has ended, thank you for your participation
        </Title>
      </section>
    </div>
  )
}
