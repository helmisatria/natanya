import React from 'react'

interface RadioBlockProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  isAnsweredOption?: boolean
}

export default function RadioBlock({ id, isAnsweredOption, ...props }: RadioBlockProps) {
  return (
    <div data-sal='slide-up' data-sal-delay='300'>
      <input type='radio' className='peer sr-only' name='toggle' {...props} id={id} />
      <label
        htmlFor={id}
        className='group relative inline-flex w-full !cursor-pointer rounded-lg border border-gray-300 bg-white py-2 px-1 shadow-sm ring-offset-4 transition-all duration-200 hover:bg-opacity-100 hover:shadow-md active:ring-2 active:ring-sky-800 peer-checked:border-sky-600 peer-checked:bg-sky-50 peer-checked:bg-opacity-100 peer-checked:shadow-md peer-focus:ring-2 peer-focus:ring-sky-500 peer-active:ring-sky-800 sm:px-2 sm:py-3'
      >
        {isAnsweredOption && (
          <span
            data-sal='slide-up'
            data-sal-delay='0'
            className='absolute top-0 right-0 m-[2px] block rounded-md bg-pink-600 bg-opacity-80 px-2 py-1 text-xs font-semibold text-white shadow-md'
          >
            Your Answer
          </span>
        )}
        <div className='mr-4 p-[10px]'>
          <span className='block h-6 w-6 rounded-full border-2 border-gray-600 border-opacity-30 text-slate-900 focus:ring-sky-600 group-peer-checked:border-4 group-peer-checked:border-sky-600 group-peer-checked:border-opacity-100'></span>
        </div>
        <span className='group-peer-checked:font-semibold] mr-2 flex items-center font-medium leading-[150%] text-slate-900 sm:text-xl'>
          {props.value}
        </span>
      </label>
    </div>
  )
}
