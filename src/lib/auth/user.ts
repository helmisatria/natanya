import Cookies from 'cookies'
import jwt from 'jsonwebtoken'
import { pick } from 'lodash'
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, PreviewData } from 'next'
import { NextParsedUrlQuery } from 'next/dist/server/request-meta'

import { adminDb } from '@/lib/firebase/firebase-admin'

import { UserJWTType } from '@/pages/api/event/[id]/join'

type ServerSidePropsContext = GetServerSidePropsContext<NextParsedUrlQuery, PreviewData>

export const isAuthenticated = async (req: NextApiRequest, res: NextApiResponse): Promise<boolean> => {
  const cookies = new Cookies(req, res)
  const authorization = cookies.get('Authorization')
  const eventId = req.query.id as string

  if (!authorization) return false

  const decoded = jwt.verify(authorization, process.env.JWT_SECRET as string) as UserJWTType
  const userName = decoded[eventId]?.name

  if (!userName) return false

  const snapUserNames = adminDb.ref(`events/${eventId}/userNames`).once('value')
  const userNames = Object.values((await snapUserNames).val() || {})
  const isUserExists = userNames?.includes(userName)

  return isUserExists
}

export const getUser = ({ req, res, query }: ServerSidePropsContext) => {
  const cookies = new Cookies(req, res)
  const eventId = query.id as string

  const authorization = cookies.get('Authorization')

  if (!authorization) {
    return null
  }

  return jwt.verify(authorization, process.env.JWT_SECRET as string, (err, decoded) => {
    const user = decoded as UserJWTType

    if (err || !user) {
      return null
    }

    return pick(user[eventId], ['name'])
  })
}
