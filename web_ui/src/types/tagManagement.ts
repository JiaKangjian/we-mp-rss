<<<<<<< HEAD
export interface Tag {
  id: string
  name: string
  cover?: string | null
  intro?: string | null
  status: number
  created_at: string
  updated_at: string
}

export interface TagCreate {
  name: string
  cover?: string | null
  intro?: string | null
  status?: number
=======
export interface Tag {
  id: string
  name: string
  cover?: string | null
  intro?: string | null
  status: number
  created_at: string
  updated_at: string
}

export interface TagCreate {
  name: string
  cover?: string | null
  intro?: string | null
  status?: number
>>>>>>> cf8b407bc0234127992336de96980c6c65f8f72b
}