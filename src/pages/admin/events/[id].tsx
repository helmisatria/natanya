/* eslint-disable unused-imports/no-unused-vars */
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import AdminLayout from '@/components/layout/AdminLayout'
import AdminEventDetailLeftSection from '@/components/pages/admin/events-detail/AdminEventDetailLeftSection'

import { redirectAdminGuard } from '@/pages/api/auth/[...nextauth]'

export const getServerSideProps: GetServerSideProps = async (context) => redirectAdminGuard(context)

export default function EventDetailPage() {
  const session = useSession()

  return (
    <AdminLayout>
      <header className='bg-sky-900 pt-[3rem] pb-[18rem] shadow sm:pt-[6.6rem]'>
        <div className='mx-auto flex max-w-7xl items-center px-5'>
          <Link href='/admin'>
            <a
              data-sal='fade'
              data-sal-delay='200'
              className='mr-4 flex h-8 w-8 items-center justify-center rounded-lg border border-sky-800 p-1'
            >
              <ChevronLeftIcon className='h-6 w-6 text-white' />
            </a>
          </Link>
          <div data-sal='slide-right' className='flex items-baseline space-x-4'>
            <h1 className='text-2xl font-bold text-white sm:text-4xl'>Special Event</h1>
            <span className='text-sky-200'>#888-248</span>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-7xl px-5'>
        <div className='-mt-[15rem] grid min-h-[70vh] w-full grid-cols-2 gap-x-5 gap-y-8'>
          <div className='flex-1 rounded-lg bg-white p-8 shadow'>
            <AdminEventDetailLeftSection />
          </div>
          <div className='flex-1 rounded-lg bg-white shadow'>
            <div className='border-b border-sky-400 p-8'>
              <h2 className='text-2xl font-semibold'>Siapa ketua kelas pilihanmu?</h2>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  )
}
