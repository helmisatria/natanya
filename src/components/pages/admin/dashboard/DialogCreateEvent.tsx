import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Fragment, useEffect, useState } from 'react'

import { notify } from '@/lib/helper'

type DialogCreateEventProps = {
  open: boolean
  onClose?: () => void
  onSuccess?: () => void
}

export default function DialogCreateEvent({
  open: openProps,
  onClose: onCloseProps,
  onSuccess: onSuccessProps,
}: DialogCreateEventProps) {
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  useEffect(() => {
    setOpen(openProps)
  }, [openProps])

  const onClose = () => {
    setOpen(false)
    onCloseProps?.()
  }

  const mutation = useMutation(
    ({ name, description }: { name: string; description: string }) => {
      const address = `/api/admin/events`
      return axios.post(address, { name, description })
    },
    {
      onError: (err) => {
        const error = err as AxiosError<{ message: string }>
        notify.error(error?.response?.data?.message ?? 'Unknown error')
      },
      onSuccess: () => {
        notify.success('Event successfully created')
        onClose()
        onSuccessProps?.()
        queryClient.invalidateQueries(['events'])
      },
    }
  )

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // react query mutation to /api/admin/event POST request

    const data = new FormData(e.currentTarget)

    mutation.mutate({ name: data.get('event-name') as string, description: data.get('description') as string })
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-in-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-500'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>
        ``
        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'
              >
                <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                  <form
                    onSubmit={onSubmit}
                    className='flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl'
                  >
                    <div className='h-0 flex-1 overflow-y-auto'>
                      <div className='bg-sky-700 py-6 px-4 sm:px-6'>
                        <div className='flex items-center justify-between'>
                          <Dialog.Title className='text-lg font-medium text-white'>New Polling Event</Dialog.Title>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='rounded-md bg-sky-700 text-sky-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white'
                              onClick={() => onClose()}
                            >
                              <span className='sr-only'>Close panel</span>
                              <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                        <div className='mt-1'>
                          <p className='text-sm text-sky-300'>
                            Get started by filling in the information below to create your new polling event.
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-1 flex-col justify-between'>
                        <div className='divide-y divide-gray-200 px-4 sm:px-6'>
                          <div className='space-y-6 pt-6 pb-5'>
                            <div>
                              <label htmlFor='event-name' className='block text-sm font-medium text-gray-900'>
                                Event name
                              </label>
                              <div className='mt-1'>
                                <input
                                  type='text'
                                  name='event-name'
                                  id='event-name'
                                  className='block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm'
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor='description' className='block text-sm font-medium text-gray-900'>
                                Description
                              </label>
                              <div className='mt-1'>
                                <textarea
                                  id='description'
                                  name='description'
                                  rows={4}
                                  className='block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm'
                                  defaultValue=''
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-shrink-0 justify-end px-4 py-4'>
                      <button
                        type='button'
                        className='rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
                        onClick={() => onClose()}
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className='ml-4 inline-flex justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
