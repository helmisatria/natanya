import React from 'react'

interface RadioBlockProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
}

export default function RadioBlock({ id, ...props }: RadioBlockProps) {
  return (
    <div>
      <input type='radio' className='peer sr-only' name='toggle' {...props} id={id} />
      <label
        htmlFor={id}
        className='group flex w-full cursor-pointer items-center rounded-lg border-4 border-cyan-800 border-opacity-30 bg-cyan-50 bg-opacity-60 py-4 px-4 shadow-sm ring-offset-4 transition-all duration-200 hover:bg-opacity-100 hover:shadow-md active:ring-2 active:ring-cyan-700 peer-checked:border-cyan-800 peer-checked:bg-cyan-100 peer-checked:bg-opacity-100 peer-checked:shadow-md peer-focus:ring-2 peer-focus:ring-cyan-500 peer-active:ring-cyan-700 xl:py-5 xl:px-7 2xl:py-6 2xl:px-8'
      >
        <span className='mr-4 block h-8 w-8 rounded-full border-4 border-cyan-800 border-opacity-30 text-cyan-800 focus:ring-cyan-600 group-peer-checked:border-opacity-100 lg:mr-7 lg:h-10 lg:w-10'>
          <span className='block h-full w-full rounded-full border-4 border-cyan-50 transition-all duration-150 ease-in group-peer-checked:bg-cyan-800'></span>
        </span>
        <span className='block text-xl font-medium text-slate-900 group-peer-checked:font-semibold md:text-[1.5rem] 2xl:text-3xl'>
          {props.value}
        </span>
      </label>
    </div>
  )
}
