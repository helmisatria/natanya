/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]'
import { adminCreateNewQuestion } from '@/server/questions/question'

export default async function routeCreateQuestion(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, nextAuthOptions)
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  if (req.method !== 'POST') {
    return res.status(400).json({ message: 'Bad request' })
  }

  const body = req.body

  const result = await adminCreateNewQuestion(req.query.id as string, {
    id: nanoid(),
    question: body.questions,
    answers: {},
    state: 'PRESTART',
    correctAnswers: [],
    options: [],
    order: 0,
  })

  if (!result) {
    return res.status(500).json({ message: 'Error creating new question' })
  }

  return res.status(200).json({ message: 'Question created successfully' })
}
