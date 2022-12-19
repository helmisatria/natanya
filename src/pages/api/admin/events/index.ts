/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next'
import { Session, unstable_getServerSession } from 'next-auth'

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]'
import { adminCreateNewEvent, adminGetAllEvents } from '@/server/events/event'

export default async function routeGetEvents(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, nextAuthOptions)
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  if (req.method === 'POST') {
    return adminCreateNewEvent(req.body, session.user as Session)
      .then(() => {
        return res.status(200).json({ message: 'Event successfully created' })
      })
      .catch((error: Error) => {
        return res.status(400).json({ message: error.message })
      })
  }

  if (req.method !== 'GET') {
    return res.status(400).json({ message: 'Bad request' })
  }

  return adminGetAllEvents({ user: session.user as Session }).then((events) => {
    return res.status(200).json(events)
  })
}
