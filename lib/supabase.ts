import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Account {
  id: string
  email: string
  username: string
  avatar_url?: string
  created_at: string
  updated_at: string
  last_login?: string
  is_active: boolean
}

export interface Tournament {
  id: string
  user_id: string
  name: string
  mode: string
  status: string
  current_match_index: number
  teams: any[]
  matches: any[]
  created_at: string
  updated_at: string
}

export interface GameSession {
  id: string
  user_id: string
  tournament_id?: string
  name: string
  game_state: string
  current_round: number
  team1_score: number
  team2_score: number
  round_score: number
  strikes: number
  session_data: any
  created_at: string
  updated_at: string
}

// Auth functions
export const signUp = async (email: string, password: string, username: string) => {
  try {
    // First check if username already exists
    const { data: existingUser } = await supabase.from("accounts").select("username").eq("username", username).single()

    if (existingUser) {
      return { data: null, error: { message: "Username already exists" } }
    }

    // Hash password (in production, use proper password hashing)
    const passwordHash = btoa(password) // Simple base64 encoding for demo

    // Insert into accounts table
    const { data, error } = await supabase
      .from("accounts")
      .insert([
        {
          email,
          username,
          password_hash: passwordHash,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    // Hash password for comparison
    const passwordHash = btoa(password)

    // Find user by email and password
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("email", email)
      .eq("password_hash", passwordHash)
      .eq("is_active", true)
      .single()

    if (error || !data) {
      return { data: null, error: { message: "Invalid email or password" } }
    }

    // Update last login
    await supabase.from("accounts").update({ last_login: new Date().toISOString() }).eq("id", data.id)

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Tournament functions
export const createTournament = async (userId: string, tournamentData: Partial<Tournament>) => {
  try {
    const { data, error } = await supabase
      .from("tournaments")
      .insert([
        {
          user_id: userId,
          ...tournamentData,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const getTournaments = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const updateTournament = async (tournamentId: string, updates: Partial<Tournament>) => {
  try {
    const { data, error } = await supabase.from("tournaments").update(updates).eq("id", tournamentId).select().single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Game session functions
export const createGameSession = async (userId: string, sessionData: Partial<GameSession>) => {
  try {
    const { data, error } = await supabase
      .from("game_sessions")
      .insert([
        {
          user_id: userId,
          ...sessionData,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const getGameSessions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("game_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const updateGameSession = async (sessionId: string, updates: Partial<GameSession>) => {
  try {
    const { data, error } = await supabase.from("game_sessions").update(updates).eq("id", sessionId).select().single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Upload image to Supabase Storage
export const uploadImage = async (file: File, bucket: string, path: string) => {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path)

    return { url: publicUrl, error: null }
  } catch (error) {
    return { url: null, error }
  }
}

// Delete image from Supabase Storage
export const deleteImage = async (bucket: string, path: string) => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])
    return { error }
  } catch (error) {
    return { error }
  }
}
