import Cookies from 'cookies'
import invariant from 'invariant'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

export interface UserJWTType {
  [eventId: string]: {
    name: string
  } | null
}

export default function joinEvent(req: NextApiRequest, res: NextApiResponse) {
  invariant(process.env.JWT_SECRET, 'JWT_SECRET is not defined')

  const eventId = req.query.id as string

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
    })
  }

  if (!req.body.name) {
    return res.status(400).json({
      error: 'Name is required',
    })
  }

  const cookies = new Cookies(req, res)

  const user = {
    [eventId]: {
      name: req.body.name,
    },
  }

  const token = jwt.sign(user, process.env.JWT_SECRET)
  cookies.set('Authorization', token)

  return res.status(200).send({ ok: true })
}
