import type React from "react"
import type { MetadataRoute } from "next/server"
import ClientRootLayout from "./client-root-layout"

export const metadata: MetadataRoute = {
  title: "Cogniflorence",
  description: "A comprehensive platform for self-administered Cognitive Behavioral Therapy",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientRootLayout>{children}</ClientRootLayout>
}



import './globals.css'