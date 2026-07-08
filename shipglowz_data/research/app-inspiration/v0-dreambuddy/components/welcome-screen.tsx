"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeartIcon, CloudMoonIcon, BrainIcon, SparklesIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PersonalityCard } from "@/components/personality-card"

export function WelcomeScreen() {
  const router = useRouter()
  const [selectedPersonality, setSelectedPersonality] = useState("wholesome")

  const handleStartChat = () => {
    router.push(`/chat?personality=${selectedPersonality}`)
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-primary/20 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(120,0,255,0.1),transparent_70%)] pointer-events-none"></div>

      <CardHeader className="text-center relative z-10">
        <div className="flex justify-center mb-2">
          <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
            <SparklesIcon className="h-3 w-3 mr-1" />
            <span>Late Night Support</span>
          </Badge>
        </div>
        <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
          DreamBuddy AI
        </CardTitle>
        <CardDescription className="text-lg mt-2">Your safe space for those 2 AM thoughts</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        <div className="text-center mb-2">
          <p className="text-muted-foreground">Choose your buddy personality:</p>
        </div>

        <Tabs defaultValue="wholesome" className="w-full" onValueChange={setSelectedPersonality}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="wholesome" className="flex flex-col items-center gap-2 py-3">
              <HeartIcon className="h-5 w-5" />
              <span className="text-xs">Wholesome</span>
            </TabsTrigger>
            <TabsTrigger value="dark" className="flex flex-col items-center gap-2 py-3">
              <CloudMoonIcon className="h-5 w-5" />
              <span className="text-xs">Dark Humor</span>
            </TabsTrigger>
            <TabsTrigger value="therapy" className="flex flex-col items-center gap-2 py-3">
              <BrainIcon className="h-5 w-5" />
              <span className="text-xs">Therapy</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-4">
            <TabsContent value="wholesome">
              <PersonalityCard
                name="Wholesome Bestie"
                icon={<HeartIcon className="h-5 w-5" />}
                color="bg-pink-500"
                description="Your supportive bestie who's always there with a kind word and positive vibes."
                sampleMessage="Hey there! 💖 I'm here for you no matter what. What's on your mind tonight?"
              />
            </TabsContent>

            <TabsContent value="dark">
              <PersonalityCard
                name="Dark Humor Buddy"
                icon={<CloudMoonIcon className="h-5 w-5" />}
                color="bg-purple-700"
                description="For when you need someone who gets your dark side and can make you laugh about it."
                sampleMessage="Sup. 🖤 Can't sleep either, huh? What existential crisis are we diving into tonight?"
              />
            </TabsContent>

            <TabsContent value="therapy">
              <PersonalityCard
                name="Therapy Llama"
                icon={<BrainIcon className="h-5 w-5" />}
                color="bg-teal-600"
                description="Gentle guidance with therapeutic techniques to help you process your feelings."
                sampleMessage="Hello there. 🌿 I'm your Therapy Llama. What's bothering you this evening?"
              />
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex items-center justify-center mt-4">
          <div className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
            <SparklesIcon className="h-3 w-3 inline mr-1" />
            Premium personalities available with subscription
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative z-10">
        <Button
          onClick={handleStartChat}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          Start Chatting
        </Button>
      </CardFooter>
    </Card>
  )
}
