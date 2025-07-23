"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import CountUpAnimation from "@/components/CountUpAnimation"
import {
  uploadImage,
  signUp,
  signIn,
  getTournaments,
  createTournament as createTournamentDB,
  updateTournament,
} from "@/lib/supabase"
import {
  X,
  Monitor,
  Settings,
  Plus,
  Trash2,
  Play,
  Save,
  Crown,
  Star,
  Heart,
  Zap,
  Shield,
  Trophy,
  Target,
  Flame,
  LogOut,
  UserPlus,
  LogIn,
  Gamepad2,
  Users,
  FileText,
  Pause,
  RotateCcw,
  Eye,
  Mic,
  MicOff,
  Sparkles,
  Rocket,
  Upload,
  ImageIcon,
  PaletteIcon,
  ChevronRight,
  Circle,
  CheckCircle,
  ExternalLink,
} from "lucide-react"
import AuthDialog from "@/components/feud/AuthDialog"
import HeaderBar from "@/components/feud/HeaderBar"
import GameControlsCard from "@/components/feud/GameControlsCard"
import TeamScoresCard from "@/components/feud/TeamScoresCard"
import QuestionCard from "@/components/feud/QuestionCard"
import TournamentManagementCard from "@/components/feud/TournamentManagementCard"
import QuickActionsCard from "@/components/feud/QuickActionsCard"
import GameStateNavigationBar from "@/components/feud/GameStateNavigationBar"
import BracketManagementCard from "@/components/feud/BracketManagementCard"

// Game States for the new flow
type GameState =
  | "idle"
  | "tournament-start"
  | "bracket-show"
  | "team-vs"
  | "round-start"
  | "game-play"
  | "pass-or-play"
  | "round-end-reveal"
  | "post-round-scoring"
  | "match-winner"
  | "bracket-update"
  | "tournament-winner"

const gameStateNames = {
  idle: "Idle Screen",
  "tournament-start": "Tournament Start",
  "bracket-show": "Bracket Display",
  "team-vs": "Team Face-off",
  "round-start": "Round Start",
  "game-play": "Game Play",
  "pass-or-play": "Pass or Play",
  "round-end-reveal": "Round End Reveal",
  "post-round-scoring": "Post Round Scoring",
  "match-winner": "Match Winner",
  "bracket-update": "Bracket Update",
  "tournament-winner": "Tournament Winner",
}

const gameStateRoutes = {
  idle: "/states/idle",
  "tournament-start": "/states/tournament-start",
  "bracket-show": "/states/bracket-show",
  "team-vs": "/states/team-vs",
  "round-start": "/states/round-start",
  "game-play": "/states/game-play",
  "pass-or-play": "/states/pass-or-play",
  "round-end-reveal": "/states/round-end-reveal",
  "post-round-scoring": "/states/post-round-scoring",
  "match-winner": "/states/match-winner",
  "bracket-update": "/states/bracket-update",
  "tournament-winner": "/states/tournament-winner",
}

// Cookie utilities
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`
}

const getCookie = (name: string): string | null => {
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length))
  }
  return null
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// Enhanced game data structure
const questionCategories = [
  { id: "general", name: "General Knowledge", color: "bg-blue-500" },
  { id: "sports", name: "Sports", color: "bg-green-500" },
  { id: "entertainment", name: "Entertainment", color: "bg-purple-500" },
  { id: "food", name: "Food & Drink", color: "bg-orange-500" },
  { id: "history", name: "History", color: "bg-red-500" },
  { id: "science", name: "Science", color: "bg-cyan-500" },
  { id: "family", name: "Family Life", color: "bg-pink-500" },
  { id: "work", name: "Work & Career", color: "bg-yellow-500" },
  { id: "travel", name: "Travel", color: "bg-indigo-500" },
  { id: "custom", name: "Custom", color: "bg-gray-500" },
]

const tournamentModes = [
  { id: "roundrobin", name: "Round Robin", description: "Every team plays every other team" },
  { id: "single", name: "Single Elimination", description: "Teams are eliminated after one loss" },
  { id: "double", name: "Double Elimination", description: "Teams get a second chance in losers bracket" },
]

const teamIcons = [
  { name: "Crown", icon: Crown, value: "crown" },
  { name: "Star", icon: Star, value: "star" },
  { name: "Heart", icon: Heart, value: "heart" },
  { name: "Lightning", icon: Zap, value: "zap" },
  { name: "Shield", icon: Shield, value: "shield" },
  { name: "Trophy", icon: Trophy, value: "trophy" },
  { name: "Target", icon: Target, value: "target" },
  { name: "Flame", icon: Flame, value: "flame" },
  { name: "Gamepad", icon: Gamepad2, value: "gamepad" },
]

const teamColors = [
  { name: "Red", value: "red", hex: "#ef4444" },
  { name: "Blue", value: "blue", hex: "#3b82f6" },
  { name: "Green", value: "green", hex: "#22c55e" },
  { name: "Purple", value: "purple", hex: "#a855f7" },
  { name: "Orange", value: "orange", hex: "#f97316" },
  { name: "Pink", value: "pink", hex: "#ec4899" },
  { name: "Cyan", value: "cyan", hex: "#06b6d4" },
  { name: "Yellow", value: "yellow", hex: "#eab308" },
]

interface UserType {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
}

interface TeamConfig {
  name: string
  primaryColor: string
  secondaryColor: string
  icon: string
  iconUrl?: string
  logo?: string
  motto?: string
}

interface MatchQuestion {
  id: string
  round: 1 | 2 | 3 | 4 | "tiebreaker"
  question: string
  answers: { text: string; points: number }[]
  category: string
  difficulty: string
}

interface Match {
  id: string
  team1Id: string
  team2Id: string
  winnerId?: string
  score1?: number
  score2?: number
  status: "pending" | "in-progress" | "completed"
  questions: MatchQuestion[]
  currentRound: 1 | 2 | 3 | 4 | "tiebreaker"
  currentQuestionIndex: number
  gameState: GameState
}

interface Tournament {
  id: string
  name: string
  mode: string
  teams: TeamConfig[]
  matches: Match[]
  status: "setup" | "in-progress" | "completed"
  createdAt: string
  currentMatchIndex: number
}

const broadcast = typeof window !== "undefined" ? new BroadcastChannel("feud-game-state") : null;

export default function FamilyFeudControl() {
  // User management
  const [user, setUser] = useState<UserType | null>(null)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [authForm, setAuthForm] = useState({ username: "", email: "", password: "" })

  // Tournament management
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null)
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null)
  const [showTournamentDialog, setShowTournamentDialog] = useState(false)
  const [tournamentForm, setTournamentForm] = useState({
    name: "",
    mode: "roundrobin",
  })
  const [tournamentTeams, setTournamentTeams] = useState<TeamConfig[]>([
    {
      name: "Team 1",
      primaryColor: "#ef4444",
      secondaryColor: "#dc2626",
      icon: "crown",
      motto: "Champions in the making!",
    },
    {
      name: "Team 2",
      primaryColor: "#3b82f6",
      secondaryColor: "#2563eb",
      icon: "star",
      motto: "Ready to dominate!",
    },
  ])

  // Game state management
  const [currentGameState, setCurrentGameState] = useState<GameState>("idle")
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3 | 4 | "tiebreaker">(1)
  const [team1Score, setTeam1Score] = useState(0)
  const [team2Score, setTeam2Score] = useState(0)
  const [roundScore, setRoundScore] = useState(0)
  const [strikes, setStrikes] = useState(0)
  const [showScoreAnimation, setShowScoreAnimation] = useState(false)
  const [animatingScore, setAnimatingScore] = useState(0)
  const [revealedAnswers, setRevealedAnswers] = useState<boolean[]>([])
  const [currentTeam, setCurrentTeam] = useState<'team1' | 'team2'>("team1")
  const [faceOffWinnerTeam, setFaceOffWinnerTeam] = useState<'team1' | 'team2' | null>(null)
  const [showPlayPass, setShowPlayPass] = useState(false)
  const [stealActive, setStealActive] = useState(false);
  const [stealTeam, setStealTeam] = useState<'team1' | 'team2'>('team2');

  // Dialog states
  const [showTeamCustomization, setShowTeamCustomization] = useState(false)
  const [showMatchQuestions, setShowMatchQuestions] = useState(false)
  const [showQuestionDialog, setShowQuestionDialog] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<MatchQuestion | null>(null)
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswers, setNewAnswers] = useState([{ text: "", points: 0 }])
  const [selectedMatchForQuestions, setSelectedMatchForQuestions] = useState<Match | null>(null)

  // Audio settings
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [gameVolume, setGameVolume] = useState([75])
  const [micEnabled, setMicEnabled] = useState(false)

  // Timer
  const [gameTimer, setGameTimer] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // File upload
  const [uploadingImage, setUploadingImage] = useState(false)

  // Timer functionality
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setGameTimer((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [timerRunning])

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Load user data on mount
  useEffect(() => {
    const savedUser = getCookie("familyFeudUser")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      loadUserTournaments(userData.id)
    }
  }, [])

  // Prevent accidental refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = "Are you sure you want to leave? All game progress will be saved."
      return "Are you sure you want to leave? All game progress will be saved."
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  // Save game state to localStorage for all pages sync
  useEffect(() => {
    if (currentTournament && currentMatch) {
      const gameState = {
        gameState: currentGameState,
        currentRound,
        currentQuestionIndex: currentMatch.currentQuestionIndex,
        revealedAnswers,
        team1Score,
        team2Score,
        roundScore,
        currentTeam: "team1",
        strikes,
        team1Config: {
          name: currentTournament.teams[0]?.name || "Team 1",
          color: currentTournament.teams[0]?.primaryColor?.replace("#", "") || "red",
          icon: currentTournament.teams[0]?.icon || "crown",
          logo: currentTournament.teams[0]?.logo,
          motto: currentTournament.teams[0]?.motto,
        },
        team2Config: {
          name: currentTournament.teams[1]?.name || "Team 2",
          color: currentTournament.teams[1]?.primaryColor?.replace("#", "") || "blue",
          icon: currentTournament.teams[1]?.icon || "star",
          logo: currentTournament.teams[1]?.logo,
          motto: currentTournament.teams[1]?.motto,
        },
        showStrikeOverlay: false,
        fastMoneyScore: 0,
        fastMoneyAnswers: [],
        gameWinner: null,
        tournamentWinner: null,
        currentQuestion: currentMatch.questions.find((q) => q.round === currentRound) || null,
        passOrPlayChoice: null,
        allAnswersRevealed: false,
        roundWinner: null,
        tournament: {
          name: currentTournament.name,
          teams: currentTournament.teams,
          matches: currentTournament.matches,
          currentMatchIndex: currentTournament.currentMatchIndex,
        },
      }

      // Save to localStorage for all pages sync
      localStorage.setItem("familyFeudGameState", JSON.stringify(gameState))
      // Also save to cookies as backup
      setCookie("familyFeudGameState", JSON.stringify(gameState))
    }
  }, [
    currentGameState,
    currentRound,
    team1Score,
    team2Score,
    roundScore,
    strikes,
    currentTournament,
    currentMatch,
    revealedAnswers,
  ])

  // Reset revealedAnswers when the round changes
  useEffect(() => {
    const currentQ = currentMatch?.questions.find((q) => q.round === currentRound)
    if (currentQ) {
      setRevealedAnswers(Array(currentQ.answers.length).fill(false))
    }
  }, [currentRound, currentMatch])

  // Tournament functions
  const loadUserTournaments = async (userId: string) => {
    try {
      const { data, error } = await getTournaments(userId)
      if (error) {
        console.error("Error loading tournaments:", error)
        return
      }

      if (data) {
        setTournaments(data)
        if (data.length > 0) {
          const activeTournament = data.find((t: any) => t.status === "in-progress") || data[0]
          setCurrentTournament(activeTournament)
          if (activeTournament.matches && activeTournament.matches.length > 0) {
            const currentMatch =
              activeTournament.matches[activeTournament.current_match_index] || activeTournament.matches[0]
            setCurrentMatch(currentMatch)
            setCurrentGameState(currentMatch.gameState || "idle")
          }
        }
      }
    } catch (error) {
      console.error("Error loading tournaments:", error)
    }
  }

  const createTournament = async () => {
    if (!user || !tournamentForm.name.trim() || tournamentTeams.length < 2) return

    const matches: Match[] = []

    // Generate matches based on tournament mode
    if (tournamentForm.mode === "roundrobin") {
      for (let i = 0; i < tournamentTeams.length; i++) {
        for (let j = i + 1; j < tournamentTeams.length; j++) {
          matches.push({
            id: `match-${i}-${j}`,
            team1Id: tournamentTeams[i].name,
            team2Id: tournamentTeams[j].name,
            status: 'pending',
            questions: [],
            currentRound: 1,
            currentQuestionIndex: 0,
            gameState: "idle",
          } as Match)
        }
      }
    }

    try {
      const { data, error } = await createTournamentDB(user.id, {
        name: tournamentForm.name,
        mode: tournamentForm.mode,
        teams: tournamentTeams, // Store complete team details
        matches: matches,
        status: "setup",
        current_match_index: 0,
      })

      if (error) {
        console.error("Error creating tournament:", error)
        alert("Failed to create tournament")
        return
      }

      if (data) {
        setCurrentTournament(data)
        setCurrentMatch(matches[0])
        setShowTournamentDialog(false)
        // Reset tournament form
        setTournamentForm({ name: "", mode: "roundrobin" })
        // Reload tournaments to get updated list
        loadUserTournaments(user.id)
      }
    } catch (error) {
      console.error("Error creating tournament:", error)
      alert("Failed to create tournament")
    }
  }

  const updateTournamentInStorage = async () => {
    if (!user || !currentTournament) return

    try {
      const { error } = await updateTournament(currentTournament.id, {
        teams: currentTournament.teams,
        matches: currentTournament.matches,
        current_match_index: currentTournament.currentMatchIndex,
        status: currentTournament.status,
      })

      if (error) {
        console.error("Error updating tournament:", error)
      }
    } catch (error) {
      console.error("Error updating tournament:", error)
    }
  }

  // Team management
  const addTournamentTeam = () => {
    const newTeam: TeamConfig = {
      name: `Team ${tournamentTeams.length + 1}`,
      primaryColor: teamColors[tournamentTeams.length % teamColors.length].hex,
      secondaryColor: teamColors[(tournamentTeams.length + 1) % teamColors.length].hex,
      icon: teamIcons[tournamentTeams.length % teamIcons.length].value,
      motto: "Ready to compete!",
    }
    setTournamentTeams([...tournamentTeams, newTeam])
  }

  const removeTournamentTeam = (index: number) => {
    if (tournamentTeams.length <= 2) return
    setTournamentTeams(tournamentTeams.filter((_, i) => i !== index))
  }

  const updateTournamentTeam = (index: number, updates: Partial<TeamConfig>) => {
    const updatedTeams = tournamentTeams.map((team, i) => (i === index ? { ...team, ...updates } : team))
    setTournamentTeams(updatedTeams)

    // If we have a current tournament, update it as well
    if (currentTournament) {
      const updatedTournament = { ...currentTournament, teams: updatedTeams }
      setCurrentTournament(updatedTournament)
      updateTournamentInStorage()
    }
  }

  // Image upload functions
  const handleImageUpload = async (file: File, teamIndex: number, type: "icon" | "logo") => {
    if (!user) return

    setUploadingImage(true)
    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`
      const { url, error } = await uploadImage(file, "team-assets", fileName)

      if (error) {
        console.error("Upload error:", error)
        alert("Failed to upload image")
        return
      }

      if (url) {
        const updates = type === "icon" ? { iconUrl: url } : { logo: url }
        updateTournamentTeam(teamIndex, updates)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  // Question management
  const createMatchQuestions = (matchId: string) => {
    if (!currentTournament) return

    const matchIndex = currentTournament.matches.findIndex((m) => m.id === matchId)
    if (matchIndex === -1) return

    // Create 5 questions for the match (one for each round + tiebreaker)
    const questions: MatchQuestion[] = [
      {
        id: `${matchId}-round1`,
        round: 1,
        question: "",
        answers: [{ text: "", points: 0 }],
        category: "general",
        difficulty: "medium",
      },
      {
        id: `${matchId}-round2`,
        round: 2,
        question: "",
        answers: [{ text: "", points: 0 }],
        category: "general",
        difficulty: "medium",
      },
      {
        id: `${matchId}-round3`,
        round: 3,
        question: "",
        answers: [{ text: "", points: 0 }],
        category: "general",
        difficulty: "medium",
      },
      {
        id: `${matchId}-round4`,
        round: 4,
        question: "",
        answers: [{ text: "", points: 0 }],
        category: "general",
        difficulty: "medium",
      },
      {
        id: `${matchId}-tiebreaker`,
        round: "tiebreaker",
        question: "",
        answers: [{ text: "", points: 0 }],
        category: "general",
        difficulty: "hard",
      },
    ]

    // Update the tournament with new questions
    const updatedTournament = { ...currentTournament }
    updatedTournament.matches[matchIndex].questions = questions
    setCurrentTournament(updatedTournament)
    updateTournamentInStorage()
  }

  // Game state management
  const changeGameState = (newState: GameState) => {
    setCurrentGameState(newState)
    if (currentMatch && currentTournament) {
      const matchIndex = currentTournament.matches.findIndex((m) => m.id === currentMatch.id)
      if (matchIndex !== -1) {
        const updatedTournament = { ...currentTournament }
        updatedTournament.matches[matchIndex].gameState = newState
        setCurrentTournament(updatedTournament)
        updateTournamentInStorage()
      }
    }
    // Broadcast the new state to all viewers
    if (broadcast) {
      broadcast.postMessage({ gameState: newState })
    }
  }

  const nextRound = () => {
    if (currentRound === "tiebreaker") return

    const nextRoundMap = { 1: 2, 2: 3, 3: 4, 4: "tiebreaker" } as const
    const newRound = nextRoundMap[currentRound as keyof typeof nextRoundMap]
    setCurrentRound(newRound)

    if (currentMatch && currentTournament) {
      const matchIndex = currentTournament.matches.findIndex((m) => m.id === currentMatch.id)
      if (matchIndex !== -1) {
        const updatedTournament = { ...currentTournament }
        updatedTournament.matches[matchIndex].currentRound = newRound
        setCurrentTournament(updatedTournament)
        updateTournamentInStorage()
      }
    }
    // Reset Answers Reveal state if round was marked done
    if (localStorage.getItem('roundDone') === 'true') {
      localStorage.setItem('showAllAnswers', 'false');
      localStorage.setItem('roundDone', 'false');
    }
  }

  const awardPoints = () => {
    setShowScoreAnimation(true)
    setAnimatingScore(roundScore)
    setTimeout(() => {
      if (currentTeam === 'team1') {
        setTeam1Score((prev) => prev + roundScore)
      } else {
        setTeam2Score((prev) => prev + roundScore)
      }
      setRoundScore(0)
      setShowScoreAnimation(false)
    }, 2000)
  }

  // User management functions
  const handleAuth = async () => {
    if (authMode === "register") {
      try {
        const { data, error } = await signUp(authForm.email, authForm.password, authForm.username)

        if (error) {
          alert(typeof error === "object" && error !== null && "message" in error ? (error as any).message : "Registration failed")
          return
        }

        if (data) {
          const newUser: UserType = {
            id: data.id,
            username: data.username,
            email: data.email,
            createdAt: data.created_at,
          }
          setUser(newUser)
          setCookie("familyFeudUser", JSON.stringify(newUser))
          loadUserTournaments(newUser.id)
        }
      } catch (error) {
        console.error("Registration error:", error)
        alert("Registration failed")
      }
    } else {
      try {
        const { data, error } = await signIn(authForm.email, authForm.password)

        if (error) {
          alert(typeof error === "object" && error !== null && "message" in error ? (error as any).message : "Login failed")
          return
        }

        if (data) {
          const userData: UserType = {
            id: data.id,
            username: data.username,
            email: data.email,
            createdAt: data.created_at,
          }
          setUser(userData)
          setCookie("familyFeudUser", JSON.stringify(userData))
          loadUserTournaments(userData.id)
        }
      } catch (error) {
        console.error("Login error:", error)
        alert("Login failed")
      }
    }
    setShowAuthDialog(false)
    setAuthForm({ username: "", email: "", password: "" })
  }

  const handleLogout = async () => {
    setUser(null)
    deleteCookie("familyFeudUser")
    setTournaments([])
    setCurrentTournament(null)
    setCurrentMatch(null)
  }

  // Get team icon component
  const getTeamIcon = (iconName: string) => {
    return teamIcons.find((i) => i.value === iconName)?.icon || Crown
  }

  // Update question in tournament
  const updateQuestionInTournament = (
    matchId: string,
    round: 1 | 2 | 3 | 4 | "tiebreaker",
    field: "question" | "answers",
    value: any,
  ) => {
    if (!currentTournament) return

    const updatedTournament = { ...currentTournament }
    const matchIndex = updatedTournament.matches.findIndex((m) => m.id === matchId)

    if (matchIndex === -1) return

    let questionIndex = updatedTournament.matches[matchIndex].questions.findIndex((q) => q.round === round)

    // If question doesn't exist, create it
    if (questionIndex === -1) {
      updatedTournament.matches[matchIndex].questions.push({
        id: `${matchId}-round${round}`,
        round: round,
        question: "",
        answers: [{ text: "", points: 0 }],
        category: "general",
        difficulty: "medium",
      })
      questionIndex = updatedTournament.matches[matchIndex].questions.length - 1
    }

    // Update the field
    if (field === "question") {
      updatedTournament.matches[matchIndex].questions[questionIndex].question = value
    } else if (field === "answers") {
      updatedTournament.matches[matchIndex].questions[questionIndex].answers = value
    }

    setCurrentTournament(updatedTournament)
    setSelectedMatchForQuestions(updatedTournament.matches[matchIndex])
    updateTournamentInStorage()
  }

  // Reveal answer function
  const revealAnswer = (answerIndex: number) => {
    const newRevealedAnswers = [...revealedAnswers]
    newRevealedAnswers[answerIndex] = true
    setRevealedAnswers(newRevealedAnswers)
  }

  // Handler for strike logic
  const handleStrike = () => {
    setStrikes((prev) => {
      const newStrikes = Math.min(3, prev + 1);
    
        localStorage.setItem('showStrikeOverlay', 'true');

      return newStrikes;
    });
  };

  // Listen for steal overlay result (from game-play page)
  // useEffect(() => {
  //   const handleStorage = () => {
  //     if (stealActive && localStorage.getItem('showStealOverlay') === 'false') {
  //       // Steal overlay closed, check result
  //       const stealResult = localStorage.getItem('stealResult');
  //       if (stealResult === 'success') {
  //         // Stealing team gets the roundScore
  //         if (stealTeam === 'team1') setTeam1Score((prev) => prev + roundScore);
  //         else setTeam2Score((prev) => prev + roundScore);
  //       } else if (stealResult === 'fail') {
  //         // Original team keeps the roundScore
  //         if (currentTeam === 'team1') setTeam1Score((prev) => prev + roundScore);
  //         else setTeam2Score((prev) => prev + roundScore);
  //       }
  //       setRoundScore(0);
  //       setStrikes(0);
  
  //     }
  //   };
  //   window.addEventListener('storage', handleStorage);
  //   return () => window.removeEventListener('storage', handleStorage);
  // }, [stealActive, stealTeam, currentTeam, roundScore]);

  // Auth dialog
  if (!user) {
    return (
      <AuthDialog
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleAuth={handleAuth}
      />
    )
  }

  return (
    <div
      className="min-h-full text-white p-4"
      style={{
        backgroundImage: "url('/idle-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative z-10">
        <HeaderBar user={user} handleLogout={handleLogout} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-4 mb-6">
          {/* Game Controls */}
          <GameControlsCard
            timerRunning={timerRunning}
            setTimerRunning={setTimerRunning}
            gameTimer={gameTimer}
            setGameTimer={setGameTimer}
            formatTime={formatTime}
            currentGameState={currentGameState}
            changeGameState={(state) => changeGameState(state as GameState)}
            gameStateNames={gameStateNames}
            currentRound={currentRound}
            nextRound={nextRound}
            strikes={strikes}
            setStrikes={setStrikes}
            awardPoints={awardPoints}
            roundScore={roundScore}
            showScoreAnimation={showScoreAnimation}
            animatingScore={animatingScore}
            team1Score={team1Score}
            team2Score={team2Score}
            currentTeam={currentTeam}
            onStrike={handleStrike}
            onResetStrikes={() => { setStrikes(0); localStorage.setItem('showStrikeOverlay', 'false'); }}
          />

          {/* Team Scores */}
        
          <TeamScoresCard
            team1Name={currentTournament?.teams[0]?.name || "Team 1"}
            team2Name={currentTournament?.teams[1]?.name || "Team 2"}
            team1Score={team1Score}
            team2Score={team2Score}
            showScoreAnimation={showScoreAnimation}
            animatingScore={animatingScore}
            roundScore={roundScore}
            currentTeam={currentTeam}
            showPlayPass={showPlayPass}
            onPlay={() => {
              setShowPlayPass(false)
              setCurrentGameState('game-play')
              localStorage.setItem('showPassOrPlayOverlay', 'false')
            }}
            onPass={() => {
              setShowPlayPass(false)
              setCurrentTeam(currentTeam === 'team1' ? 'team2' : 'team1')
              setCurrentGameState('game-play')
              localStorage.setItem('showPassOrPlayOverlay', 'false')
            }}
            onSwitchTeam={() => setCurrentTeam((prev) => (prev === 'team1' ? 'team2' : 'team1'))}
            onActivatePassOrPlay={() => {
              setShowPlayPass(true)
              localStorage.setItem('showPassOrPlayOverlay', 'true')
            }}
          />

          {/* Question Card */}
          <QuestionCard
            question={currentMatch?.questions.find((q) => q.round === currentRound)?.question || "No question set."}
            answers={currentMatch?.questions.find((q) => q.round === currentRound)?.answers || []}
            revealedAnswers={revealedAnswers}
            onReveal={(idx) => {   // Only reveal the answer, do not add points
              revealAnswer(idx)
            }}
            onAwardPoints={(idx) => {
              // Add points to the round pool only when this is called
              const answer = currentMatch?.questions.find((q) => q.round === currentRound)?.answers[idx]
              if (answer) {
                setRoundScore((prev) => prev + answer.points)
              }
            }}
            currentTeam={currentTeam === "team1"
              ? currentTournament?.teams[0]?.name || "Team 1"
              : currentTournament?.teams[1]?.name || "Team 2"}
          />

          {/* Tournament Management */}
          <TournamentManagementCard
            currentTournament={currentTournament}
            currentMatch={currentMatch}
            setShowTournamentDialog={setShowTournamentDialog}
            setShowTeamCustomization={setShowTeamCustomization}
            setShowMatchQuestions={setShowMatchQuestions}
            setCurrentMatch={setCurrentMatch}
            onCompleteMatch={(matchId) => {
              if (!currentTournament) return;
              const updatedMatches = currentTournament.matches.map((m) => m.id === matchId ? { ...m, status: 'completed' } : m);
              setCurrentTournament({ ...currentTournament, matches: updatedMatches });
              // Optionally update bracket logic here
            }}
          />
          <BracketManagementCard
            currentTournament={currentTournament}
            currentMatch={currentMatch}
          />

          <QuickActionsCard
            currentGameState={currentGameState}
            gameStateRoutes={gameStateRoutes}
            changeGameState={(state) => changeGameState(state as GameState)}
            onRoundStart={() => { window.location.href = '/states/game-play' }}
          />
        </div>

        {/* Game State Preview - Linear Layout at Bottom */}
        <GameStateNavigationBar
          currentGameState={currentGameState}
          gameStateNames={gameStateNames}
          gameStateRoutes={gameStateRoutes}
          changeGameState={(state) => changeGameState(state as GameState)}
        />
      </div>

      {/* All the existing dialogs remain the same... */}
      {/* Tournament Creation Dialog */}
      <Dialog open={showTournamentDialog} onOpenChange={setShowTournamentDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Tournament</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="setup">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="setup" className="data-[state=active]:bg-blue-600">
                Tournament Setup
              </TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-blue-600">
                Teams ({tournamentTeams.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <div>
                <Label className="text-gray-300">Tournament Name</Label>
                <Input
                  value={tournamentForm.name}
                  onChange={(e) => setTournamentForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter tournament name"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Tournament Mode</Label>
                <Select
                  value={tournamentForm.mode}
                  onValueChange={(value) => setTournamentForm((prev) => ({ ...prev, mode: value }))}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {tournamentModes.map((mode) => (
                      <SelectItem key={mode.id} value={mode.id} className="text-white hover:bg-gray-700">
                        <div>
                          <div className="font-medium">{mode.name}</div>
                          <div className="text-sm text-gray-400">{mode.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="teams" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">Tournament Teams</h4>
                <Button size="sm" onClick={addTournamentTeam} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Team
                </Button>
              </div>

              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {tournamentTeams.map((team, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor})`,
                          }}
                        >
                          {team.iconUrl ? (
                            <img src={team.iconUrl || "/placeholder.svg"} alt="Team Icon" className="w-6 h-6 rounded" />
                          ) : (
                            React.createElement(getTeamIcon(team.icon), { className: "w-5 h-5 text-white" })
                          )}
                        </div>
                        <Input
                          value={team.name}
                          onChange={(e) => updateTournamentTeam(index, { name: e.target.value })}
                          className="flex-1 bg-gray-700 border-gray-600 text-white"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeTournamentTeam(index)}
                          disabled={tournamentTeams.length <= 2}
                          className="text-gray-400 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-gray-400 text-xs">Primary Color</Label>
                          <Input
                            type="color"
                            value={team.primaryColor}
                            onChange={(e) => updateTournamentTeam(index, { primaryColor: e.target.value })}
                            className="h-8 bg-gray-700 border-gray-600"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs">Secondary Color</Label>
                          <Input
                            type="color"
                            value={team.secondaryColor}
                            onChange={(e) => updateTournamentTeam(index, { secondaryColor: e.target.value })}
                            className="h-8 bg-gray-700 border-gray-600"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <Label className="text-gray-400 text-xs">Team Motto</Label>
                        <Input
                          value={team.motto || ""}
                          onChange={(e) => updateTournamentTeam(index, { motto: e.target.value })}
                          placeholder="Enter team motto"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement("input")
                            input.type = "file"
                            input.accept = "image/*"
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0]
                              if (file) handleImageUpload(file, index, "icon")
                            }
                            input.click()
                          }}
                          disabled={uploadingImage}
                          className="border-gray-700 text-white hover:bg-gray-800"
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          {uploadingImage ? "Uploading..." : "Upload Icon"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement("input")
                            input.type = "file"
                            input.accept = "image/*"
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0]
                              if (file) handleImageUpload(file, index, "logo")
                            }
                            input.click()
                          }}
                          disabled={uploadingImage}
                          className="border-gray-700 text-white hover:bg-gray-800"
                        >
                          <ImageIcon className="w-4 h-4 mr-1" />
                          {uploadingImage ? "Uploading..." : "Upload Logo"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-4">
                <Button
                  onClick={createTournament}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={tournamentTeams.length < 2 || !tournamentForm.name.trim()}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Create Tournament
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTournamentDialog(false)}
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Team Customization Dialog */}
      <Dialog open={showTeamCustomization} onOpenChange={setShowTeamCustomization}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Team Customization</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {tournamentTeams.map((team, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Team {index + 1}</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Team Name</Label>
                      <Input
                        value={team.name}
                        onChange={(e) => updateTournamentTeam(index, { name: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Team Motto</Label>
                      <Input
                        value={team.motto || ""}
                        onChange={(e) => updateTournamentTeam(index, { motto: e.target.value })}
                        placeholder="Enter team motto"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-gray-300">Primary Color</Label>
                        <Input
                          type="color"
                          value={team.primaryColor}
                          onChange={(e) => updateTournamentTeam(index, { primaryColor: e.target.value })}
                          className="h-10 bg-gray-700 border-gray-600"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Secondary Color</Label>
                        <Input
                          type="color"
                          value={team.secondaryColor}
                          onChange={(e) => updateTournamentTeam(index, { secondaryColor: e.target.value })}
                          className="h-10 bg-gray-700 border-gray-600"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement("input")
                          input.type = "file"
                          input.accept = "image/*"
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) handleImageUpload(file, index, "icon")
                          }
                          input.click()
                        }}
                        disabled={uploadingImage}
                        className="border-gray-700 text-white hover:bg-gray-800 bg-slate-600"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Icon
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement("input")
                          input.type = "file"
                          input.accept = "image/*"
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) handleImageUpload(file, index, "logo")
                          }
                          input.click()
                        }}
                        disabled={uploadingImage}
                        className="border-gray-700 text-white hover:bg-gray-800 bg-slate-600"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Preview</Label>
                      <div
                        className="p-6 rounded-lg text-white text-center"
                        style={{
                          background: `linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor})`,
                        }}
                      >
                        <div className="flex items-center justify-center gap-3 mb-3">
                          {team.iconUrl ? (
                            <img src={team.iconUrl || "/placeholder.svg"} alt="Team Icon" className="w-8 h-8 rounded" />
                          ) : (
                            React.createElement(getTeamIcon(team.icon), { className: "w-8 h-8 text-white" })
                          )}
                          {team.logo && (
                            <img src={team.logo || "/placeholder.svg"} alt="Team Logo" className="w-8 h-8 rounded" />
                          )}
                        </div>
                        <h4 className="text-xl font-bold">{team.name}</h4>
                        {team.motto && <p className="text-sm opacity-90 mt-1">"{team.motto}"</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Match Questions Dialog */}
      <Dialog open={showMatchQuestions} onOpenChange={setShowMatchQuestions}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-6xl">
          <DialogHeader>
            <DialogTitle>Match Questions Management</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {currentTournament?.matches.map((match, matchIndex) => (
              <div key={match.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Match {matchIndex + 1}: {match.team1Id} vs {match.team2Id}
                  </h3>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (match.questions.length === 0) {
                        createMatchQuestions(match.id)
                      }
                      setSelectedMatchForQuestions(match)
                      setShowQuestionDialog(true)
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {match.questions.length === 0 ? "Create Questions" : "Edit Questions"}
                  </Button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, "tiebreaker"].map((round) => (
                    <div key={round} className="p-3 bg-gray-700 rounded-lg text-center">
                      <div className="text-sm text-gray-400 mb-1">Round {round}</div>
                      <div className="text-xs text-gray-500">
                        {match.questions.find((q) => q.round === round)?.question ? (
                          <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-600 mx-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Question Dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? `Edit Question - Round ${editingQuestion.round}` : "Create Questions"}
            </DialogTitle>
          </DialogHeader>

          {selectedMatchForQuestions && (
            <div className="space-y-6">
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-white">
                  {selectedMatchForQuestions.team1Id} vs {selectedMatchForQuestions.team2Id}
                </h3>
              </div>

              <Tabs defaultValue="1">
                <TabsList className="grid w-full grid-cols-5 bg-gray-800">
                  {[1, 2, 3, 4, "tiebreaker"].map((round) => (
                    <TabsTrigger key={round} value={round.toString()} className="data-[state=active]:bg-blue-600">
                      Round {round}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {[1, 2, 3, 4, "tiebreaker"].map((round) => (
                  <TabsContent key={round} value={round.toString()} className="space-y-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-300">Question</Label>
                          <Textarea
                            value={selectedMatchForQuestions.questions.find((q) => q.round === round)?.question || ""}
                            onChange={(e) => {
                              updateQuestionInTournament(
                                selectedMatchForQuestions.id,
                                round as any,
                                "question",
                                e.target.value,
                              )
                            }}
                            placeholder={`Enter question for Round ${round}...`}
                            className="bg-gray-700 border-gray-600 text-white"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300">Answers</Label>
                          <div className="space-y-2">
                            {(
                              selectedMatchForQuestions.questions.find((q) => q.round === round)?.answers || [
                                { text: "", points: 0 },
                              ]
                            ).map((answer, answerIndex) => (
                              <div key={answerIndex} className="flex gap-2">
                                <Input
                                  value={answer.text}
                                  onChange={(e) => {
                                    const currentAnswers = selectedMatchForQuestions.questions.find(
                                      (q) => q.round === round,
                                    )?.answers || [{ text: "", points: 0 }]
                                    const updatedAnswers = [...currentAnswers]
                                    updatedAnswers[answerIndex] = {
                                      ...updatedAnswers[answerIndex],
                                      text: e.target.value,
                                    }
                                    updateQuestionInTournament(
                                      selectedMatchForQuestions.id,
                                      round as any,
                                      "answers",
                                      updatedAnswers,
                                    )
                                  }}
                                  placeholder={`Answer ${answerIndex + 1}`}
                                  className="flex-1 bg-gray-700 border-gray-600 text-white"
                                />
                                <Input
                                  type="number"
                                  value={answer.points}
                                  onChange={(e) => {
                                    const currentAnswers = selectedMatchForQuestions.questions.find(
                                      (q) => q.round === round,
                                    )?.answers || [{ text: "", points: 0 }]
                                    const updatedAnswers = [...currentAnswers]
                                    updatedAnswers[answerIndex] = {
                                      ...updatedAnswers[answerIndex],
                                      points: Number.parseInt(e.target.value) || 0,
                                    }
                                    updateQuestionInTournament(
                                      selectedMatchForQuestions.id,
                                      round as any,
                                      "answers",
                                      updatedAnswers,
                                    )
                                  }}
                                  placeholder="Points"
                                  className="w-20 bg-gray-700 border-gray-600 text-white"
                                />
                                {(selectedMatchForQuestions.questions.find((q) => q.round === round)?.answers?.length ||
                                  0) > 1 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      const currentAnswers =
                                        selectedMatchForQuestions.questions.find((q) => q.round === round)?.answers ||
                                        []
                                      const updatedAnswers = currentAnswers.filter((_, i) => i !== answerIndex)
                                      updateQuestionInTournament(
                                        selectedMatchForQuestions.id,
                                        round as any,
                                        "answers",
                                        updatedAnswers,
                                      )
                                    }}
                                    className="text-gray-400 hover:text-white"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const currentAnswers =
                                selectedMatchForQuestions.questions.find((q) => q.round === round)?.answers || []
                              const updatedAnswers = [...currentAnswers, { text: "", points: 0 }]
                              updateQuestionInTournament(
                                selectedMatchForQuestions.id,
                                round as any,
                                "answers",
                                updatedAnswers,
                              )
                            }}
                            className="mt-2 border-gray-700 text-white hover:bg-gray-800 bg-slate-600"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Answer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowQuestionDialog(false)
                    setSelectedMatchForQuestions(null)
                    setEditingQuestion(null)
                  }}
                  className="border-gray-700 text-white hover:bg-gray-800 bg-slate-600"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowQuestionDialog(false)
                    setSelectedMatchForQuestions(null)
                    setEditingQuestion(null)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Questions
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
