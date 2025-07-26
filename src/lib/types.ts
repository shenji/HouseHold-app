export type Transaction = {
  id: string
  date: Date
  type: "income" | "expense"
  category: string
  amount: number
  memo?: string
}
