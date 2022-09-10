export async function getStaticProps() {
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }
}

export default function Page() {
  return <div>Redirecting...</div>
}
