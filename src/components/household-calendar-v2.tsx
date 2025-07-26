"use client"

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
import type { Transaction } from "@/src/lib/types"

interface HouseholdCalendarProps {
  transactions: Transaction[]
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
}

export function HouseholdCalendar({
  transactions,
  currentMonth,
  setCurrentMonth,
  selectedDate,
  setSelectedDate,
}: HouseholdCalendarProps) {
  const firstDayOfMonth = startOfMonth(currentMonth)
  const lastDayOfMonth = endOfMonth(currentMonth)

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth, { locale: ja }),
    end: endOfWeek(lastDayOfMonth, { locale: ja }),
  })

  const dailyData = useMemo(() => {
    const data = new Map<string, { income: number; expense: number }>()
    transactions.forEach((t) => {
      const day = format(t.date, "yyyy-MM-dd")
      const current = data.get(day) || { income: 0, expense: 0 }
      if (t.type === "income") {
        current.income += t.amount
      } else {
        current.expense += t.amount
      }
      data.set(day, current)
    })
    return data
  }, [transactions])

  const formatCurrency = (value: number) => {
    if (value === 0) return "0"
    return new Intl.NumberFormat("ja-JP").format(value)
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
          const hasTransactions = !!data
          const income = data?.income || 0
          const expense = data?.expense || 0
          const balance = income - expense

          return (
            <div
              key={day.toString()}
              className={cn(
                "h-28 border-r border-b p-2 text-left flex flex-col",
                !isSameMonth(day, currentMonth) && "text-gray-400 bg-gray-50",
                isSameDay(day, new Date()) && "bg-blue-50",
                isSameDay(day, selectedDate || new Date(0)) && "bg-green-100",
                "cursor-pointer hover:bg-gray-200",
              )}
              onClick={() => setSelectedDate(day)}
            >
              <span className="font-medium">{format(day, "d")}</span>
              {hasTransactions && (
                <div className="text-xs mt-auto space-y-0.5 text-right">
                  <p className="text-blue-600">{formatCurrency(income)}</p>
                  <p className="text-red-600">{formatCurrency(expense)}</p>
                  <p className={cn("font-bold", balance >= 0 ? "text-green-600" : "text-red-600")}>
                    {formatCurrency(balance)}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
