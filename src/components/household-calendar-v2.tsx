"use client"

import type React from "react"
import { useMemo } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { ja } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import type { StudySession } from "@/src/lib/types"

interface StudyCalendarProps {
  studySessions: StudySession[]
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
}

export function StudyCalendar({
  studySessions,
  currentMonth,
  setCurrentMonth,
  selectedDate,
  setSelectedDate,
}: StudyCalendarProps): React.JSX.Element {
  const firstDayOfMonth = startOfMonth(currentMonth)
  const lastDayOfMonth = endOfMonth(currentMonth)

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth, { locale: ja }),
    end: endOfWeek(lastDayOfMonth, { locale: ja }),
  })

  const dailyData = useMemo(() => {
    const data = new Map<string, { totalStudyTime: number; sessions: StudySession[] }>()
    studySessions.forEach((s) => {
      const day = format(s.date, "yyyy-MM-dd")
      const current = data.get(day) || { totalStudyTime: 0, sessions: [] }
      current.totalStudyTime += s.studyMinutes
      current.sessions.push(s)
      data.set(day, current)
    })
    return data
  }, [studySessions])

  const formatTime = (minutes: number) => {
    if (minutes === 0) return "0分"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{format(currentMonth, "yyyy年 M月", { locale: ja })}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
            今日
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 border-b">
        {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
          <div key={day} className="py-2 font-semibold bg-blue-500 text-white first:rounded-tl-md last:rounded-tr-md">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {daysInMonth.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd")
          const data = dailyData.get(dayKey)
          const hasStudySessions = !!data
          const totalStudyTime = data?.totalStudyTime || 0
          const sessions = data?.sessions || []

          return (
            <div
              key={day.toString()}
              className={cn(
                "h-32 border-r border-b p-2 text-left flex flex-col",
                !isSameMonth(day, currentMonth) && "text-gray-400 bg-gray-50",
                isSameDay(day, new Date()) && "bg-blue-50",
                isSameDay(day, selectedDate || new Date(0)) && "bg-green-100",
                "cursor-pointer hover:bg-gray-200",
              )}
              onClick={() => setSelectedDate(day)}
            >
              <span className="font-medium">{format(day, "d")}</span>
              {hasStudySessions && (
                <div className="text-xs mt-auto space-y-0.5">
                  <p className="text-blue-600 font-bold">{formatTime(totalStudyTime)}</p>
                  {sessions.slice(0, 2).map((session, index) => (
                    <p key={index} className="text-gray-600 truncate">
                      {session.nickname}: {formatTime(session.studyMinutes)}
                    </p>
                  ))}
                  {sessions.length > 2 && (
                    <p className="text-gray-500">+{sessions.length - 2}件</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
