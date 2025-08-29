// Types pour le portfolio
export interface Experience {
  id: string
  position: string
  company: string
  period: string
  description: string
  technologies: string[]
  achievements?: string[]
  current?: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  category: string
  year: number
  demoUrl?: string
  githubUrl?: string
  featured: boolean
}

export interface Skill {
  name: string
  category: 'frontend' | 'backend' | 'tools' | 'database'
  level: number
  icon?: string
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export interface PersonalInfo {
  name: string
  title: string
  description: string
  location: string
  email: string
  socialLinks: SocialLink[]
}