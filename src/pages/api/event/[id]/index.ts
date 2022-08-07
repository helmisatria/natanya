import { NextApiRequest, NextApiResponse } from 'next'

import { adminDb } from '@/lib/firebase/firebase-admin'

export default function getRoom(req: NextApiRequest, res: NextApiResponse) {
  const eventId = req.query.id as string

  return adminDb.ref(`events/${eventId}`).once('value', (snapshot) => {
    const events = snapshot.val()

    return res.status(200).json(events)
  })
}
