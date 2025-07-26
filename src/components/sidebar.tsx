"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart2 } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/report", icon: BarChart2, label: "Report" },
  ]

  return (
    <div className={cn("flex flex-col w-full h-full bg-gray-800 text-white", className)}>
      <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-700 shrink-0">
        {/* Can be a logo */}
      </div>
      <nav className="flex-grow px-4 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700",
                  pathname.startsWith(item.href) ? "bg-gray-900" : "",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
