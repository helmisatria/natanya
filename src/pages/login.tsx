/* eslint-disable @next/next/no-img-element */
import { Title } from '@mantine/core'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

import { NatanyaIcon } from '@/components/icons/Natanya'
import Layout from '@/components/layout/Layout'
import Seo from '@/components/Seo'

export default function LoginPage() {
  const onLogin = async () => {
    const data = await signIn('google', {})

    if (data?.ok) {
      window.location.href = '/admin'
    }
  }

  return (
    <Layout>
      <Seo />
      <main className='relative overflow-y-hidden'>
        <img
          data-sal='fade'
          data-sal-delay='200'
          data-sal-duration='900'
          className='absolute inset-x-0 -bottom-[30%] hidden h-[700px] min-h-0 w-[100%] min-w-[110%] object-cover object-top !opacity-80 sm:block lg:-bottom-[20%] xl:h-[720px] 2xl:-bottom-0'
          src='/images/mesh.png'
          alt=''
        ></img>

        <img
          className='absolute inset-0 -right-[10%] -top-[8%] block h-screen w-[100%] object-cover object-left !opacity-80 sm:hidden'
          src='/images/mobile-mesh.png'
          alt=''
        ></img>

        <div className='relative z-20 mx-auto flex min-h-screen max-w-6xl flex-col overflow-y-hidden px-6 py-8 sm:py-20 sm:px-12 lg:max-w-7xl lg:px-28 xl:px-12'>
          <nav className='z-10 flex'>
            <Link href='/'>
              <a className='w-36 cursor-pointer opacity-70 transition-opacity duration-150 hover:opacity-100 sm:w-[164px]'>
                <NatanyaIcon />
              </a>
            </Link>
          </nav>

          <section className='mt-20 flex flex-1 flex-col justify-center'>
            <span data-sal='slide-up' className='font-medium text-sky-800 sm:text-xl'>
              Login to natanya dashboard
            </span>
            <Title
              data-sal='slide-up'
              className='mt-[10px] text-[2rem] font-bold leading-[120%] tracking-tight text-gray-900 sm:mt-3 sm:text-7xl'
            >
              Manage your survey <br /> <span className='underline'>with free</span>
            </Title>

            <div data-sal='slide-up' className='flex'>
              <p className='mt-4 rounded-full border border-sky-900 bg-sky-50 py-1 px-6 text-xs font-semibold text-sky-900 sm:mt-6 sm:text-base'>
                Slido & Mentimeter Alternatives
              </p>
            </div>

            <div data-sal='slide-up' data-sal-delay='200' className='mt-12 flex sm:mt-24'>
              <button onClick={onLogin} className='flex w-[20rem] items-center rounded-lg bg-gray-900 p-3'>
                <div className='rounded-md bg-white p-1'>
                  <svg
                    className='h-[32px] w-[32px]'
                    viewBox='0 0 480 480'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M436.11 200.83H420V200H240V280H353.03C336.54 326.57 292.23 360 240 360C173.73 360 120 306.27 120 240C120 173.73 173.73 120 240 120C270.59 120 298.42 131.54 319.61 150.39L376.18 93.82C340.46 60.53 292.68 40 240 40C129.55 40 40 129.55 40 240C40 350.45 129.55 440 240 440C350.45 440 440 350.45 440 240C440 226.59 438.62 213.5 436.11 200.83Z'
                      fill='#FFC107'
                    />
                    <path
                      d='M63.0601 146.91L128.77 195.1C146.55 151.08 189.61 120 240 120C270.59 120 298.42 131.54 319.61 150.39L376.18 93.82C340.46 60.53 292.68 40 240 40C163.18 40 96.5601 83.37 63.0601 146.91Z'
                      fill='#FF3D00'
                    />
                    <path
                      d='M240 440C291.66 440 338.6 420.23 374.09 388.08L312.19 335.7C292.11 350.91 267.15 360 240 360C187.98 360 143.81 326.83 127.17 280.54L61.95 330.79C95.05 395.56 162.27 440 240 440Z'
                      fill='#4CAF50'
                    />
                    <path
                      d='M436.11 200.83H420V200H240V280H353.03C345.11 302.37 330.72 321.66 312.16 335.71C312.17 335.7 312.18 335.7 312.19 335.69L374.09 388.07C369.71 392.05 440 340 440 240C440 226.59 438.62 213.5 436.11 200.83Z'
                      fill='#1976D2'
                    />
                  </svg>
                </div>

                <span className='flex-1 text-center text-lg font-bold text-white'>Login with google</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  )
}
