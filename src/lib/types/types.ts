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
  activeQuestionKey: string
  code: string
  description: string
  id: string
  name: string
  ownerUserId: string
  questions: { [key: string]: IQuestion }
}

export interface IUser {
  name: string
}
