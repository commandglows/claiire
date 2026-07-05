import { Suspense } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { Skeleton } from "@/components/ui/skeleton"

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Suspense fallback={<ChatLoadingSkeleton />}>
        <ChatInterface />
      </Suspense>
    </main>
  )
}

function ChatLoadingSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b">
        <div className="max-w-md mx-auto flex items-center p-4">
          <Skeleton className="h-10 w-10 rounded-full mr-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-4 max-w-md mx-auto">
          <div className="flex items-start gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-24 w-64 rounded-lg" />
          </div>
          <div className="flex items-start justify-end gap-2">
            <Skeleton className="h-16 w-48 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md mb-4">
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>

      <div className="rounded-t-xl border-t mx-auto w-full max-w-md">
        <div className="p-4">
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}
