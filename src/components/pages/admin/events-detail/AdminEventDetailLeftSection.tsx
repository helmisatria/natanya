import { CheckIcon, PlayIcon, PlusIcon, StopIcon } from '@heroicons/react/24/solid'

export default function AdminEventDetailLeftSection() {
  return (
    <div>
      <div className='header flex items-center justify-between'>
        <div className='header-left flex items-center space-x-5'>
          <button className='flex items-center space-x-2 rounded-lg bg-rose-800 py-2 px-3'>
            <StopIcon className='h-5 w-5 text-white' />
            <span className='text-sm font-bold text-white'>Stop Event</span>
          </button>
          <div className='flex items-center space-x-2.5'>
            <div className='h-[6px] w-[6px] rounded-full bg-green-600'></div>
            <span className='text-xs font-semibold text-green-600'>Event Started</span>
          </div>
        </div>
        <div className='header-right'>
          <button className='flex items-center space-x-2 rounded-lg border border-dashed border-sky-200 py-2 px-2.5 font-semibold text-sky-700'>
            <PlusIcon className='h-6 w-6 text-sky-700' />
            <span className='text-sm'>Add new question</span>
          </button>
        </div>
      </div>

      <section className='mt-8'>
        <ul>
          <li data-sal='slide-up' className='question-item'>
            <div className='flex items-center justify-between rounded-lg border-2 border-sky-300 bg-sky-50 py-3 px-4'>
              <div>
                <h3 className='text-xl font-semibold'>Siapa ketua kelas pilihanmu?</h3>
                <span className='text-sm tracking-tight'>Voters: 48</span>
              </div>
              <div className='space-x-2'>
                <button className='rounded-full border-2 border-green-600 bg-green-100 p-2 '>
                  <PlayIcon className='h-5 w-5 text-green-600' />
                </button>
                <button className='rounded-full border-2 border-pink-600 bg-pink-50 p-2 '>
                  <CheckIcon className='h-5 w-5 text-pink-600' />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  )
}
