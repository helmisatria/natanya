import create from 'zustand'

import { IEvent, IQuestion } from '@/lib/types/types'

interface EventState {
  event: IEvent | null
  setEvent: (event: IEvent) => void
  getQuestionAnsweredPercentage: (question: IQuestion) => number
  computed: {
    activeQuestion: IQuestion | null
    participants: string[]
    activeQuestionAnswers: string[][]
    activeQuestionAnsweredPercentage: string
  }
}

export const useEventStore = create<EventState>()((set, get) => ({
  event: null,
  setEvent: (event) => {
    set({ event })
  },
  getQuestionAnsweredPercentage: (question) => {
    const totalAnswer = Object.values(question.answers || {}).length
    return totalAnswer
  },
  computed: {
    get activeQuestion() {
      return get().event?.questions[get().event?.activeQuestionKey ?? '0'] ?? null
    },
    get participants() {
      return Object.values(get().event?.userNames ?? {})
    },
    get activeQuestionAnswers() {
      return Object.values(get().computed.activeQuestion?.answers ?? {})
    },
    get activeQuestionAnsweredPercentage() {
      return ((get().computed.activeQuestionAnswers.length / get().computed.participants.length) * 100).toFixed(2)
    },
  },
}))
