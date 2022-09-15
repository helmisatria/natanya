import { adminDb } from '@/lib/firebase/firebase-admin'
import { IEvent, IQuestion } from '@/lib/types/types'

export const adminGetAllEvents = async () => {
  try {
    const data = await (await adminDb.ref(`events`).once('value')).val()

    const dataToArray = Object.entries(data).map(([key, value]) => {
      return typeof value === 'object' ? { ...value, key } : {}
    })

    return dataToArray as IEvent[]
  } catch (error) {
    return null
  }
}

export const adminGetEventDetail = async (key: string) => {
  try {
    const data = await (await adminDb.ref(`events/${key}`).once('value')).val()

    return data as IEvent
  } catch (error) {
    return null
  }
}

export const adminUpdateEventState = async (eventId: string, state: string) => {
  try {
    await adminDb.ref(`events/${eventId}/state`).set(state)
    return true
  } catch (error) {
    return false
  }
}

export const adminUpdateQuestionState = async (eventId: string, questionKey: string, state: IQuestion['state']) => {
  try {
    if (state === 'STARTED') {
      adminDb.ref(`events/${eventId}/activeQuestionKey`).set(questionKey)
    }

    await adminDb.ref(`events/${eventId}/questions/${questionKey}/state`).set(state)
    return true
  } catch (error) {
    return false
  }
}
