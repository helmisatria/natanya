import { Radio } from '@mantine/core'
import { useState } from 'react'

import Layout from '@/components/layout/Layout'

export default function HomePage() {
  // const router = useRouter()
  const [value, setValue] = useState('react')

  return (
    <Layout>
      <div className='container mx-auto min-h-screen'>
        <p className='pt-16 text-center text-lg font-semibold text-slate-600'>
          SMA 88 Yogyakarta
        </p>

        <h1 className='mt-44 text-center text-7xl font-black text-cyan-800'>
          Siapa ketua kelas terbaik?
        </h1>

        <div className='mt-16 flex justify-center'>
          <form
            onSubmit={(e) => e.preventDefault()}
            className='flex flex-col items-center'
          >
            <Radio.Group size='xl' value={value} onChange={setValue} required>
              <Radio value='react' label='React' />
              <Radio value='svelte' label='Svelte' />
              <Radio value='ng' label='Angular' />
              <Radio value='vue' label='Vue' />
            </Radio.Group>

            <button className='mt-16 rounded-lg border-4 border-cyan-600 bg-cyan-800 py-4 px-12 text-2xl font-bold text-white ring-offset-2 transition-all duration-200 hover:ring-4 active:bg-cyan-600'>
              Submit
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
