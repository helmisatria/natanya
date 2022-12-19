/* eslint-disable @next/next/no-img-element */
import * as React from 'react'
import { Toaster } from 'react-hot-toast'
import sal from 'sal.js'

import 'sal.js/dist/sal.css'

import Navbar from '@/components/admin/Navbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    sal({
      root: document.querySelector('#root'),
    })
  })

  return (
    <>
      <Toaster />
      <Navbar />

      {children}
    </>
  )
}
