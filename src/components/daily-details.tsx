"use client"

import type React from "react"
import { format, isSameDay } from "date-fns"
import { useMemo, useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { cn } from "@/src/lib/utils"
import type { StudySession } from "@/src/lib/types"
import { StudySessionModal } from "./transaction-modal"
import { getSubjectIcon } from "@/src/lib/icons"

interface DailyDetailsProps {
  selectedDate: Date | undefined
  studySessions: StudySession[]
  onAddStudySession: (data: Omit<StudySession, "id">) => void
  onDeleteStudySession: (id: string) => void
}

export function DailyDetails({ selectedDate, studySessions, onAddStudySession, onDeleteStudySession }: DailyDetailsProps): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const dailyStudySessions = useMemo(() => {
    if (!selectedDate) return []
    return studySessions.filter((s) => isSameDay(s.date, selectedDate))
  }, [studySessions, selectedDate])

  const dailyTotalStudyTime = dailyStudySessions.reduce((sum, s) => sum + s.studyMinutes, 0)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}時間${mins}分`
    }
    return `${mins}分`
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow h-full flex flex-col">
        <h3 className="font-bold mb-4">日時：{selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}</h3>
        <Card className="text-center mb-4">
          <CardHeader className="p-2">
            <CardTitle className="text-sm font-medium text-gray-500">勉強時間合計</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <p className="text-lg font-bold text-blue-600">{formatTime(dailyTotalStudyTime)}</p>
          </CardContent>
        </Card>
        <div className="flex justify-between items-center mb-2 border-t pt-4">
          <h4 className="font-bold">内訳</h4>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            記録を追加
          </Button>
        </div>
        <div className="flex-grow overflow-y-auto space-y-2">
          {dailyStudySessions.length > 0 ? (
            dailyStudySessions.map((s) => {
              const Icon = getSubjectIcon(s.subject)
              return (
                <div key={s.id} className="flex items-center p-2 rounded-md bg-blue-50">
                  <div className="mr-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{s.subject}</span>
                      <span className="text-xs text-gray-500">({s.nickname})</span>
                    </div>
                    {s.memo && <span className="text-sm text-gray-500">{s.memo}</span>}
                  </div>
                  <span className="font-semibold text-sm text-blue-600">
                    {formatTime(s.studyMinutes)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 ml-2"
                    onClick={() => onDeleteStudySession(s.id)}
                  >
                    削除
                  </Button>
                </div>
              )
            })
          ) : (
            <p className="text-gray-500 text-center py-4">この日の記録はありません</p>
          )}
        </div>
      </div>
      <StudySessionModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedDate={selectedDate}
        onAddStudySession={onAddStudySession}
      />
    </>
  )
}
