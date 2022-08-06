import { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/lib/firebase/config'

export default function getRoom(req: NextApiRequest, res: NextApiResponse) {
  const eventId = req.query.id as string

  return db.ref(`events/${eventId}`).once('value', (snapshot) => {
    const events = snapshot.val()

    return res.status(200).json(events)
  })
}
