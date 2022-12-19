import Cookies from 'cookies'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res)
  cookies.set('Authorization')

  return {
    props: {},
    redirect: {
      permanent: false,
      destination: '/',
    },
  }
}

export default function Logout() {
  return <div></div>
}
