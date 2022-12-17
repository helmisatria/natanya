import { adminDb } from '@/lib/firebase/firebase-admin'
import { IQuestion } from '@/lib/types/types'

export const adminCreateNewQuestion = async (eventId: string, question: IQuestion) => {
  const newQuestionKey = adminDb.ref(`events/${eventId}/questions`).push().key
  if (!newQuestionKey) {
    throw new Error('Error creating new question')
  }

  await adminDb.ref(`events/${eventId}/questions/${newQuestionKey}`).set(question)
  return newQuestionKey
}
