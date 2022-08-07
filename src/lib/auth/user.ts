import Cookies from 'cookies'
import jwt from 'jsonwebtoken'
import { pick } from 'lodash'
import { GetServerSidePropsContext, PreviewData } from 'next'
import { NextParsedUrlQuery } from 'next/dist/server/request-meta'

import { UserJWTType } from '@/pages/api/event/[id]/join'

type ServerSidePropsContext = GetServerSidePropsContext<NextParsedUrlQuery, PreviewData>

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
