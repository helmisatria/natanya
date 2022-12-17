import { nanoid } from 'nanoid'

import { adminDb } from '@/lib/firebase/firebase-admin'

export const adminCreateNewQuestion = async (eventId: string, questions: string) => {
  const questionsMap = questions
    .split('\n')
    .filter((v) => v)
    .reduce((prev, question) => {
      const newQuestionKey = adminDb.ref(`events/${eventId}/questions`).push().key as string

      return {
        ...prev,
        [newQuestionKey]: {
          id: nanoid(),
          question: question,
          answers: {},
          state: 'PRESTART',
          correctAnswers: [],
          options: [],
          order: 0,
        },
      }
    }, {})

  if (!questionsMap) {
    throw new Error('Error creating new question')
  }

  await adminDb.ref(`events/${eventId}/questions`).transaction((currentData) => {
    return {
      ...(currentData || {}),
      ...questionsMap,
    }
  })

  return true
}
