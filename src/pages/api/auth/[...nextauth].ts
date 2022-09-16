/* eslint-disable unused-imports/no-unused-vars */
import invariant from 'invariant'
import { GetServerSidePropsContext } from 'next'
import NextAuth, { NextAuthOptions, unstable_getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

invariant(process.env.GOOGLE_ID, 'GOOGLE_ID is required')
invariant(process.env.GOOGLE_SECRET, 'GOOGLE_SECRET is required')

export const redirectAdminGuard = async (context: GetServerSidePropsContext) => {
  const session = await unstable_getServerSession(context.req, context.res, nextAuthOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
}

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.includes(`/login`) || url.includes(`/admin`)) return `${baseUrl}/admin`
      return baseUrl
    },
    async signIn({ user, account, profile, email, credentials }) {
      const whitelistUsers = [
        'satriahelmi@gmail.com',
        'helmi.satria@wartek.belajar.id',
        'rivki@wartek.belajar.id',
        'rahmanda@wartek.belajar.id',
      ]

      const isAllowedToSignIn = whitelistUsers.includes(user.email || '')

      if (isAllowedToSignIn) {
        return true
      } else {
        return false
      }
    },
  },
}

export default NextAuth(nextAuthOptions)
