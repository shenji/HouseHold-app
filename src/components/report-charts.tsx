"use client"

import type React from "react"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"

interface ReportChartsProps {
  chartType: "bar" | "pie"
  barChartData: { name: string; 時間: number }[]
  pieChartData: { name: string; value: number }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export function ReportCharts({ chartType, barChartData, pieChartData }: ReportChartsProps): React.JSX.Element {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}時間${mins}分`
    }
    return `${mins}分`
  }

  const noBarData = barChartData.every((d) => d.時間 === 0)
  const noPieData = pieChartData.length === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{chartType === "bar" ? "ニックネーム別勉強時間" : "ニックネーム別勉強時間の内訳"}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartType === "bar" ? (
          noBarData ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-500">この期間のデータはありません。</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatTime} />
                <Tooltip formatter={(value: number) => formatTime(value)} />
                <Legend />
                <Bar dataKey="時間" name="勉強時間" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )
        ) : noPieData ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-gray-500">この期間の勉強データはありません。</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatTime(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
