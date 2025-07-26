import type { LucideIcon } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface SummaryCardProps {
  title: string
  amount: number
  icon: LucideIcon
  color: "blue" | "red" | "green"
}

const colorClasses = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
}

export function SummaryCard({ title, amount, icon: Icon, color }: SummaryCardProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}時間${mins}分`
    }
    return `${mins}分`
  }

  return (
    <div className={cn("text-white p-4 rounded-lg shadow-md flex items-center justify-between", colorClasses[color])}>
      <div className="flex items-center">
        <Icon className="h-6 w-6 mr-3" />
        <span className="font-semibold">{title}</span>
      </div>
      <span className="text-xl font-bold">{formatTime(amount)}</span>
    </div>
  )
}
