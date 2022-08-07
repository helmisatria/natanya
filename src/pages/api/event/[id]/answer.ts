import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { isAuthenticated } from '@/lib/auth/user'
import { adminDb } from '@/lib/firebase/firebase-admin'
import { IEvent } from '@/lib/types/types'

export default async function answerQuestion(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const userName = await isAuthenticated(req, res)
  if (!userName) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const requestBodySchema = z.array(z.string())
  const answers = req.body.answers as z.infer<typeof requestBodySchema>

  const { success: isValidBody } = requestBodySchema.safeParse(answers)
  if (!isValidBody) {
    return res.status(400).json({ message: 'Invalid body' })
  }

  const eventId = req.query.id as string

  const event = (await adminDb.ref(`events/${eventId}`).once('value')).val() as IEvent | null
  if (!event) {
    return res.status(404).json({ message: 'Event not found' })
  }

  const snapAnswers = adminDb.ref(`events/${eventId}/questions/${event.activeQuestionKey}/answers/${userName}`)
  snapAnswers.set(answers)

  return res.status(200).json({ message: 'OK' })
}
