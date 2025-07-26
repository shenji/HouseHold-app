import {
  Calculator,
  BookOpen,
  FileText,
  FlaskConical,
  Globe,
  Code,
  CircleDollarSign,
  type LucideIcon,
} from "lucide-react"

const subjectIcons: Record<string, LucideIcon> = {
  数学: Calculator,
  英語: BookOpen,
  国語: FileText,
  理科: FlaskConical,
  社会: Globe,
  プログラミング: Code,
  その他: CircleDollarSign,
}

export function getSubjectIcon(subject: string): LucideIcon {
  return subjectIcons[subject] || CircleDollarSign
}
