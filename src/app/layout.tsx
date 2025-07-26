import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/src/lib/utils"
import { PageWrapper } from "@/src/components/page-wrapper"
import { TransactionProvider } from "@/src/contexts/transaction-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "家計簿",
  description: "A household finance app built with Next.js and TypeScript.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={cn("bg-white text-black", inter.className)}>
        <TransactionProvider>
          <PageWrapper>{children}</PageWrapper>
        </TransactionProvider>
      </body>
    </html>
  )
}
