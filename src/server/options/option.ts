import { adminDb } from '@/lib/firebase/firebase-admin'

export const adminCreateNewOption = async ({
  eventId,
  questionId,
  options,
}: {
  eventId: string
  options: string[]
  questionId: string
}) => {
  await adminDb.ref(`events/${eventId}/questions/${questionId}/options`).transaction((currentData) => {
    return {
      ...(currentData || {}),
      ...options,
    }
  })

  return true
}
