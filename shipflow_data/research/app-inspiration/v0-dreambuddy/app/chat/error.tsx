"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-destructive/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-destructive">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">We're sorry, but we encountered an error while loading your chat.</p>
          <p className="text-sm text-muted-foreground">Error details: {error.message || "Unknown error"}</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
          <Button onClick={() => reset()}>Try Again</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
