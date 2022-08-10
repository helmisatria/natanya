import { Loader, Title } from '@mantine/core'

export default function WaitingEventStarted() {
  return (
    <div>
      <section className='flex flex-col items-center py-7'>
        <Loader size='lg' data-sal='slide-up' data-sal-delay='200' />
        <Title className='mt-8 text-center text-2xl md:text-4xl 2xl:text-5xl' data-sal='slide-up' data-sal-delay=''>
          Waiting for event to start, please wait
        </Title>
      </section>
    </div>
  )
}
