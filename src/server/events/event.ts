import { nanoid } from 'nanoid'
import { z } from 'zod'

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

// zod schema for create new event
export const createNewEventSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})

export const adminCreateNewEvent = async (event: z.infer<typeof createNewEventSchema>) => {
  const { success: isValidBody } = createNewEventSchema.safeParse(event)

  if (!isValidBody) {
    throw new Error('Invalid body')
  }

  const { name, description } = event

  const formattedName = name.toLowerCase().replace(/\s/g, '-')

  const newEvent = {
    name,
    description,
    activeQuestionKey: '0',
    code: nanoid(6),
    userNames: {},
    questions: [],
    ownerUserId: 'coming-soon',
    state: 'PRESTART',
    id: formattedName,
  }

  // validate is event name is unique
  const foundEvent = await (await adminDb.ref(`events/${formattedName}`).once('value')).val()

  if (foundEvent) {
    throw new Error('Event name is already taken')
  }

  return adminDb.ref(`events/${name}`).set(newEvent)
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
