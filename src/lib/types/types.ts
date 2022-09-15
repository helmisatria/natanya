export interface IAnswer {
  [userName: string]: string[]
}

export interface IQuestion {
  correctAnswers: string[]
  id: string
  options: string[]
  order: string
  question: string
  answers: IAnswer | '' | undefined
  state: 'PRESTART' | 'STARTED' | 'ENDED'
}

export interface IEvent {
  key?: string
  activeQuestionKey: string
  code: string
  description: string
  id: string
  name: string
  ownerUserId: string
  questions: { [key: string]: IQuestion }
  userNames: string[]
  state: 'PRESTART' | 'STARTED' | 'ENDED'
}

export interface IUser {
  name: string
}
