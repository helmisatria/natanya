/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import * as React from 'react'
import { Toaster } from 'react-hot-toast'
import sal from 'sal.js'

import 'sal.js/dist/sal.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = useSession()

  React.useEffect(() => {
    sal({
      root: document.querySelector('#root'),
    })
  })

  return (
    <>
      <Toaster />

      <nav className='bg-sky-900'>
        <div className='mx-auto max-w-7xl border-b border-sky-800 bg-sky-900 px-5'>
          <ul className='flex items-center justify-between py-4'>
            <li className='rounded-lg bg-white py-1 px-2 font-semibold'>
              <Link href='/admin'>
                <a>Dashboard</a>
              </Link>
            </li>

            <li>
              <button className='h-12 w-12 rounded-full shadow-md'>
                <img
                  className='rounded-full'
                  width={48}
                  height={48}
                  src={session.data?.user?.image ?? ''}
                  alt='Avatar'
                />
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {children}
    </>
  )
}
