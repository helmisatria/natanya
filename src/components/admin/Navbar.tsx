import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Fragment } from 'react'

import clsxm from '@/lib/clsxm'

export default function Navbar() {
  const session = useSession()

  return (
    <nav className='bg-sky-900'>
      <div className='mx-auto flex max-w-7xl items-center justify-between border-b border-sky-800 bg-sky-900 py-4 px-5'>
        <ul className='flex items-center'>
          <li className=' font-semibold'>
            <Link href='/admin'>
              <a className='rounded-lg bg-white py-2 px-3 ring-offset-2 transition-all duration-100 hover:ring-2 focus:ring-2'>
                Dashboard
              </a>
            </Link>
          </li>
        </ul>

        <Menu as='div' className='relative inline-block py-1 text-left'>
          <div>
            <Menu.Button className='h-10 w-10 rounded-full ring-offset-2 transition-all duration-100 hover:ring-2 focus:ring-2'>
              <Image
                className='rounded-full object-cover'
                width={40}
                height={40}
                src={session.data?.user?.image ?? ''}
                alt='Avatar'
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='px-4 py-3'>
                <p className='text-sm'>Signed in as</p>
                <p className='truncate text-sm font-medium text-gray-900'>{session.data?.user?.email ?? ''}</p>
              </div>
              <div className='py-1'>
                <form method='GET' action='/admin/logout'>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type='submit'
                        className={clsxm(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block w-full px-4 py-2 text-left text-sm'
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </form>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </nav>
  )
}
