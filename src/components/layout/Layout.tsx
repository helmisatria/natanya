import * as React from 'react'
import { Toaster } from 'react-hot-toast'
import sal from 'sal.js'

import 'sal.js/dist/sal.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    sal({
      root: document.querySelector('#root'),
      once: false,
    })
  })

  return (
    <>
      <Toaster />
      {children}
    </>
  )
}
