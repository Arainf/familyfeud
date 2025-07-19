import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ViewTransitions } from "next-view-transitions"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Family Feud Game Show",
  description: "Interactive Family Feud game with tournament support",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ViewTransitions>
  )
}
