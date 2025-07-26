"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/src/components/sidebar"
import { Header } from "@/src/components/header"
import { Drawer, DrawerContent } from "@/src/components/ui/drawer"
import { cn } from "@/src/lib/utils"

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <Drawer direction="left">
      <div className="flex min-h-screen w-full">
        {/* Desktop Collapsible Sidebar (for screens >= 1280px) */}
        <div
          className={cn(
            "hidden xl:block bg-gray-800 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-0" : "w-64",
          )}
        >
          <Sidebar className={cn(isCollapsed && "hidden")} />
        </div>

        {/* Mobile/Tablet Drawer Content (for screens < 1280px) */}
        <DrawerContent className="w-64 h-full p-0 border-none xl:hidden">
          <Sidebar />
        </DrawerContent>

        <div className="flex flex-col w-full flex-1">
          <Header onMenuClick={toggleSidebar} />
          <main className="flex-grow p-4 md:p-6 lg:p-8 bg-gray-100 overflow-y-auto">{children}</main>
        </div>
      </div>
    </Drawer>
  )
}
