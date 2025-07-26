"use client"

import { useState, useMemo } from "react"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, isSameDay } from "date-fns"
import { ja } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { useStudySessions } from "@/src/contexts/transaction-context"
import type { StudySession } from "@/src/lib/types"
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { ReportCharts } from "@/src/components/report-charts"
import { cn } from "@/src/lib/utils"

type Period = "day" | "week" | "month"
type ChartType = "bar" | "pie"

export default function ReportPage() {
  const { studySessions } = useStudySessions()
  const [period, setPeriod] = useState<Period>("month")
  const [date, setDate] = useState<Date>(new Date())
  const [chartType, setChartType] = useState<ChartType>("bar")

  const filteredData = useMemo(() => {
    let startDate: Date, endDate: Date

    switch (period) {
      case "day":
        startDate = date
        endDate = date
        break
      case "week":
        startDate = startOfWeek(date, { locale: ja })
        endDate = endOfWeek(date, { locale: ja })
        break
      case "month":
        startDate = startOfMonth(date)
        endDate = endOfMonth(date)
        break
    }

    const relevantStudySessions: StudySession[] = studySessions.filter((s) => {
      if (period === "day") {
        return isSameDay(s.date, startDate)
      }
      return isWithinInterval(s.date, { start: startDate, end: endDate })
    })

    const totalStudyTime = relevantStudySessions.reduce((sum, s) => sum + s.studyMinutes, 0)

    const studyTimeByNickname = relevantStudySessions.reduce(
      (acc, s) => {
        acc[s.nickname] = (acc[s.nickname] || 0) + s.studyMinutes
        return acc
      },
      {} as Record<string, number>,
    )

    const pieChartData = Object.entries(studyTimeByNickname).map(([name, value]) => ({ name, value }))
    const barChartData = Object.entries(studyTimeByNickname).map(([name, value]) => ({ name, 時間: value }))

    return { barChartData, pieChartData }
  }, [studySessions, period, date])

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">勉強時間レポート（ニックネーム別）</h1>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "yyyy年M月d日", { locale: ja })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
        <TabsList>
          <TabsTrigger value="day">日</TabsTrigger>
          <TabsTrigger value="week">週</TabsTrigger>
          <TabsTrigger value="month">月</TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
        <TabsList>
          <TabsTrigger value="bar">棒グラフ</TabsTrigger>
          <TabsTrigger value="pie">円グラフ</TabsTrigger>
        </TabsList>
        <ReportCharts
          chartType={chartType}
          barChartData={filteredData.barChartData}
          pieChartData={filteredData.pieChartData}
        />
      </Tabs>
    </div>
  )
}
