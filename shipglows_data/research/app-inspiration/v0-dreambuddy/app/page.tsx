import { WelcomeScreen } from "@/components/welcome-screen"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background via-background to-accent/5">
      <WelcomeScreen />
    </main>
  )
}
