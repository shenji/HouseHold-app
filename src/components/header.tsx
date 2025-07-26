"use client"
import { Button } from "@/src/components/ui/button"
import { Menu } from "lucide-react"
import { DrawerTrigger } from "@/src/components/ui/drawer"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-blue-600 text-white shadow-md shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile/Tablet Drawer Trigger (for screens < 1280px) */}
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="xl:hidden text-white hover:text-white hover:bg-blue-700">
            <Menu className="h-6 w-6" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </DrawerTrigger>

        {/* Desktop Collapse Toggle (for screens >= 1280px) */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden xl:flex text-white hover:text-white hover:bg-blue-700"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">サイドバーを切り替え</span>
        </Button>

        <h1 className="text-xl font-semibold">みんなの勉強時間レポート</h1>
      </div>
    </header>
  )
}
