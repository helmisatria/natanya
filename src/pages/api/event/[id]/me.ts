import Cookies from 'cookies'
import jwt from 'jsonwebtoken'
import { pick } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'

import { UserJWTType } from '@/pages/api/event/[id]/join'

export default function getMe(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res)
  const eventId = req.query.id as string

  const authorization = cookies.get('Authorization')

  if (!authorization) {
    return res.status(401).send(null)
  }

  return jwt.verify(authorization, process.env.JWT_SECRET as string, (err, decoded) => {
    const user = decoded as UserJWTType

    if (err || !user) {
      return res.status(401).send(null)
    }

    return res.status(200).send(pick(user[eventId], ['name']))
  })
}
