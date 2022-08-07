import Cookies from 'cookies'
import invariant from 'invariant'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

import { isAuthenticated } from '@/lib/auth/user'
import { adminDb } from '@/lib/firebase/firebase-admin'

export interface UserJWTType {
  [eventId: string]: {
    name: string
  } | null
}

export default async function joinEvent(req: NextApiRequest, res: NextApiResponse) {
  invariant(process.env.JWT_SECRET, 'JWT_SECRET is not defined')

  const isLoggedIn = await isAuthenticated(req, res)
  if (isLoggedIn) {
    return res.status(400).json({ message: 'Already logged in' })
  }

  const cookies = new Cookies(req, res)
  const eventId = req.query.id as string
  const userName = req.body.name as string

  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Method Not Allowed',
    })
  }

  if (!req.body.name) {
    return res.status(400).json({
      message: 'Name is required',
    })
  }

  const snapUserNames = adminDb.ref(`events/${eventId}/userNames`).once('value')
  const userNames = Object.values((await snapUserNames).val() || {})
  const isUserAvailable = !userNames?.includes(userName)

  if (!isUserAvailable) {
    return res.status(400).json({
      message: 'Name is already taken',
    })
  }

  adminDb.ref(`events/${eventId}/userNames`).push(userName)

  const user = {
    [eventId]: {
      name: req.body.name,
    },
  }

  const token = jwt.sign(user, process.env.JWT_SECRET)
  cookies.set('Authorization', token)

  return res.status(200).send({ ok: true })
}
