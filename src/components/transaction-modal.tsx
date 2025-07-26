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
import { cn } from "@/src/lib/utils"
import type { StudySession } from "@/src/lib/types"

const formSchema = z.object({
  type: z.literal("study"),
  date: z.date(),
  subject: z.string().min(1, "科目を選択してください。"),
  nickname: z.string().min(1, "ニックネームを入力してください。"),
  studyMinutes: z.number().min(1, "勉強時間は1分以上で入力してください。"),
  memo: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface StudySessionModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  selectedDate: Date | undefined
  onAddStudySession: (data: Omit<StudySession, "id">) => void
}

const subjects = ["数学", "英語", "国語", "理科", "社会", "プログラミング", "その他"]

export function StudySessionModal({ isOpen, onOpenChange, selectedDate, onAddStudySession }: StudySessionModalProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "study",
      date: selectedDate || new Date(),
      memo: "",
    },
  })

  React.useEffect(() => {
    if (isOpen) {
      reset({
        type: "study",
        date: selectedDate || new Date(),
        subject: "",
        nickname: "",
        memo: "",
      })
    }
  }, [isOpen, selectedDate, reset])

  const handleFormSubmit = (data: FormValues) => {
    onAddStudySession(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogTitle className="sr-only">勉強時間記録</DialogTitle>
        <DialogHeader className="p-6 pb-0">
          <h2 className="text-xl">勉強時間記録</h2>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="px-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">日付</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP", { locale: ja }) : <span>日付を選択</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">科目</Label>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="科目を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">ニックネーム</Label>
              <Input id="nickname" {...register("nickname")} placeholder="例：太郎、花子" />
              {errors.nickname && <p className="text-sm text-red-500">{errors.nickname.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studyMinutes">勉強時間（分）</Label>
              <Input id="studyMinutes" type="number" {...register("studyMinutes", { valueAsNumber: true })} />
              {errors.studyMinutes && <p className="text-sm text-red-500">{errors.studyMinutes.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo">内容</Label>
              <Input id="memo" {...register("memo")} placeholder="（任意）" />
            </div>
          </div>
          <div className="px-6 pb-6">
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              保存
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
