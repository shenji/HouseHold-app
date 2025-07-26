"use client"

import { format, isSameDay } from "date-fns"
import { useMemo, useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { cn } from "@/src/lib/utils"
import type { Transaction } from "@/src/lib/types"
import { TransactionModal } from "./transaction-modal"
import { getCategoryIcon } from "@/src/lib/icons"

interface DailyDetailsProps {
  selectedDate: Date | undefined
  transactions: Transaction[]
  onAddTransaction: (data: Omit<Transaction, "id">) => void
  onDeleteTransaction: (id: string) => void
}

export function DailyDetails({ selectedDate, transactions, onAddTransaction, onDeleteTransaction }: DailyDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const dailyTransactions = useMemo(() => {
    return transactions.filter((t) => selectedDate && isSameDay(t.date, selectedDate))
  }, [transactions, selectedDate])

  const dailyIncome = dailyTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const dailyExpense = dailyTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const dailyBalance = dailyIncome - dailyExpense

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(value)
  }

  if (!selectedDate) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-gray-500">日付を選択してください</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow h-full flex flex-col">
        <h3 className="font-bold mb-4">日時：{format(selectedDate, "yyyy-MM-dd")}</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Card className="text-center">
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-medium text-gray-500">収入</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <p className="text-lg font-bold text-blue-600">{formatCurrency(dailyIncome)}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-medium text-gray-500">支出</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <p className="text-lg font-bold text-red-600">{formatCurrency(dailyExpense)}</p>
            </CardContent>
          </Card>
        </div>
        <Card className="text-center mb-4">
          <CardHeader className="p-2">
            <CardTitle className="text-sm font-medium text-gray-500">残高</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <p className={cn("text-lg font-bold", dailyBalance >= 0 ? "text-green-600" : "text-red-600")}>
              {formatCurrency(dailyBalance)}
            </p>
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
            内訳を追加
          </Button>
        </div>
        <div className="flex-grow overflow-y-auto space-y-2">
          {dailyTransactions.length > 0 ? (
            dailyTransactions.map((t) => {
              const Icon = getCategoryIcon(t.category)
              return (
                <div
                  key={t.id}
                  className={cn("flex items-center p-2 rounded-md", t.type === "expense" ? "bg-red-50" : "bg-blue-50")}
                >
                  <div className="mr-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-grow">
                    <span className="text-sm font-medium">{t.category}</span>
                    {t.memo && <span className="text-sm text-gray-500 ml-2">{t.memo}</span>}
                  </div>
                  <span
                    className={cn("font-semibold text-sm", t.type === "expense" ? "text-red-600" : "text-blue-600")}
                  >
                    {formatCurrency(t.amount)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-gray-400 hover:text-red-600"
                    onClick={() => onDeleteTransaction(t.id)}
                    aria-label="削除"
                  >
                    ×
                  </Button>
                </div>
              )
            })
          ) : (
            <p className="text-center text-sm text-gray-500 pt-8">この日の取引はありません。</p>
          )}
        </div>
      </div>
      <TransactionModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedDate={selectedDate}
        onAddTransaction={onAddTransaction}
      />
    </>
  )
}
