"use client"

import { useState, useMemo } from "react"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, isSameDay } from "date-fns"
import { ja } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { useTransactions } from "@/src/contexts/transaction-context"
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { ReportCharts } from "@/src/components/report-charts"
import { cn } from "@/src/lib/utils"

type Period = "day" | "week" | "month"
type ChartType = "bar" | "pie"

export default function ReportPage() {
  const { transactions } = useTransactions()
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

    const relevantTransactions = transactions.filter((t) => {
      if (period === "day") {
        return isSameDay(t.date, startDate)
      }
      return isWithinInterval(t.date, { start: startDate, end: endDate })
    })

    const income = relevantTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expense = relevantTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const expenseByCategory = relevantTransactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        },
        {} as Record<string, number>,
      )

    const pieChartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }))
    const barChartData = [
      { name: "収入", 金額: income },
      { name: "支出", 金額: expense },
    ]

    return { barChartData, pieChartData }
  }, [transactions, period, date])

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <TabsList>
            <TabsTrigger value="day">日</TabsTrigger>
            <TabsTrigger value="week">週</TabsTrigger>
            <TabsTrigger value="month">月</TabsTrigger>
          </TabsList>
        </Tabs>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ja }) : <span>日付を選択</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus locale={ja} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <Tabs value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
          <TabsList>
            <TabsTrigger value="bar">収入・支出グラフ</TabsTrigger>
            <TabsTrigger value="pie">支出内訳グラフ</TabsTrigger>
          </TabsList>
        </Tabs>
        <ReportCharts
          chartType={chartType}
          barChartData={filteredData.barChartData}
          pieChartData={filteredData.pieChartData}
        />
      </div>
    </div>
  )
}
