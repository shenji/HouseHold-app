"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Calendar } from "@/src/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { cn } from "@/src/lib/utils"
import type { Transaction } from "@/src/lib/types"

const formSchema = z.object({
  type: z.enum(["expense", "income"]),
  date: z.date(),
  amount: z.number().min(1, "金額は1以上で入力してください。"),
  category: z.string().min(1, "カテゴリを選択してください。"),
  memo: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface TransactionModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  selectedDate: Date | undefined
  onAddTransaction: (data: Omit<Transaction, "id">) => void
}

const expenseCategories = ["食費", "交通費", "娯楽", "住居費", "光熱費", "通信費", "その他"]
const incomeCategories = ["給与", "ボーナス", "副業", "その他"]

export function TransactionModal({ isOpen, onOpenChange, selectedDate, onAddTransaction }: TransactionModalProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      date: selectedDate || new Date(),
      memo: "",
    },
  })

  const transactionType = watch("type")

  React.useEffect(() => {
    if (isOpen) {
      reset({
        type: "expense",
        date: selectedDate || new Date(),
        category: "",
        memo: "",
      })
    }
  }, [isOpen, selectedDate, reset])

  const handleFormSubmit = (data: FormValues) => {
    onAddTransaction(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogTitle className="sr-only">取引入力</DialogTitle>
        <DialogHeader className="p-6 pb-0">
          <h2 className="text-xl">入力</h2>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Tabs
            defaultValue="expense"
            className="w-full"
            onValueChange={(value) => setValue("type", value as "expense" | "income")}
          >
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="expense">支出</TabsTrigger>
                <TabsTrigger value="income">収入</TabsTrigger>
              </TabsList>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">日付</Label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "yyyy/MM/dd") : <span>日付を選択</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={ja}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">カテゴリ</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {(transactionType === "expense" ? expenseCategories : incomeCategories).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">金額</Label>
                <Input id="amount" type="number" {...register("amount", { valueAsNumber: true })} />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="memo">内容</Label>
                <Input id="memo" {...register("memo")} placeholder="（任意）" />
              </div>
            </div>
          </Tabs>
          <div className="px-6 pb-6">
            <Button
              type="submit"
              className={cn(
                "w-full",
                transactionType === "expense" ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600",
              )}
            >
              保存
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
