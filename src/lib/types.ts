export type StudySession = {
  id: string
  date: Date
  type: "study"
  subject: string
  nickname: string
  studyMinutes: number
  memo?: string
}
