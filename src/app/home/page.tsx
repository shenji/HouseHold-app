"use client"
import { useState } from "react"
import { ArrowUp, ArrowDown, Banknote } from "lucide-react"

import { SummaryCard } from "@/src/components/summary-card"
import { HouseholdCalendar } from "@/src/components/household-calendar-v2"
import { DailyDetails } from "@/src/components/daily-details"
import { useTransactions } from "@/src/contexts/transaction-context"

export default function KakeiboHomePage() {
  const { transactions, addTransaction, deleteTransaction, loading } = useTransactions()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const handleAddTransaction = async (data: Omit<import("@/src/lib/types").Transaction, "id">) => {
    try {
      await addTransaction(data)
    } catch (error) {
      console.error("Failed to add transaction:", error)
      // ここでユーザーにエラーを通知する処理を追加できます
      alert("取引の追加に失敗しました。")
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id)
    } catch (error) {
      console.error("Failed to delete transaction:", error)
      alert("取引の削除に失敗しました。")
    }
  }

  const monthlyIncome = transactions
    .filter(
      (t) =>
        t.type === "income" &&
        t.date.getFullYear() === currentMonth.getFullYear() &&
        t.date.getMonth() === currentMonth.getMonth(),
    )
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyExpense = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        t.date.getFullYear() === currentMonth.getFullYear() &&
        t.date.getMonth() === currentMonth.getMonth(),
    )
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyBalance = monthlyIncome - monthlyExpense

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>データを読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      <div className="flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard title="収入" amount={monthlyIncome} icon={ArrowUp} color="blue" />
          <SummaryCard title="支出" amount={monthlyExpense} icon={ArrowDown} color="red" />
          <SummaryCard title="残高" amount={monthlyBalance} icon={Banknote} color="green" />
        </div>
        <HouseholdCalendar
          transactions={transactions}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className="w-full md:max-w-sm flex-shrink-0">
        <DailyDetails selectedDate={selectedDate} transactions={transactions} onAddTransaction={handleAddTransaction} onDeleteTransaction={handleDeleteTransaction} />
      </div>
    </div>
  )
}
