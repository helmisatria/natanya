import { nanoid } from 'nanoid'
import { Session } from 'next-auth'
import { z } from 'zod'

import { adminDb } from '@/lib/firebase/firebase-admin'
import { IEvent, IQuestion } from '@/lib/types/types'

export const adminGetAllEvents = async ({ user }: { user: Session }) => {
  try {
    const data = await (await adminDb.ref(`events`).once('value')).val()

    const dataToArray = Object.entries(data)
      .map(([key, value]) => {
        return typeof value === 'object' ? { ...value, key } : {}
      })
      .filter((event) => {
        const { collaborators } = event as IEvent
        return collaborators?.includes(user.email as string)
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

export const adminCreateNewEvent = async (event: z.infer<typeof createNewEventSchema>, user: Session) => {
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
    collaborators: [user?.email],
    state: 'PRESTART',
    id: formattedName,
  }

  // validate is event name is unique
  const foundEvent = await (await adminDb.ref(`events/${formattedName}`).once('value')).val()

  if (foundEvent) {
    throw new Error('Event name is already taken')
  }

  return adminDb.ref(`events/${formattedName}`).set(newEvent)
}

export const adminGetEventDetail = async (key: string) => {
  try {
    const data = await (await adminDb.ref(`events/${key}`).once('value')).val()

    return data as IEvent
  } catch (error) {
    return null
  }
}

export const adminUpdateEventState = async (eventId: string, state: string, user: Session) => {
  try {
    // validate is user is collaborator
    const event = await adminGetEventDetail(eventId)

    const isUserCollaborator = event?.collaborators?.includes(user.email as string)
    if (!isUserCollaborator) {
      return false
    }

    await adminDb.ref(`events/${eventId}/state`).set(state)
    return true
  } catch (error) {
    return false
  }
}

export const adminUpdateQuestionState = async (
  eventId: string,
  questionKey: string,
  state: IQuestion['state'],
  user: Session
) => {
  try {
    // validate is user is collaborator
    const event = await adminGetEventDetail(eventId)

    const isUserCollaborator = event?.collaborators?.includes(user.email as string)
    if (!isUserCollaborator) {
      return false
    }

    if (state === 'STARTED') {
      adminDb.ref(`events/${eventId}/activeQuestionKey`).set(questionKey)
    }

    await adminDb.ref(`events/${eventId}/questions/${questionKey}/state`).set(state)
    return true
  } catch (error) {
    return false
  }
}
