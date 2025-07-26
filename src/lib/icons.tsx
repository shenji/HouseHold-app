import {
  Utensils,
  Train,
  Gamepad2,
  HomeIcon,
  Zap,
  Smartphone,
  Landmark,
  Award,
  Laptop,
  CircleDollarSign,
  type LucideIcon,
} from "lucide-react"

const categoryIcons: Record<string, LucideIcon> = {
  食費: Utensils,
  交通費: Train,
  娯楽: Gamepad2,
  住居費: HomeIcon,
  光熱費: Zap,
  通信費: Smartphone,
  給与: Landmark,
  ボーナス: Award,
  副業: Laptop,
  その他: CircleDollarSign,
}

export const getCategoryIcon = (category: string): LucideIcon => {
  return categoryIcons[category] || CircleDollarSign
}
