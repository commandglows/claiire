"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface Player {
  x: number
  y: number
  width: number
  height: number
}

interface Blocker {
  x: number
  y: number
  width: number
  height: number
  dx: number
  dy: number
  speed: number
}

interface Defender {
  x: number
  y: number
  width: number
  height: number
  dx: number
  dy: number
  speed: number
  stunned: boolean
  stunnedTime: number
  lastPlayerX: number
  lastPlayerY: number
  isZoneDefender: boolean
  zoneX: number
  zoneY: number
  zoneRadius: number
}

export default function GameBoyFootball() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()
  const [gameState, setGameState] = useState<
    "home" | "gameExplainer" | "menu" | "modeSelect" | "playing" | "gameOver" | "win" | "finalStats"
  >("home")
  const [hardMode, setHardMode] = useState<boolean>(true)
  const [startTime, setStartTime] = useState<number>(0)
  const [completionTime, setCompletionTime] = useState<number>(0)

  const [lives, setLives] = useState<number>(3)
  const [scores, setScores] = useState<number>(0)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [gameStats, setGameStats] = useState<{ scores: number; bestTime: number | null }>({ scores: 0, bestTime: null })

  // Game objects
  const playerRef = useRef<Player>({ x: 160, y: 260, width: 8, height: 8 }) // Changed player starting position from y: 200 to y: 260 to start at bottom of screen
  const defendersRef = useRef<Defender[]>([])
  const blockersRef = useRef<Blocker[]>([]) // Added blockers array for offensive players

  // Controls
  const keysRef = useRef<Set<string>>(new Set())
  const movingRef = useRef<string | null>(null)

  const CANVAS_WIDTH = 320
  const CANVAS_HEIGHT = 320
  const FIELD_HEIGHT = 280
  const END_ZONE_HEIGHT = 20

  // Initialize defenders
  const initializeDefenders = useCallback(() => {
    const defenders: Defender[] = []

    // Defensive Line (3 players) - at line of scrimmage - always chase
    for (let i = 0; i < 3; i++) {
      const spacing = CANVAS_WIDTH / 4
      defenders.push({
        x: spacing * (i + 1) - 4,
        y: 180, // Line of scrimmage
        width: 8,
        height: 8,
        dx: 0,
        dy: 0,
        speed: i % 2 === 0 ? 1.6 : 1.3, // Alternate fast/slow
        stunned: false,
        stunnedTime: 0,
        lastPlayerX: 160,
        lastPlayerY: 260,
        isZoneDefender: false,
        zoneX: 0,
        zoneY: 0,
        zoneRadius: 0,
      })
    }

    // Linebackers (4 players) - second level - 2 chase, 2 zone
    for (let i = 0; i < 4; i++) {
      const spacing = CANVAS_WIDTH / 5
      const x = spacing * (i + 1) - 4
      const y = 140
      defenders.push({
        x,
        y, // Behind defensive line
        width: 8,
        height: 8,
        dx: 0,
        dy: 0,
        speed: (i + 3) % 2 === 0 ? 1.6 : 1.3, // Alternate fast/slow
        stunned: false,
        stunnedTime: 0,
        lastPlayerX: 160,
        lastPlayerY: 260,
        isZoneDefender: i === 1 || i === 2,
        zoneX: x,
        zoneY: y,
        zoneRadius: 60,
      })
    }

    // Cornerbacks (2 players) - on the sides - always chase
    defenders.push({
      x: 40,
      y: 100,
      width: 8,
      height: 8,
      dx: 0,
      dy: 0,
      speed: 1.6, // Fast
      stunned: false,
      stunnedTime: 0,
      lastPlayerX: 160,
      lastPlayerY: 260,
      isZoneDefender: false,
      zoneX: 0,
      zoneY: 0,
      zoneRadius: 0,
    })
    defenders.push({
      x: CANVAS_WIDTH - 48,
      y: 100,
      width: 8,
      height: 8,
      dx: 0,
      dy: 0,
      speed: 1.6, // Fast
      stunned: false,
      stunnedTime: 0,
      lastPlayerX: 160,
      lastPlayerY: 260,
      isZoneDefender: false,
      zoneX: 0,
      zoneY: 0,
      zoneRadius: 0,
    })

    // Safeties (2 players) - deep coverage - stay in zone
    defenders.push({
      x: CANVAS_WIDTH / 3 - 4,
      y: 60,
      width: 8,
      height: 8,
      dx: 0,
      dy: 0,
      speed: 1.3, // Slower
      stunned: false,
      stunnedTime: 0,
      lastPlayerX: 160,
      lastPlayerY: 260,
      isZoneDefender: true,
      zoneX: CANVAS_WIDTH / 3 - 4,
      zoneY: 60,
      zoneRadius: 80,
    })
    defenders.push({
      x: (CANVAS_WIDTH * 2) / 3 - 4,
      y: 60,
      width: 8,
      height: 8,
      dx: 0,
      dy: 0,
      speed: 1.3, // Slower
      stunned: false,
      stunnedTime: 0,
      lastPlayerX: 160,
      lastPlayerY: 260,
      isZoneDefender: true,
      zoneX: (CANVAS_WIDTH * 2) / 3 - 4,
      zoneY: 60,
      zoneRadius: 80,
    })

    defendersRef.current = defenders

    const blockers: Blocker[] = []

    // Offensive Line (5 players) - center and guards/tackles
    for (let i = 0; i < 5; i++) {
      const spacing = CANVAS_WIDTH / 10 // Changed from /8 to /10 for tighter formation
      const centerOffset = CANVAS_WIDTH / 2 - spacing * 2 // Center the line
      blockers.push({
        x: centerOffset + spacing * i - 4,
        y: 220, // In front of running back
        width: 8,
        height: 8,
        dx: (Math.random() - 0.5) * 0.5, // Halved blocker movement speed
        dy: (Math.random() - 0.5) * 0.5, // Halved blocker movement speed
        speed: 0.75, // Halved blocker speed from 1.5 to 0.75
      })
    }

    // Wide Receivers (3 players) - spread out wide
    blockers.push({
      x: 20,
      y: 200,
      width: 8,
      height: 8,
      dx: (Math.random() - 0.5) * 0.75, // Halved movement speed
      dy: (Math.random() - 0.5) * 0.75, // Halved movement speed
      speed: 1.0, // Halved speed from 2.0 to 1.0
    })
    blockers.push({
      x: CANVAS_WIDTH - 28,
      y: 200,
      width: 8,
      height: 8,
      dx: (Math.random() - 0.5) * 0.75, // Halved movement speed
      dy: (Math.random() - 0.5) * 0.75, // Halved movement speed
      speed: 1.0, // Halved speed from 2.0 to 1.0
    })
    blockers.push({
      x: 60,
      y: 210,
      width: 8,
      height: 8,
      dx: (Math.random() - 0.5) * 0.75, // Halved movement speed
      dy: (Math.random() - 0.5) * 0.75, // Halved movement speed
      speed: 1.0, // Halved speed from 2.0 to 1.0
    })

    // Fullback (1 player) - in front of running back
    blockers.push({
      x: 160,
      y: 240,
      width: 8,
      height: 8,
      dx: (Math.random() - 0.5) * 0.5, // Halved movement speed
      dy: (Math.random() - 0.5) * 0.5, // Halved movement speed
      speed: 0.9, // Halved speed from 1.8 to 0.9
    })

    // Tight End (1 player) - next to offensive line
    blockers.push({
      x: 240,
      y: 220,
      width: 8,
      height: 8,
      dx: (Math.random() - 0.5) * 0.5, // Halved movement speed
      dy: (Math.random() - 0.5) * 0.5, // Halved movement speed
      speed: 0.8, // Halved speed from 1.6 to 0.8
    })

    blockersRef.current = blockers
  }, [hardMode])

  // Start game
  const startGame = useCallback(() => {
    playerRef.current = { x: 160, y: 260, width: 8, height: 8 } // Updated player starting position to bottom of screen
    initializeDefenders()
    setGameState("playing")
    setStartTime(Date.now())
  }, [initializeDefenders])

  const resetPlayerPosition = useCallback(() => {
    playerRef.current = { x: 160, y: 260, width: 8, height: 8 } // Updated reset position to bottom of screen
    initializeDefenders()
    setStartTime(Date.now())
  }, [initializeDefenders])

  // Check collision
  const checkCollision = useCallback((rect1: Player | Defender | Blocker, rect2: Player | Defender | Blocker) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    )
  }, [])

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#9BBB58"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    if (gameState === "home") {
      // Draw home screen
      ctx.fillStyle = "#0F380F"
      ctx.font = "18px monospace"
      ctx.textAlign = "center"
      ctx.fillText("HAVEN STUDIOS", CANVAS_WIDTH / 2, 50)
      ctx.font = "14px monospace"
      ctx.fillText("GAME CENTER", CANVAS_WIDTH / 2, 75)

      ctx.font = "12px monospace"
      ctx.fillText("Available Games:", CANVAS_WIDTH / 2, 110)

      // Game selection box
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(CANVAS_WIDTH / 2 - 80, 125, 160, 30)
      ctx.fillStyle = "#0F380F"
      ctx.fillText("🏈 FOOTBALL RUSH", CANVAS_WIDTH / 2, 145)

      ctx.font = "10px monospace"
      ctx.fillText("Press START to select game", CANVAS_WIDTH / 2, 180)
      ctx.fillText("More games coming soon!", CANVAS_WIDTH / 2, 200)
    } else if (gameState === "gameExplainer") {
      ctx.fillStyle = "#0F380F"
      ctx.font = "18px monospace"
      ctx.textAlign = "center"
      ctx.fillText("FOOTBALL RUSH", CANVAS_WIDTH / 2, 40)

      ctx.font = "12px monospace"
      ctx.fillText("🏈 AMERICAN FOOTBALL", CANVAS_WIDTH / 2, 65)

      ctx.font = "10px monospace"
      ctx.fillText("OBJECTIVE:", CANVAS_WIDTH / 2, 90)
      ctx.fillText("Reach the end zone while", CANVAS_WIDTH / 2, 105)
      ctx.fillText("avoiding defenders!", CANVAS_WIDTH / 2, 120)

      ctx.fillText("CONTROLS:", CANVAS_WIDTH / 2, 145)
      ctx.fillText("D-pad: Move in all directions", CANVAS_WIDTH / 2, 160)
      ctx.fillText("S Button: Sprint forward", CANVAS_WIDTH / 2, 175)

      ctx.fillText("You have 3 lives total!", CANVAS_WIDTH / 2, 200)
      ctx.fillText("Press START to begin", CANVAS_WIDTH / 2, 220)
    } else if (gameState === "menu") {
      // Draw menu
      ctx.fillStyle = "#0F380F"
      ctx.font = "16px monospace"
      ctx.textAlign = "center"
      ctx.fillText("Haven Studios League", CANVAS_WIDTH / 2, 60)
      ctx.font = "12px monospace"
      ctx.fillText("FOOTBALL RUSH", CANVAS_WIDTH / 2, 90)
      ctx.fillText(`Mode: ${hardMode ? "HARD (20)" : "EASY (10)"}`, CANVAS_WIDTH / 2, 110)
      ctx.fillText("Press START to play", CANVAS_WIDTH / 2, 140)
      ctx.fillText("Press SELECT for mode", CANVAS_WIDTH / 2, 160)
      ctx.fillText("Hold HOME button for main menu", CANVAS_WIDTH / 2, 180)
    } else if (gameState === "modeSelect") {
      ctx.fillStyle = "#0F380F"
      ctx.font = "16px monospace"
      ctx.textAlign = "center"
      ctx.fillText("SELECT DIFFICULTY", CANVAS_WIDTH / 2, 60)

      ctx.font = "14px monospace"
      if (!hardMode) {
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(CANVAS_WIDTH / 2 - 60, 85, 120, 25)
        ctx.fillStyle = "#0F380F"
      }
      ctx.fillText("EASY MODE", CANVAS_WIDTH / 2, 100)

      ctx.fillStyle = "#0F380F"
      if (hardMode) {
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(CANVAS_WIDTH / 2 - 50, 115, 100, 25)
        ctx.fillStyle = "#0F380F"
      }
      ctx.fillText("HARD MODE", CANVAS_WIDTH / 2, 130)

      ctx.fillStyle = "#0F380F"
      ctx.font = "10px monospace"
      ctx.fillText("Use D-pad UP/DOWN to select", CANVAS_WIDTH / 2, 160)
      ctx.fillText("Press START to confirm", CANVAS_WIDTH / 2, 175)
      ctx.fillText(`Easy: 10 | Hard: 20 defenders`, CANVAS_WIDTH / 2, 190)
    } else if (gameState === "playing") {
      // Draw field
      ctx.fillStyle = "#8BAD47"
      ctx.fillRect(0, 0, CANVAS_WIDTH, FIELD_HEIGHT)

      // Draw end zone
      ctx.fillStyle = "#0F380F"
      ctx.fillRect(0, 0, CANVAS_WIDTH, END_ZONE_HEIGHT)

      // Draw yard lines
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 1
      for (let i = END_ZONE_HEIGHT; i < FIELD_HEIGHT; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(CANVAS_WIDTH, i)
        ctx.stroke()
      }

      // Update player
      const player = playerRef.current
      if ((keysRef.current.has("ArrowUp") || movingRef.current === "up") && player.y > 0) player.y -= 1
      if ((keysRef.current.has("ArrowDown") || movingRef.current === "down") && player.y < FIELD_HEIGHT - player.height)
        player.y += 1
      if ((keysRef.current.has("ArrowLeft") || movingRef.current === "left") && player.x > 0) player.x -= 1
      if (
        (keysRef.current.has("ArrowRight") || movingRef.current === "right") &&
        player.x < CANVAS_WIDTH - player.width
      )
        player.x += 1

      if (movingRef.current === "superUp" && player.y > 0) player.y -= 1.25

      blockersRef.current.forEach((blocker) => {
        blocker.x += blocker.dx
        blocker.y += blocker.dy

        // Bounce off walls
        if (blocker.x <= 0 || blocker.x >= CANVAS_WIDTH - blocker.width) {
          blocker.dx = -blocker.dx
        }
        if (blocker.y <= END_ZONE_HEIGHT || blocker.y >= FIELD_HEIGHT - blocker.height) {
          blocker.dy = -blocker.dy
        }

        // Keep within bounds
        blocker.x = Math.max(0, Math.min(CANVAS_WIDTH - blocker.width, blocker.x))
        blocker.y = Math.max(END_ZONE_HEIGHT, Math.min(FIELD_HEIGHT - blocker.height, blocker.y))
      })

      // Update defenders
      defendersRef.current.forEach((defender) => {
        if (defender.stunned) {
          defender.stunnedTime -= 16 // Assuming 60fps, ~16ms per frame
          if (defender.stunnedTime <= 0) {
            defender.stunned = false
          }
          return // Skip movement while stunned
        }

        const player = playerRef.current

        if (defender.isZoneDefender) {
          const distanceToPlayer = Math.sqrt((player.x - defender.x) ** 2 + (player.y - defender.y) ** 2)
          const distanceToZone = Math.sqrt((defender.x - defender.zoneX) ** 2 + (defender.y - defender.zoneY) ** 2)

          // If player is in zone or defender is far from zone, pursue player
          if (distanceToPlayer <= defender.zoneRadius || distanceToZone > 20) {
            // Chase player like normal
            const playerVelX = player.x - defender.lastPlayerX
            const playerVelY = player.y - defender.lastPlayerY

            const baseInterceptTime = distanceToPlayer / (defender.speed * 20)
            const interceptTime = Math.min(baseInterceptTime, 60)

            const velocityDamping = 0.9
            const predictedX = player.x + playerVelX * interceptTime * velocityDamping
            const predictedY = player.y + playerVelY * interceptTime * velocityDamping

            let targetX = predictedX
            let targetY = predictedY

            const currentDx = targetX - defender.x
            const currentDy = targetY - defender.y
            const isOnDiagonalPath = Math.abs(currentDx) > 20 && Math.abs(currentDy) > 20
            const isGoodInterceptAngle = Math.abs(currentDx / currentDy) > 0.3 && Math.abs(currentDx / currentDy) < 3

            if (playerVelY < 0 && distanceToPlayer < 50 && !(isOnDiagonalPath && isGoodInterceptAngle)) {
              // Player is moving forward and defender is close - execute lateral tackle only if not on good diagonal path
              const isPlayerSprinting = movingRef.current === "superUp"
              const lateralForce = isPlayerSprinting ? 80 : 60

              // Determine which side to attack from based on defender position
              const isDefenderLeft = defender.x < player.x
              const lateralOffset = isDefenderLeft ? lateralForce : -lateralForce

              // Target a point directly lateral to the player's predicted position
              targetX = predictedX + lateralOffset
              targetY = predictedY // Same Y level for lateral tackle

              // If very close, go directly for the tackle
              if (distanceToPlayer < 25) {
                targetX = player.x + (isDefenderLeft ? 15 : -15)
                targetY = player.y
              }
            } else if (playerVelY < 0) {
              const cutoffFactor = 0.5
              targetX = predictedX + (playerVelX > 0 ? -cutoffFactor * 70 : cutoffFactor * 70)
              targetY = predictedY - 30
            }

            const dx = targetX - defender.x
            const dy = targetY - defender.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance > 0) {
              const baseAccuracy = defender.speed > 1.5 ? 0.95 : 0.85
              const distanceAccuracy = Math.min(1, 120 / distanceToPlayer)
              const finalAccuracy = baseAccuracy * distanceAccuracy
              const randomFactor = finalAccuracy + Math.random() * (1 - finalAccuracy)

              defender.dx = (dx / distance) * defender.speed * randomFactor
              defender.dy = (dy / distance) * defender.speed * randomFactor
            }
          } else {
            // Stay in zone - move randomly within zone bounds
            if (Math.random() < 0.02) {
              defender.dx = (Math.random() - 0.5) * 1.5
              defender.dy = (Math.random() - 0.5) * 1.5
            }

            const futureX = defender.x + defender.dx
            const futureY = defender.y + defender.dy
            const futureDistanceToZone = Math.sqrt((futureX - defender.zoneX) ** 2 + (futureY - defender.zoneY) ** 2)

            if (futureDistanceToZone > defender.zoneRadius * 0.8) {
              const dx = defender.zoneX - defender.x
              const dy = defender.zoneY - defender.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              if (distance > 0) {
                defender.dx = (dx / distance) * 1.0
                defender.dy = (dy / distance) * 1.0
              }
            }
          }
        } else {
          const playerVelX = player.x - defender.lastPlayerX
          const playerVelY = player.y - defender.lastPlayerY

          const distanceToPlayer = Math.sqrt((player.x - defender.x) ** 2 + (player.y - defender.y) ** 2)

          const baseInterceptTime = distanceToPlayer / (defender.speed * 20)
          const interceptTime = Math.min(baseInterceptTime, 60)

          const velocityDamping = 0.9
          const predictedX = player.x + playerVelX * interceptTime * velocityDamping
          const predictedY = player.y + playerVelY * interceptTime * velocityDamping

          let targetX = predictedX
          let targetY = predictedY

          const currentDx = targetX - defender.x
          const currentDy = targetY - defender.y
          const isOnDiagonalPath = Math.abs(currentDx) > 20 && Math.abs(currentDy) > 20
          const isGoodInterceptAngle = Math.abs(currentDx / currentDy) > 0.3 && Math.abs(currentDx / currentDy) < 3

          if (playerVelY < 0 && distanceToPlayer < 50 && !(isOnDiagonalPath && isGoodInterceptAngle)) {
            // Player is moving forward and defender is close - execute lateral tackle only if not on good diagonal path
            const isPlayerSprinting = movingRef.current === "superUp"
            const lateralForce = isPlayerSprinting ? 80 : 60

            // Determine which side to attack from based on defender position
            const isDefenderLeft = defender.x < player.x
            const lateralOffset = isDefenderLeft ? lateralForce : -lateralForce

            // Target a point directly lateral to the player's predicted position
            targetX = predictedX + lateralOffset
            targetY = predictedY // Same Y level for lateral tackle

            // If very close, go directly for the tackle
            if (distanceToPlayer < 25) {
              targetX = player.x + (isDefenderLeft ? 15 : -15)
              targetY = player.y
            }
          } else if (playerVelY < 0) {
            const cutoffFactor = 0.5
            targetX = predictedX + (playerVelX > 0 ? -cutoffFactor * 70 : cutoffFactor * 70)
            targetY = predictedY - 30
          }

          const dx = targetX - defender.x
          const dy = targetY - defender.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > 0) {
            const baseAccuracy = defender.speed > 1.5 ? 0.95 : 0.85
            const distanceAccuracy = Math.min(1, 120 / distanceToPlayer)
            const finalAccuracy = baseAccuracy * distanceAccuracy
            const randomFactor = finalAccuracy + Math.random() * (1 - finalAccuracy)

            defender.dx = (dx / distance) * defender.speed * randomFactor
            defender.dy = (dy / distance) * defender.speed * randomFactor
          }
        }

        const momentum = 0.85
        defender.x += defender.dx * momentum
        defender.y += defender.dy * momentum

        defender.lastPlayerX = player.x
        defender.lastPlayerY = player.y

        // Keep defenders within field bounds
        if (defender.x <= 0 || defender.x >= CANVAS_WIDTH - defender.width) {
          defender.x = Math.max(0, Math.min(CANVAS_WIDTH - defender.width, defender.x))
        }
        if (defender.y <= END_ZONE_HEIGHT || defender.y >= FIELD_HEIGHT - defender.height) {
          defender.y = Math.max(END_ZONE_HEIGHT, Math.min(FIELD_HEIGHT - defender.height, defender.y))
        }
      })

      blockersRef.current.forEach((blocker) => {
        defendersRef.current.forEach((defender) => {
          if (!defender.stunned && checkCollision(blocker, defender)) {
            defender.stunned = true
            defender.stunnedTime = 2000 // Increased stun duration from 1000ms to 2000ms (2 seconds)
          }
        })
      })

      // Check collisions with defenders
      for (const defender of defendersRef.current) {
        if (checkCollision(player, defender)) {
          const newLives = lives - 1
          setLives(newLives)

          if (newLives <= 0) {
            setGameStats({ scores, bestTime })
            setGameState("finalStats")
          } else {
            resetPlayerPosition()
          }
          return
        }
      }

      // Check win condition (reached end zone)
      if (player.y <= END_ZONE_HEIGHT) {
        const endTime = Date.now()
        const currentTime = (endTime - startTime) / 1000
        setCompletionTime(currentTime)

        const newScores = scores + 1
        setScores(newScores)

        if (bestTime === null || currentTime < bestTime) {
          setBestTime(currentTime)
        }

        setGameState("win")
        return
      }

      // Draw player
      ctx.fillStyle = "#0F380F"
      ctx.fillRect(player.x, player.y, player.width, player.height)

      // Draw defenders
      defendersRef.current.forEach((defender) => {
        ctx.fillStyle = defender.stunned ? "#FFB6C1" : "#8B0000"
        ctx.fillRect(defender.x, defender.y, defender.width, defender.height)
      })

      ctx.fillStyle = "#000080"
      blockersRef.current.forEach((blocker) => {
        ctx.fillRect(blocker.x, blocker.y, blocker.width, blocker.height)
      })

      const currentTime = (Date.now() - startTime) / 1000
      ctx.fillStyle = "#0F380F"
      ctx.font = "10px monospace"
      ctx.textAlign = "left"
      ctx.fillText(`Time: ${currentTime.toFixed(1)}s`, 10, FIELD_HEIGHT + 15)
      ctx.fillText(`Lives: ${lives}`, 10, FIELD_HEIGHT + 30)
      ctx.textAlign = "right"
      ctx.fillText(`Scores: ${scores}`, CANVAS_WIDTH - 10, FIELD_HEIGHT + 15)
    } else if (gameState === "gameOver") {
      // Draw game over screen
      ctx.fillStyle = "#0F380F"
      ctx.font = "16px monospace"
      ctx.textAlign = "center"
      ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, 100)
      ctx.font = "12px monospace"
      ctx.fillText("You got tackled!", CANVAS_WIDTH / 2, 130)
      ctx.fillText("Press START to try again", CANVAS_WIDTH / 2, 160)
      ctx.fillText("Press SELECT for mode", CANVAS_WIDTH / 2, 180)
      ctx.fillText("Hold HOME button for main menu", CANVAS_WIDTH / 2, 200)
    } else if (gameState === "win") {
      // Draw win screen
      ctx.fillStyle = "#0F380F"
      ctx.font = "16px monospace"
      ctx.textAlign = "center"
      ctx.fillText("TOUCHDOWN!", CANVAS_WIDTH / 2, 80)
      ctx.font = "12px monospace"
      ctx.fillText(`Time: ${completionTime.toFixed(2)} seconds`, CANVAS_WIDTH / 2, 110)
      ctx.fillText("Great job!", CANVAS_WIDTH / 2, 140)
      ctx.fillText("Press START for new game", CANVAS_WIDTH / 2, 170)
      ctx.fillText("Press SELECT for mode", CANVAS_WIDTH / 2, 190)
      ctx.fillText("Hold HOME button for main menu", CANVAS_WIDTH / 2, 210)
    } else if (gameState === "finalStats") {
      ctx.fillStyle = "#0F380F"
      ctx.font = "16px monospace"
      ctx.textAlign = "center"
      ctx.fillText("FINAL STATS", CANVAS_WIDTH / 2, 60)

      ctx.font = "14px monospace"
      ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, 90)

      ctx.font = "12px monospace"
      ctx.fillText(`Total Touchdowns: ${gameStats.scores}`, CANVAS_WIDTH / 2, 120)

      if (gameStats.bestTime !== null) {
        ctx.fillText(`Best Time: ${gameStats.bestTime.toFixed(2)}s`, CANVAS_WIDTH / 2, 140)
      } else {
        ctx.fillText("Best Time: --", CANVAS_WIDTH / 2, 140)
      }

      ctx.font = "10px monospace"
      ctx.fillText("Press START for new game", CANVAS_WIDTH / 2, 170)
      ctx.fillText("Press SELECT for mode", CANVAS_WIDTH / 2, 185)
      ctx.fillText("Hold HOME button for main menu", CANVAS_WIDTH / 2, 200)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [
    gameState,
    startTime,
    completionTime,
    checkCollision,
    hardMode,
    lives,
    scores,
    bestTime,
    gameStats,
    resetPlayerPosition,
  ])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code)

      if (gameState === "home") {
        if (e.code === "Enter" || e.code === "Space") {
          setGameState("gameExplainer")
        }
      } else if (gameState === "gameExplainer") {
        if (e.code === "Enter" || e.code === "Space") {
          setGameState("menu")
        }
      } else if (e.code === "Enter" || e.code === "Space") {
        if (gameState === "menu" || gameState === "gameOver" || gameState === "win" || gameState === "finalStats") {
          if (gameState === "finalStats") {
            setScores(0)
            setBestTime(null)
            setLives(3)
          }
          startGame()
        } else if (gameState === "modeSelect") {
          setGameState("menu")
        }
      }

      if (gameState === "modeSelect") {
        if (e.code === "ArrowUp" || e.code === "ArrowDown") {
          setHardMode(!hardMode)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameState, startGame, hardMode])

  // Start game loop
  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameLoop])

  const handleMoveStart = (direction: string) => {
    if (gameState === "playing") {
      movingRef.current = direction
    }
  }

  const handleMoveEnd = () => {
    movingRef.current = null
  }

  const handleModeToggle = (direction: string) => {
    if (gameState === "modeSelect") {
      if (direction === "up" || direction === "down") {
        setHardMode(!hardMode)
      }
    }
  }

  const handleStartPress = () => {
    if (gameState === "home") {
      setGameState("gameExplainer")
    } else if (gameState === "gameExplainer") {
      setGameState("menu")
    } else if (gameState === "menu" || gameState === "gameOver" || gameState === "win" || gameState === "finalStats") {
      if (gameState === "finalStats") {
        setScores(0)
        setBestTime(null)
        setLives(3)
      }
      startGame()
    } else if (gameState === "modeSelect") {
      setGameState("menu")
    }
  }

  const handleSelectPress = () => {
    if (gameState === "menu" || gameState === "gameOver" || gameState === "win" || gameState === "finalStats") {
      setGameState("modeSelect")
    }
  }

  const handleHomePress = () => {
    setGameState("home")
  }

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-300 rounded-3xl p-6 shadow-2xl max-w-md w-full">
        {/* Screen */}
        <div className="bg-gray-900 rounded-lg p-4 mb-8">
          <div className="bg-gray-700 rounded p-2 mb-2">
            <div className="text-gray-400 text-xs text-center font-mono">HAVEN STUDIOS</div>
          </div>
          <div className="bg-green-200 rounded border-6 border-gray-600 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="w-full h-auto pixelated"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-end">
          <div className="relative w-32 h-32">
            {/* D-pad cross shape background */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Horizontal bar */}
              <div className="absolute w-28 h-10 bg-gray-700 rounded-sm shadow-inner border border-gray-800"></div>
              {/* Vertical bar */}
              <div className="absolute w-10 h-28 bg-gray-700 rounded-sm shadow-inner border border-gray-800"></div>
            </div>

            {/* Up button */}
            <button
              onTouchStart={() => {
                handleMoveStart("up")
                handleModeToggle("up")
              }}
              onTouchEnd={handleMoveEnd}
              onMouseDown={() => {
                handleMoveStart("up")
                handleModeToggle("up")
              }}
              onMouseUp={handleMoveEnd}
              onMouseLeave={handleMoveEnd}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-12 bg-gray-600 hover:bg-gray-500 active:bg-gray-800 active:shadow-inner rounded-sm border-2 border-gray-400 border-b-gray-800 border-r-gray-800 flex items-center justify-center select-none transition-all duration-75"
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                WebkitTouchCallout: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div className="w-0 h-0 border-l-[7px] border-r-[7px] border-b-[10px] border-l-transparent border-r-transparent border-b-white pointer-events-none"></div>
            </button>

            {/* Down button */}
            <button
              onTouchStart={() => {
                handleMoveStart("down")
                handleModeToggle("down")
              }}
              onTouchEnd={handleMoveEnd}
              onMouseDown={() => {
                handleMoveStart("down")
                handleModeToggle("down")
              }}
              onMouseUp={handleMoveEnd}
              onMouseLeave={handleMoveEnd}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-12 bg-gray-600 hover:bg-gray-500 active:bg-gray-800 active:shadow-inner rounded-sm border-2 border-gray-400 border-b-gray-800 border-r-gray-800 flex items-center justify-center select-none transition-all duration-75"
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                WebkitTouchCallout: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div className="w-0 h-0 border-l-[7px] border-r-[7px] border-t-[10px] border-l-transparent border-r-transparent border-t-white pointer-events-none"></div>
            </button>

            {/* Left button */}
            <button
              onTouchStart={() => handleMoveStart("left")}
              onTouchEnd={handleMoveEnd}
              onMouseDown={() => handleMoveStart("left")}
              onMouseUp={handleMoveEnd}
              onMouseLeave={handleMoveEnd}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-10 bg-gray-600 hover:bg-gray-500 active:bg-gray-800 active:shadow-inner rounded-sm border-2 border-gray-400 border-b-gray-800 border-r-gray-800 flex items-center justify-center select-none transition-all duration-75 shadow-lg"
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                WebkitTouchCallout: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div className="w-0 h-0 border-t-[7px] border-b-[7px] border-r-[10px] border-t-transparent border-b-transparent border-r-white pointer-events-none"></div>
            </button>

            {/* Right button */}
            <button
              onTouchStart={() => handleMoveStart("right")}
              onTouchEnd={handleMoveEnd}
              onMouseDown={() => handleMoveStart("right")}
              onMouseUp={handleMoveEnd}
              onMouseLeave={handleMoveEnd}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-10 bg-gray-600 hover:bg-gray-500 active:bg-gray-800 active:shadow-inner rounded-sm border-2 border-gray-400 border-b-gray-800 border-r-gray-800 flex items-center justify-center select-none transition-all duration-75 shadow-lg"
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                WebkitTouchCallout: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div className="w-0 h-0 border-t-[7px] border-b-[7px] border-l-[10px] border-t-transparent border-b-transparent border-l-white pointer-events-none"></div>
            </button>
          </div>

          {/* Sprint button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onTouchStart={() => handleMoveStart("superUp")}
              onTouchEnd={handleMoveEnd}
              onMouseDown={() => handleMoveStart("superUp")}
              onMouseUp={handleMoveEnd}
              onMouseLeave={handleMoveEnd}
              className="w-16 h-16 bg-purple-600 hover:bg-purple-500 active:bg-purple-800 active:shadow-inner rounded-full border-4 border-purple-400 border-b-purple-800 border-r-purple-800 flex items-center justify-center text-white font-bold text-xl select-none transition-all duration-75 shadow-lg"
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                WebkitTouchCallout: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              S
            </button>
            <div className="text-xs text-gray-600 text-center font-bold">
              <div>SPRINT</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onTouchStart={handleHomePress}
            onClick={handleHomePress}
            className="px-3 py-2 bg-gray-600 hover:bg-gray-500 active:bg-gray-800 active:shadow-inner rounded-full border-2 border-gray-400 border-b-gray-800 border-r-gray-800 text-white text-xs font-bold select-none transition-all duration-75 shadow-md"
            style={{
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              WebkitTouchCallout: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            HOME
          </button>
          <button
            onTouchStart={handleSelectPress}
            onClick={handleSelectPress}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 active:bg-gray-800 active:shadow-inner rounded-full border-2 border-gray-400 border-b-gray-800 border-r-gray-800 text-white text-xs font-bold select-none transition-all duration-75 shadow-md"
            style={{
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              WebkitTouchCallout: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            SELECT
          </button>
          <button
            onTouchStart={handleStartPress}
            onClick={handleStartPress}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 active:bg-gray-800 active:shadow-inner rounded-full border-2 border-gray-400 border-b-gray-800 border-r-gray-800 text-white text-xs font-bold select-none transition-all duration-75 shadow-md"
            style={{
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              WebkitTouchCallout: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            START
          </button>
        </div>
      </div>
    </div>
  )
}
