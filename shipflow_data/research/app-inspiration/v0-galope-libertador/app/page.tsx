"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface GameObject {
  x: number
  y: number
  width: number
  height: number
  type: "obstacle" | "collectible"
  variant?: number
  collectibleType?: string
}

interface HighScore {
  score: number
  date: string
}

interface FloatingScore {
  id: number
  x: number
  y: number
  opacity: number
  offsetY: number
}

const getGameConfig = () => ({
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 600,
  GROUND_HEIGHT: 100,
  PLAYER_WIDTH: 80,
  PLAYER_HEIGHT: 80,
  GRAVITY: 0.8,
  JUMP_FORCE: -15,
  GAME_SPEED: 5,
  OBSTACLE_SPAWN_RATE: 0.012,
  COLLECTIBLE_SPAWN_RATE: 0.008,
})

export default function GalopeLibertador() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const audioRef = useRef<HTMLAudioElement>(null)
  const backgroundImageRef = useRef<HTMLImageElement>(null)
  const playerImagesRef = useRef<HTMLImageElement[]>([])
  const obstacleImagesRef = useRef<HTMLImageElement[]>([])
  const gameConfigRef = useRef(getGameConfig())
  const [isClient, setIsClient] = useState(false)

  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu")
  const [score, setScore] = useState(0)
  const [highScores, setHighScores] = useState<HighScore[]>([])
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([])
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 600 })
  const [isPortrait, setIsPortrait] = useState(false)

  // Player state
  const [player, setPlayer] = useState({
    x: 100,
    y: 0,
    velocityY: 0,
    isJumping: false,
    canDoubleJump: true,
    spriteIndex: 0,
    animationCounter: 0,
  })

  // Game objects
  const [gameObjects, setGameObjects] = useState<GameObject[]>([])
  const [backgroundX, setBackgroundX] = useState(0)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 768
      const isPortraitMode = window.innerHeight > window.innerWidth
      setIsPortrait(isMobile && isPortraitMode)
    }

    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [isClient])

  useEffect(() => {
    if (!isClient) return

    const updateCanvasSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setCanvasSize({ width, height })
      gameConfigRef.current.CANVAS_WIDTH = width
      gameConfigRef.current.CANVAS_HEIGHT = height

      // Reset player position
      setPlayer((prev) => ({
        ...prev,
        y: height - gameConfigRef.current.GROUND_HEIGHT - gameConfigRef.current.PLAYER_HEIGHT,
      }))
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Preload images
    backgroundImageRef.current = new Image()
    backgroundImageRef.current.src = "/images/background.jpeg"

    // Preload player sprites
    for (let i = 1; i <= 5; i++) {
      const img = new Image()
      img.src = `/images/guemes${i}.png`
      playerImagesRef.current[i - 1] = img
    }

    // Preload obstacle images
    for (let i = 1; i <= 3; i++) {
      const img = new Image()
      img.src = `/images/cactus${i}.png`
      obstacleImagesRef.current[i - 1] = img
    }

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [isClient])

  useEffect(() => {
    if (!isClient || !audioRef.current) return

    audioRef.current.volume = 0.3
    audioRef.current.loop = true
  }, [isClient])

  const toggleMusic = useCallback(async () => {
    if (!isClient || !audioRef.current) return

    try {
      if (isMusicPlaying) {
        audioRef.current.pause()
        setIsMusicPlaying(false)
      } else {
        await audioRef.current.play()
        setIsMusicPlaying(true)
      }
    } catch (error) {
      console.log("Audio play failed:", error)
    }
  }, [isMusicPlaying, isClient])

  useEffect(() => {
    if (!isClient) return

    const startMusic = async () => {
      try {
        if (audioRef.current && !isMusicPlaying) {
          await audioRef.current.play()
          setIsMusicPlaying(true)
        }
      } catch (error) {
        // Auto-play blocked, user will need to click music button
        console.log("Auto-play blocked")
      }
    }

    const timer = setTimeout(startMusic, 1000)
    return () => clearTimeout(timer)
  }, [isClient])

  // Load high scores from localStorage
  useEffect(() => {
    if (!isClient) return

    try {
      const saved = localStorage.getItem("galope-libertador-scores")
      if (saved) {
        setHighScores(JSON.parse(saved))
      }
    } catch (error) {
      console.log("Error loading high scores:", error)
    }
  }, [isClient])

  // Save high score
  const saveHighScore = useCallback(
    (newScore: number) => {
      if (!isClient) return

      const newHighScore: HighScore = {
        score: newScore,
        date: new Date().toLocaleDateString(),
      }

      const updatedScores = [...highScores, newHighScore].sort((a, b) => b.score - a.score).slice(0, 5)

      setHighScores(updatedScores)
      try {
        localStorage.setItem("galope-libertador-scores", JSON.stringify(updatedScores))
      } catch (error) {
        console.log("Error saving high scores:", error)
      }
    },
    [highScores, isClient],
  )

  const addFloatingScore = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.random()
    setFloatingScores((prev) => [...prev, { id, x, y, opacity: 1, offsetY: 0 }])

    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((score) => score.id !== id))
    }, 2000)
  }, [])

  // Update floating scores animation
  useEffect(() => {
    if (!isClient || floatingScores.length === 0) return

    const interval = setInterval(() => {
      setFloatingScores((prev) =>
        prev
          .map((score) => ({
            ...score,
            opacity: score.opacity - 0.02,
            offsetY: score.offsetY - 2,
          }))
          .filter((score) => score.opacity > 0),
      )
    }, 16)

    return () => clearInterval(interval)
  }, [floatingScores.length, isClient])

  // Handle keyboard input
  useEffect(() => {
    if (!isClient || gameState !== "playing") return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        setPlayer((prev) => {
          if (!prev.isJumping) {
            return {
              ...prev,
              velocityY: gameConfigRef.current.JUMP_FORCE,
              isJumping: true,
              canDoubleJump: true,
            }
          } else if (prev.canDoubleJump) {
            return {
              ...prev,
              velocityY: gameConfigRef.current.JUMP_FORCE,
              canDoubleJump: false,
            }
          }
          return prev
        })
      }

      if (e.code === "ArrowDown") {
        e.preventDefault()
        setPlayer((prev) => ({
          ...prev,
          velocityY: prev.isJumping ? 20 : prev.velocityY,
        }))
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameState, isClient])

  // Touch controls for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      if (gameState !== "playing") return

      setPlayer((prev) => {
        if (!prev.isJumping) {
          return {
            ...prev,
            velocityY: gameConfigRef.current.JUMP_FORCE,
            isJumping: true,
            canDoubleJump: true,
          }
        } else if (prev.canDoubleJump) {
          return {
            ...prev,
            velocityY: gameConfigRef.current.JUMP_FORCE,
            canDoubleJump: false,
          }
        }
        return prev
      })
    },
    [gameState],
  )

  // Collision detection
  const checkCollision = useCallback((obj1: any, obj2: any) => {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    )
  }, [])

  // Game loop
  useEffect(() => {
    if (!isClient || gameState !== "playing") return

    const gameLoop = () => {
      // Update player physics
      setPlayer((prev) => {
        const groundY = canvasSize.height - gameConfigRef.current.GROUND_HEIGHT - gameConfigRef.current.PLAYER_HEIGHT
        let newY = prev.y + prev.velocityY
        let newVelocityY = prev.velocityY + gameConfigRef.current.GRAVITY
        let newIsJumping = prev.isJumping
        let newCanDoubleJump = prev.canDoubleJump

        if (newY >= groundY) {
          newY = groundY
          newVelocityY = 0
          newIsJumping = false
          newCanDoubleJump = true
        }

        // Update sprite animation
        const newAnimationCounter = prev.animationCounter + 1
        const newSpriteIndex = Math.floor(newAnimationCounter / 8) % 5

        return {
          ...prev,
          y: newY,
          velocityY: newVelocityY,
          isJumping: newIsJumping,
          canDoubleJump: newCanDoubleJump,
          spriteIndex: newSpriteIndex,
          animationCounter: newAnimationCounter,
        }
      })

      setBackgroundX((prev) => {
        const newX = prev - 2
        // Reset when background has scrolled one full width
        return newX <= -canvasSize.width ? 0 : newX
      })

      // Spawn objects
      setGameObjects((prev) => {
        const newObjects = [...prev]

        // Spawn obstacles
        if (Math.random() < gameConfigRef.current.OBSTACLE_SPAWN_RATE) {
          const variant = Math.floor(Math.random() * 3) + 1
          newObjects.push({
            x: canvasSize.width,
            y: canvasSize.height - gameConfigRef.current.GROUND_HEIGHT - 60,
            width: 40,
            height: 60,
            type: "obstacle",
            variant,
          })
        }

        // Spawn collectibles
        if (Math.random() < gameConfigRef.current.COLLECTIBLE_SPAWN_RATE) {
          const minHeight = canvasSize.height - gameConfigRef.current.GROUND_HEIGHT - 50
          const maxHeight = canvasSize.height - gameConfigRef.current.GROUND_HEIGHT - 200
          const randomY = Math.random() * (minHeight - maxHeight) + maxHeight
          const collectibleType = Math.random() > 0.5 ? "🧉" : "🥟"

          newObjects.push({
            x: canvasSize.width,
            y: randomY,
            width: 30,
            height: 30,
            type: "collectible",
            collectibleType,
          })
        }

        // Move objects and remove off-screen ones
        return newObjects
          .map((obj) => ({ ...obj, x: obj.x - gameConfigRef.current.GAME_SPEED }))
          .filter((obj) => obj.x > -100)
      })

      // Check collisions
      setGameObjects((prev) => {
        const playerRect = {
          x: player.x,
          y: player.y,
          width: gameConfigRef.current.PLAYER_WIDTH,
          height: gameConfigRef.current.PLAYER_HEIGHT,
        }

        const remainingObjects: GameObject[] = []
        let scoreIncrease = 0

        for (const obj of prev) {
          if (checkCollision(playerRect, obj)) {
            if (obj.type === "obstacle") {
              setGameState("gameOver")
              saveHighScore(score)
              return prev
            } else if (obj.type === "collectible") {
              scoreIncrease += 100
              addFloatingScore(obj.x, obj.y)
            }
          } else {
            remainingObjects.push(obj)
          }
        }

        if (scoreIncrease > 0) {
          setScore((prevScore) => prevScore + scoreIncrease)
        }

        return remainingObjects
      })

      // Increase score over time
      setScore((prev) => prev + 1)

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState, player.x, player.y, score, checkCollision, saveHighScore, canvasSize, addFloatingScore, isClient])

  useEffect(() => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    if (backgroundImageRef.current && backgroundImageRef.current.complete) {
      const bgWidth = canvasSize.width
      const bgHeight = canvasSize.height

      // Draw two background images for seamless infinite scroll
      ctx.drawImage(backgroundImageRef.current, backgroundX, 0, bgWidth, bgHeight)
      ctx.drawImage(backgroundImageRef.current, backgroundX + bgWidth, 0, bgWidth, bgHeight)
    }

    if (gameState === "playing") {
      // Draw player
      const playerImg = playerImagesRef.current[player.spriteIndex]
      if (playerImg && playerImg.complete) {
        ctx.drawImage(
          playerImg,
          player.x,
          player.y,
          gameConfigRef.current.PLAYER_WIDTH,
          gameConfigRef.current.PLAYER_HEIGHT,
        )
      }

      // Draw game objects
      gameObjects.forEach((obj) => {
        if (obj.type === "obstacle" && obj.variant) {
          const obstacleImg = obstacleImagesRef.current[obj.variant - 1]
          if (obstacleImg && obstacleImg.complete) {
            ctx.drawImage(obstacleImg, obj.x, obj.y, obj.width, obj.height)
          }
        } else if (obj.type === "collectible") {
          ctx.font = "32px Arial"
          ctx.textAlign = "center"
          ctx.fillStyle = "#FFD700"
          ctx.strokeStyle = "#8B4513"
          ctx.lineWidth = 2
          const item = obj.collectibleType || "🧉"
          ctx.strokeText(item, obj.x + obj.width / 2, obj.y + obj.height)
          ctx.fillText(item, obj.x + obj.width / 2, obj.y + obj.height)
        }
      })

      floatingScores.forEach((floatingScore) => {
        ctx.font = "bold 24px Arial"
        ctx.textAlign = "center"
        ctx.fillStyle = `rgba(255, 215, 0, ${floatingScore.opacity})`
        ctx.strokeStyle = `rgba(139, 69, 19, ${floatingScore.opacity})`
        ctx.lineWidth = 2
        ctx.strokeText("+100", floatingScore.x, floatingScore.y + floatingScore.offsetY)
        ctx.fillText("+100", floatingScore.x, floatingScore.y + floatingScore.offsetY)
      })
    }
  }, [gameState, player, gameObjects, backgroundX, canvasSize, floatingScores, isClient])

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setPlayer({
      x: 100,
      y: canvasSize.height - gameConfigRef.current.GROUND_HEIGHT - gameConfigRef.current.PLAYER_HEIGHT,
      velocityY: 0,
      isJumping: false,
      canDoubleJump: true,
      spriteIndex: 0,
      animationCounter: 0,
    })
    setGameObjects([])
    setBackgroundX(0)
    setFloatingScores([])
  }

  const backToMenu = () => {
    setGameState("menu")
  }

  const MusicIcon = ({ isPlaying }: { isPlaying: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
      {isPlaying ? (
        <>
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </>
      ) : (
        <>
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        </>
      )}
    </svg>
  )

  if (!isClient) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-yellow-400 to-orange-600">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🐎</div>
          <p className="text-white text-xl font-bold">Cargando Galope Libertador...</p>
        </div>
      </div>
    )
  }

  if (isPortrait) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{
          backgroundImage: "url(/images/background.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-8 text-center space-y-6 max-w-sm mx-4">
          <div className="text-6xl">📱</div>
          <h2 className="text-2xl font-bold text-white">Rotar Celular</h2>
          <p className="text-white text-lg">Por favor, rota tu dispositivo a modo horizontal para jugar</p>
          <div className="text-4xl animate-bounce">🔄</div>
        </div>

        <Button
          onClick={toggleMusic}
          className="fixed top-4 right-4 z-50 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg border border-gray-300"
          size="sm"
        >
          <MusicIcon isPlaying={isMusicPlaying} />
        </Button>

        <audio ref={audioRef} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/soundtrackpaseo-vWb1mVceGLjwjeEpXarGvG2guOAA1X.mp3" />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: "url(/images/background.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg border border-gray-300"
        size="sm"
      >
        <MusicIcon isPlaying={isMusicPlaying} />
      </Button>

      <audio ref={audioRef} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/soundtrackpaseo-vWb1mVceGLjwjeEpXarGvG2guOAA1X.mp3" />

      {gameState === "menu" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-5xl">
            <div className="text-center mb-6">
              <img src="/images/logo.png" alt="Galope Libertador" className="mx-auto w-64 h-auto" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left column - Instructions and Play button */}
              <div className="text-white space-y-4 bg-black/60 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center md:text-left">¿Cómo Jugar?</h2>
                <div className="space-y-2 text-base">
                  <p>
                    🖱️ <strong>Escritorio:</strong> ESPACIO para saltar, ↓ para descenso rápido
                  </p>
                  <p>
                    📱 <strong>Móvil:</strong> Toca la pantalla para saltar
                  </p>
                  <p>🌟 Doble salto disponible</p>
                  <p>🧉🥟 Colecta items para +100 puntos</p>
                  <p>🌵 Evita los cactus</p>
                </div>

                <div className="text-center md:text-left pt-4">
                  <Button
                    onClick={startGame}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-xl font-bold"
                  >
                    🐎 ¡JUGAR!
                  </Button>
                </div>
              </div>

              {/* Right column - High scores */}
              <div>
                <Card className="bg-amber-100/90 backdrop-blur-sm p-5 h-full">
                  <h3 className="text-xl font-bold mb-3 text-amber-900 text-center">🏆 Mejores Puntajes</h3>
                  {highScores.length > 0 ? (
                    <div className="space-y-2">
                      {highScores.map((score, index) => (
                        <div key={index} className="flex justify-between items-center text-amber-800 text-base">
                          <span className="font-bold">#{index + 1}</span>
                          <span className="font-mono">{score.score.toLocaleString()}</span>
                          <span className="text-sm">{score.date}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-amber-700 text-center">¡Sé el primero en jugar!</p>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === "playing" && (
        <div className="w-full h-screen relative">
          <div className="absolute top-4 left-4 right-20 z-10 flex justify-between items-center text-white text-xl font-bold">
            <span className="bg-black/70 px-4 py-2 rounded-lg">Puntaje: {score.toLocaleString()}</span>
            <span className="hidden md:block bg-black/70 px-4 py-2 rounded-lg text-sm">
              ESPACIO: Saltar | ↓: Descenso
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="w-full h-full"
            onTouchStart={handleTouchStart}
            style={{ touchAction: "none" }}
          />

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white md:hidden">
            <p className="bg-black/70 px-4 py-2 rounded-lg">Toca la pantalla para saltar</p>
          </div>
        </div>
      )}

      {gameState === "gameOver" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-8 text-center space-y-6 max-w-md w-full">
            <div className="text-white space-y-4">
              <h2 className="text-4xl font-bold text-red-400">💥 GAME OVER</h2>
              <p className="text-2xl">
                Puntaje Final: <span className="text-yellow-400 font-bold">{score.toLocaleString()}</span>
              </p>

              {highScores.length > 0 && score >= highScores[highScores.length - 1]?.score && (
                <p className="text-green-400 text-xl">🎉 ¡Nuevo récord personal!</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={startGame} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                🔄 Jugar de Nuevo
              </Button>
              <Button
                onClick={backToMenu}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                🏠 Menú Principal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
