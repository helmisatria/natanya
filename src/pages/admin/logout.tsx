import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import { useEffect } from 'react'

export default function LogoutAdmin() {
  const router = useRouter()

  useEffect(() => {
    signOut({ redirect: false }).then(() => {
      router.replace('/login')
    })
  }, [router])

  return <div></div>
}
