"use client"
import { useState } from "react"
import { Clock, BookOpen } from "lucide-react"

import { SummaryCard } from "@/src/components/summary-card"
import { StudyCalendar } from "@/src/components/household-calendar-v2"
import { DailyDetails } from "@/src/components/daily-details"
import { useStudySessions } from "@/src/contexts/transaction-context"
import type { StudySession } from "@/src/lib/types"

export default function StudyHomePage() {
  const { studySessions, addStudySession, deleteStudySession, loading } = useStudySessions()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const handleAddStudySession = async (data: Omit<StudySession, "id">) => {
    try {
      await addStudySession(data)
    } catch (error) {
      console.error("Failed to add study session:", error)
      // ここでユーザーにエラーを通知する処理を追加できます
      alert("勉強時間の記録に失敗しました。")
    }
  }

  const handleDeleteStudySession = async (id: string) => {
    try {
      await deleteStudySession(id)
    } catch (error) {
      console.error("Failed to delete study session:", error)
      alert("勉強時間の削除に失敗しました。")
    }
  }

  const monthlyTotalStudyTime = studySessions
    .filter(
      (s) =>
        s.date.getFullYear() === currentMonth.getFullYear() &&
        s.date.getMonth() === currentMonth.getMonth(),
    )
    .reduce((sum, s) => sum + s.studyMinutes, 0)

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <SummaryCard title="今月の勉強時間" amount={monthlyTotalStudyTime} icon={Clock} color="blue" />
          <SummaryCard title="平均勉強時間/日" amount={Math.round(monthlyTotalStudyTime / new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate())} icon={BookOpen} color="green" />
        </div>
        <StudyCalendar
          studySessions={studySessions}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className="w-full md:max-w-sm flex-shrink-0">
        <DailyDetails selectedDate={selectedDate} studySessions={studySessions} onAddStudySession={handleAddStudySession} onDeleteStudySession={handleDeleteStudySession} />
      </div>
    </div>
  )
}
