"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DreamBuddyMascot, type BuddyCustomization, defaultCustomization } from "@/components/dream-buddy-mascot"
import { ArrowLeftIcon, CheckIcon, RefreshCwIcon, SparklesIcon } from "lucide-react"

export default function CustomizeBuddyPage() {
  const router = useRouter()
  const [customization, setCustomization] = useState<BuddyCustomization>({ ...defaultCustomization })
  const [activeTab, setActiveTab] = useState("colors")
  const [isPremium, setIsPremium] = useState(false)

  // Load saved customization from localStorage on mount
  useEffect(() => {
    try {
      const savedCustomization = localStorage.getItem("dreambuddy-customization")
      if (savedCustomization) {
        setCustomization(JSON.parse(savedCustomization))
      }
    } catch (error) {
      console.error("Error loading customization:", error)
    }
  }, [])

  const handleSave = () => {
    try {
      localStorage.setItem("dreambuddy-customization", JSON.stringify(customization))
      router.push("/profile")
    } catch (error) {
      console.error("Error saving customization:", error)
    }
  }

  const handleReset = () => {
    setCustomization({ ...defaultCustomization })
  }

  const updateCustomization = (key: keyof BuddyCustomization, value: string) => {
    setCustomization((prev) => ({ ...prev, [key]: value }))
  }

  // Color options
  const colorOptions = {
    face: [
      { value: "bg-white dark:bg-purple-800/30", label: "Default", premium: false },
      { value: "bg-blue-50 dark:bg-blue-900/30", label: "Blue", premium: false },
      { value: "bg-pink-50 dark:bg-pink-900/30", label: "Pink", premium: false },
      { value: "bg-yellow-50 dark:bg-yellow-900/30", label: "Yellow", premium: false },
      { value: "bg-green-50 dark:bg-green-900/30", label: "Green", premium: true },
      { value: "bg-orange-50 dark:bg-orange-900/30", label: "Orange", premium: true },
    ],
    ear: [
      { value: "bg-purple-200 dark:bg-purple-800/50", label: "Default", premium: false },
      { value: "bg-blue-200 dark:bg-blue-800/50", label: "Blue", premium: false },
      { value: "bg-pink-200 dark:bg-pink-800/50", label: "Pink", premium: false },
      { value: "bg-yellow-200 dark:bg-yellow-800/50", label: "Yellow", premium: true },
      { value: "bg-green-200 dark:bg-green-800/50", label: "Green", premium: true },
    ],
    accent: [
      { value: "bg-purple-100 dark:bg-purple-900/30", label: "Default", premium: false },
      { value: "bg-blue-100 dark:bg-blue-900/30", label: "Blue", premium: false },
      { value: "bg-pink-100 dark:bg-pink-900/30", label: "Pink", premium: false },
      { value: "bg-yellow-100 dark:bg-yellow-900/30", label: "Yellow", premium: true },
      { value: "bg-green-100 dark:bg-green-900/30", label: "Green", premium: true },
    ],
    nose: [
      { value: "bg-pink-300 dark:bg-pink-600", label: "Default", premium: false },
      { value: "bg-red-300 dark:bg-red-600", label: "Red", premium: false },
      { value: "bg-orange-300 dark:bg-orange-600", label: "Orange", premium: false },
      { value: "bg-black dark:bg-gray-300", label: "Black", premium: true },
    ],
    mug: [
      { value: "from-pink-400 to-purple-500 dark:from-pink-600 dark:to-purple-700", label: "Default", premium: false },
      { value: "from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700", label: "Blue", premium: false },
      { value: "from-green-400 to-green-600 dark:from-green-500 dark:to-green-700", label: "Green", premium: false },
      { value: "from-red-400 to-red-600 dark:from-red-500 dark:to-red-700", label: "Red", premium: true },
      {
        value: "from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600",
        label: "Sunset",
        premium: true,
      },
    ],
  }

  // Accessory options
  const accessoryOptions = [
    { value: "none", label: "None", premium: false },
    { value: "hat", label: "Hat", premium: false },
    { value: "bowtie", label: "Bow Tie", premium: false },
    { value: "glasses", label: "Glasses", premium: true },
    { value: "scarf", label: "Scarf", premium: true },
  ]

  // Mug style options
  const mugStyleOptions = [
    { value: "coffee", label: "Coffee", premium: false },
    { value: "tea", label: "Tea", premium: false },
    { value: "cocoa", label: "Hot Cocoa", premium: true },
    { value: "none", label: "No Mug", premium: true },
  ]

  // Render color options
  const renderColorOptions = (
    colorKey: "face" | "ear" | "accent" | "nose" | "mug",
    label: string,
    description: string,
  ) => {
    return (
      <div className="space-y-3">
        <div>
          <Label>{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <RadioGroup
          value={customization[colorKey]}
          onValueChange={(value) => updateCustomization(colorKey, value)}
          className="flex flex-wrap gap-2"
        >
          {colorOptions[colorKey].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`${colorKey}-${option.label}`}
                disabled={option.premium && !isPremium}
                className="peer sr-only"
              />
              <Label
                htmlFor={`${colorKey}-${option.label}`}
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-border cursor-pointer hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
              >
                <div className={`w-4 h-4 rounded-full ${option.value.split(" ")[0]}`}></div>
                <span>{option.label}</span>
                {option.premium && <SparklesIcon className="h-3 w-3 text-amber-400" />}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary/20">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b">
        <div className="max-w-md mx-auto flex items-center p-4">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/profile")}>
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Customize Your Buddy</h1>
        </div>
      </div>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        <div className="space-y-6">
          <Card className="border-2 border-primary/20 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-2xl">Your DreamBuddy</CardTitle>
              <CardDescription>Customize your buddy's appearance</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <DreamBuddyMascot customization={customization} size="lg" />
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
              <TabsTrigger value="mug">Mug</TabsTrigger>
            </TabsList>

            <Card className="mt-4 border">
              <CardContent className="pt-6">
                <TabsContent value="colors" className="space-y-6">
                  {renderColorOptions("face", "Face Color", "The main color of your buddy's face")}
                  {renderColorOptions("ear", "Ear Color", "The color of your buddy's ears")}
                  {renderColorOptions("accent", "Background", "The background color behind your buddy")}
                  {renderColorOptions("nose", "Nose Color", "The color of your buddy's nose")}
                </TabsContent>

                <TabsContent value="accessories" className="space-y-6">
                  <div className="space-y-3">
                    <div>
                      <Label>Accessory</Label>
                      <p className="text-xs text-muted-foreground">Add a fun accessory to your buddy</p>
                    </div>
                    <RadioGroup
                      value={customization.accessory}
                      onValueChange={(value: any) => updateCustomization("accessory", value)}
                      className="flex flex-wrap gap-2"
                    >
                      {accessoryOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option.value}
                            id={`accessory-${option.value}`}
                            disabled={option.premium && !isPremium}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`accessory-${option.value}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-md border border-border cursor-pointer hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
                          >
                            <span>{option.label}</span>
                            {option.premium && <SparklesIcon className="h-3 w-3 text-amber-400" />}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </TabsContent>

                <TabsContent value="mug" className="space-y-6">
                  {renderColorOptions("mug", "Mug Color", "The color of your buddy's mug")}

                  <div className="space-y-3">
                    <div>
                      <Label>Mug Style</Label>
                      <p className="text-xs text-muted-foreground">Choose what's in your buddy's mug</p>
                    </div>
                    <RadioGroup
                      value={customization.mugStyle}
                      onValueChange={(value: any) => updateCustomization("mugStyle", value)}
                      className="flex flex-wrap gap-2"
                    >
                      {mugStyleOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option.value}
                            id={`mugStyle-${option.value}`}
                            disabled={option.premium && !isPremium}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`mugStyle-${option.value}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-md border border-border cursor-pointer hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
                          >
                            <span>{option.label}</span>
                            {option.premium && <SparklesIcon className="h-3 w-3 text-amber-400" />}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>

          {!isPremium && (
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-primary/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium flex items-center gap-1">
                    <SparklesIcon className="h-4 w-4 text-amber-400" />
                    <span>Premium Options</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">Unlock all customization options</p>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleReset}>
              <RefreshCwIcon className="h-4 w-4" />
              Reset
            </Button>
            <Button className="flex-1 gap-2" onClick={handleSave}>
              <CheckIcon className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
