import create from 'zustand'

import { IEvent, IQuestion } from '@/lib/types/types'

interface EventState {
  event: IEvent | null
  setEvent: (event: IEvent) => void
  setSelectedQuestionKey: (questionKey: string) => void
  getQuestionAnsweredPercentage: (question: IQuestion) => number
  selectedQuestionKey: string | null
  computed: {
    activeQuestion: IQuestion | null
    selectedQuestion: IQuestion | null
    participants: string[]
    activeQuestionAnswers: string[][]
    activeQuestionAnsweredPercentage: string
  }
}

export const useEventStore = create<EventState>()((set, get) => ({
  event: null,
  selectedQuestionKey: null,
  setEvent: (event) => {
    set({ event })
  },
  setSelectedQuestionKey: (questionKey) => {
    set({ selectedQuestionKey: questionKey })
  },
  getQuestionAnsweredPercentage: (question) => {
    const totalAnswer = Object.values(question.answers || {}).length
    return totalAnswer
  },
  computed: {
    get activeQuestion() {
      return get().event?.questions?.[get().event?.activeQuestionKey ?? '0'] ?? null
    },
    get selectedQuestion() {
      return (
        get().event?.questions?.[get().selectedQuestionKey ?? ''] ||
        Object.values(get().event?.questions ?? {})?.[0] ||
        null
      )
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
