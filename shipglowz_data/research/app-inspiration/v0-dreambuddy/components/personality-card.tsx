import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PersonalityCardProps {
  name: string
  icon: React.ReactNode
  color: string
  description: string
  sampleMessage: string
}

export function PersonalityCard({ name, icon, color, description, sampleMessage }: PersonalityCardProps) {
  return (
    <Card className="overflow-hidden border border-border/50">
      <div className={cn("px-4 py-2 flex items-center gap-2", color)}>
        <div className="bg-white/20 p-1 rounded-full">{icon}</div>
        <span className="font-medium text-white">{name}</span>
      </div>
      <CardContent className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="bg-secondary/30 p-3 rounded-lg text-sm italic">"{sampleMessage}"</div>
      </CardContent>
    </Card>
  )
}
