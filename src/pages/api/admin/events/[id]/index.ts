/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]'
import { adminUpdateEventState } from '@/pages/server/events/event'

export default async function routeUpdateEventState(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, nextAuthOptions)
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  if (req.method !== 'PUT') {
    return res.status(400).json({ message: 'Bad request' })
  }

  const body = req.body

  const result = await adminUpdateEventState(req.query.id as string, body.state as string)
  if (!result) {
    return res.status(500).json({ message: 'Error updating event state' })
  }

  return res.status(200).json({ message: 'Event state updated' })
}
