"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  HeartIcon,
  CloudMoonIcon,
  BrainIcon,
  SparklesIcon,
  LogOutIcon,
  CoffeeIcon,
  MoonIcon,
  UserIcon,
  ArrowLeftIcon,
  PencilIcon,
} from "lucide-react"
import { DreamBuddyMascot, type BuddyCustomization, defaultCustomization } from "@/components/dream-buddy-mascot"

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState({
    name: "Sarah",
    buddyName: "Sunny",
    personality: "wholesome",
    email: "sarah@example.com",
    comfortTime: "23:00",
    voiceNotes: true,
    copingStyle: "humor",
    subscription: "free",
  })
  const [buddyCustomization, setBuddyCustomization] = useState<BuddyCustomization>({ ...defaultCustomization })

  // Load saved customization from localStorage on mount
  useEffect(() => {
    try {
      const savedCustomization = localStorage.getItem("dreambuddy-customization")
      if (savedCustomization) {
        setBuddyCustomization(JSON.parse(savedCustomization))
      }
    } catch (error) {
      console.error("Error loading customization:", error)
    }
  }, [])

  const handleChange = (field: string, value: string | boolean) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    router.push("/")
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary/20">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b">
        <div className="max-w-md mx-auto flex items-center p-4">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/chat")}>
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>
      </div>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        <div className="space-y-6">
          <Card className="border-2 border-primary/20 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt={userData.name} />
                  <AvatarFallback className="bg-primary/20">{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">Hey {userData.name} 👋</CardTitle>
                  <CardDescription className="text-base">Your DreamBuddy is always here</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DreamBuddyMascot className="h-6 w-6" customization={buddyCustomization} size="sm" />
                Your Buddy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="buddyName">Buddy Name</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="buddyName"
                    value={userData.buddyName}
                    onChange={(e) => handleChange("buddyName", e.target.value)}
                    className="w-32 h-8"
                  />
                  <span className="text-lg">🦙</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Buddy Appearance</Label>
                  <p className="text-xs text-muted-foreground">Customize your buddy's look</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => router.push("/customize-buddy")}>
                  <PencilIcon className="h-3 w-3" />
                  Customize
                </Button>
              </div>

              <div className="flex justify-center py-2">
                <DreamBuddyMascot customization={buddyCustomization} size="md" />
              </div>

              <div className="space-y-2">
                <Label>Buddy Personality</Label>
                <Tabs defaultValue={userData.personality} onValueChange={(value) => handleChange("personality", value)}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="wholesome" className="flex flex-col items-center gap-1 py-2">
                      <HeartIcon className="h-4 w-4 text-pink-500" />
                      <span className="text-xs">Wholesome</span>
                    </TabsTrigger>
                    <TabsTrigger value="dark" className="flex flex-col items-center gap-1 py-2">
                      <CloudMoonIcon className="h-4 w-4 text-purple-700" />
                      <span className="text-xs">Dark Humor</span>
                    </TabsTrigger>
                    <TabsTrigger value="therapy" className="flex flex-col items-center gap-1 py-2">
                      <BrainIcon className="h-4 w-4 text-teal-600" />
                      <span className="text-xs">Therapy</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex items-center justify-center mt-2">
                  <div className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full flex items-center gap-1">
                    <SparklesIcon className="h-3 w-3" />
                    <span>Premium personalities available with subscription</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MoonIcon className="h-5 w-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="comfortTime">Late-night comfort time</Label>
                  <p className="text-xs text-muted-foreground">When we should check in on you</p>
                </div>
                <Input
                  id="comfortTime"
                  type="time"
                  value={userData.comfortTime}
                  onChange={(e) => handleChange("comfortTime", e.target.value)}
                  className="w-32 h-8"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="voiceNotes">Voice notes</Label>
                  <p className="text-xs text-muted-foreground">Enable voice messages</p>
                </div>
                <Switch
                  id="voiceNotes"
                  checked={userData.voiceNotes}
                  onCheckedChange={(checked) => handleChange("voiceNotes", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="copingStyle">Coping style</Label>
                <Select value={userData.copingStyle} onValueChange={(value) => handleChange("copingStyle", value)}>
                  <SelectTrigger id="copingStyle">
                    <SelectValue placeholder="Select coping style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="affirmations">Affirmations</SelectItem>
                    <SelectItem value="humor">Humor</SelectItem>
                    <SelectItem value="cbt">CBT-style prompts</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">How your buddy will help you cope</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email / Phone</Label>
                <Input id="email" value={userData.email} onChange={(e) => handleChange("email", e.target.value)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Subscription</Label>
                  <p className="text-xs text-muted-foreground">Current plan</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={userData.subscription === "premium" ? "default" : "outline"}>
                    {userData.subscription === "premium" ? "Premium" : "Free"}
                  </Badge>
                  {userData.subscription !== "premium" && (
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <SparklesIcon className="h-3 w-3" />
                      Upgrade
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Tip history</Label>
                  <p className="text-xs text-muted-foreground">Support your buddy</p>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <CoffeeIcon className="h-3 w-3" />
                  Buy a Coffee
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" className="text-destructive gap-2" onClick={handleLogout}>
                <LogOutIcon className="h-4 w-4" />
                Log out
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
