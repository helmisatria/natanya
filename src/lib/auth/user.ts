import Cookies from 'cookies'
import jwt from 'jsonwebtoken'
import { pick } from 'lodash'
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, PreviewData } from 'next'
import { NextParsedUrlQuery } from 'next/dist/server/request-meta'

import { adminDb } from '@/lib/firebase/firebase-admin'

import { UserJWTType } from '@/pages/api/event/[id]/join'

type ServerSidePropsContext = GetServerSidePropsContext<NextParsedUrlQuery, PreviewData>

const findUserInDb = async (userName: string, eventId: string): Promise<string | boolean> => {
  const snapUserNames = adminDb.ref(`events/${eventId}/userNames`).once('value')
  const userNames = Object.values((await snapUserNames).val() || {})
  const isUserExists = userNames?.includes(userName)

  return isUserExists ? userName : false
}

export const isAuthenticated = async (req: NextApiRequest, res: NextApiResponse): Promise<string | boolean> => {
  const cookies = new Cookies(req, res)
  const authorization = cookies.get('Authorization')
  const eventId = req.query.id as string

  if (!authorization) return false

  const decoded = jwt.verify(authorization, process.env.JWT_SECRET as string) as UserJWTType
  const userName = decoded[eventId]?.name

  if (!userName) return false

  const user = await findUserInDb(userName, eventId)

  return user
}

export const getUser = ({ req, res, query }: ServerSidePropsContext) => {
  const cookies = new Cookies(req, res)
  const eventId = query.id as string

  const authorization = cookies.get('Authorization')

  if (!authorization) {
    return null
  }

  return jwt.verify(authorization, process.env.JWT_SECRET as string, async (err, decoded) => {
    const user = decoded as UserJWTType

    const foundUser = findUserInDb(user?.[eventId]?.name ?? '', eventId)

    if (err || !user || !foundUser) {
      return null
    }

    return pick(user[eventId], ['name'])
  })
}
