"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SparklesIcon, XIcon } from "lucide-react"

export function SubscriptionBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Card className="mx-auto w-full max-w-md mb-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-primary/20">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-1.5 rounded-full">
            <SparklesIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Unlock Premium Personalities</p>
            <p className="text-xs text-muted-foreground">$5/month for all premium buddies</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Upgrade
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsVisible(false)}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
