export interface IAnswer {
  answeredBy: string
  answers: string[]
}

export interface IQuestion {
  correctAnswers: string[]
  id: string
  options: string[]
  order: string
  question: string
  answers: IAnswer[]
}

export interface IEvent {
  activeQuestionId: string
  code: string
  description: string
  id: string
  name: string
  ownerUserId: string
  questions: IQuestion[]
}
