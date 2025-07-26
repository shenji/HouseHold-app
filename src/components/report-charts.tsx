"use client"

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
  barChartData: { name: string; 金額: number }[]
  pieChartData: { name: string; value: number }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export function ReportCharts({ chartType, barChartData, pieChartData }: ReportChartsProps) {
  const formatCurrency = (value: number) => `¥${value.toLocaleString()}`

  const noBarData = barChartData.every((d) => d.金額 === 0)
  const noPieData = pieChartData.length === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{chartType === "bar" ? "収入と支出" : "支出の内訳"}</CardTitle>
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
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="金額" name="金額">
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === "収入" ? "#3b82f6" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )
        ) : noPieData ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-gray-500">この期間の支出データはありません。</p>
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
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
