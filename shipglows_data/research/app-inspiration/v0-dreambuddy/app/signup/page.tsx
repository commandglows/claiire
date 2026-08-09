"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { HeartIcon, CloudMoonIcon, BrainIcon } from "lucide-react"
import Link from "next/link"
import { DreamBuddyMascot } from "@/components/dream-buddy-mascot"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    personality: "wholesome",
    lowTime: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Support Pledge"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // In a real app, you would send this data to your backend
      console.log("Form submitted:", formData)

      // Redirect to chat with the selected personality
      router.push(`/chat?personality=${formData.personality}`)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background via-background to-accent/5">
      <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-primary/20 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(120,0,255,0.1),transparent_70%)] pointer-events-none"></div>

        <CardHeader className="text-center relative z-10">
          <div className="flex justify-center mb-2">
            <DreamBuddyMascot className="h-24 w-24" />
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
            Let's meet your DreamBuddy 🌙
          </CardTitle>
          <CardDescription className="text-lg mt-2">Your safe space for those 2 AM thoughts</CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Your name"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email / Phone</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality">Personality Preference</Label>
              <Select value={formData.personality} onValueChange={(value) => handleChange("personality", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a personality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wholesome" className="flex items-center">
                    <div className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-2 text-pink-500" />
                      <span>Wholesome Bestie</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark" className="flex items-center">
                    <div className="flex items-center">
                      <CloudMoonIcon className="h-4 w-4 mr-2 text-purple-700" />
                      <span>Dark Humor Buddy</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="therapy" className="flex items-center">
                    <div className="flex items-center">
                      <BrainIcon className="h-4 w-4 mr-2 text-teal-600" />
                      <span>Therapy Llama</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lowTime">Time You Usually Feel Low? (Optional)</Label>
              <Input
                id="lowTime"
                type="time"
                value={formData.lowTime}
                onChange={(e) => handleChange("lowTime", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">We'll check in with you around this time</p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => handleChange("agreeTerms", checked === true)}
                className={errors.agreeTerms ? "border-destructive" : ""}
              />
              <Label htmlFor="agreeTerms" className="text-sm">
                I agree to the{" "}
                <Link href="#" className="text-primary hover:underline">
                  DreamBuddy Support Pledge
                </Link>
              </Label>
            </div>
            {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms}</p>}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Start My Journey 💬
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-sm pt-0 pb-6 relative z-10">
          <p>
            Already have a DreamBuddy?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}
