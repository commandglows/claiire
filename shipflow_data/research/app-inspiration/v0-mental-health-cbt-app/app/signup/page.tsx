'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const validateEmail = (email: string) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(email)
}

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [signupError, setSignupError] = useState('')
  const { toast } = useToast()
  const router = useRouter()

  const validatePassword = useCallback((password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number"
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*)"
    }
    return ""
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setPasswordError('')
    setSignupError('')

    if (!validateEmail(email)) {
      setSignupError('Please enter a valid email address.')
      setIsLoading(false)
      return
    }

    const passwordValidationError = validatePassword(password)
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Sign Up Successful",
        description: "Your account has been created. Please check your email for verification.",
        duration: 7000,
      })
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      console.error('Error signing up:', error)
      setSignupError("An unexpected error occurred. Please try again.")
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Join Cogniflorence</CardTitle>
            <CardDescription className="text-center">Start your journey to better mental health</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {signupError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{signupError}</AlertDescription>
                </Alert>
              )}
              {signupError && signupError.includes('email') && (
                <p className="text-sm text-destructive mt-1">{signupError}</p>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                    aria-required="true"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    aria-required="true"
                    aria-invalid={signupError && signupError.includes('email') ? 'true' : 'false'}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setPasswordError('')
                    }}
                    className="pl-10"
                    required
                    aria-required="true"
                    aria-invalid={passwordError ? 'true' : 'false'}
                    aria-describedby="password-requirements"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
                </div>
                {passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                <p id="password-requirements" className="text-sm text-muted-foreground">
                  Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing Up...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </div>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

