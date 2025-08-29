import type { Experience, Project, Skill, PersonalInfo } from '@/types'

export const personalInfo: PersonalInfo = {
  name: 'Virginie Vachet',
  title: 'Développeuse Frontend',
  description: "Développeuse web frontend passionnée, vivant à Lyon. Je me spécialise dans la création d'expériences utilisateur modernes et intuitives avec les dernières technologies web.",
  location: 'Lyon',
  email: 'contact@vachetvirginie.fr',
  socialLinks: [
    {
      name: 'GitHub',
      url: 'https://github.com/VachetVirginie',
      icon: 'github'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/vachetvirginie/',
      icon: 'linkedin'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/VirginieVachet',
      icon: 'twitter'
    }
  ]
}

export const experiences: Experience[] = [
  {
    id: '1',
    position: 'Développeuse Frontend',
    company: 'Caisse Nationale de l\'Assurance Maladie (Conserto)',
    period: 'Jan 2024 - Présent',
    description: 'Intégration de l\'équipe de développeurs dédiée au design system de la Caisse Nationale de l\'Assurance Maladie.',
    technologies: ['Vue.js 2/3', 'Vuetify', 'TypeScript', 'Design System', 'Storybook', 'Nuxt', 'RGAA', 'RGESN' ],
    achievements: [
      'Développement et maintenance du design system institutionnel',
      'Création de composants réutilisables pour les équipes métier',
      'Amélioration de la cohérence visuelle des applications'
    ],
    current: true
  },
  {
    id: '2',
    position: 'Développeuse Web Frontend & Backend',
    company: 'Ngtv Experience',
    period: 'Oct 2019 - Jan 2024',
    description: 'Développement d\'interfaces tactiles et d\'espaces d\'administration pour la vidéo intelligente au service du sport.',
    technologies: ['Vue.js 2/3', 'Nuxt', 'Vuetify', 'PrimeVUE', 'TailwindCSS', 'Symfony', 'API Platform'],
    achievements: [
      'Développement d\'interfaces tactiles en Nuxt/Vue.js avec Vuetify',
      'Création d\'espaces d\'administration clients en Vue.js 3/PrimeVUE',
      'Développement d\'un outil de live streaming avec OBS/OBS-websocket',
      'Participation au développement API en Symfony 4/5'
    ]
  },
  {
    id: '3',
    position: 'Développeuse JavaScript',
    company: 'Cegedim SRH',
    period: 'Déc 2018 - Oct 2019',
    description: 'Développement de solutions RH avec la plateforme TEAMSRH pour l\'externalisation des systèmes paie et RH.',
    technologies: ['JavaScript', 'TEAMSRH', 'Jira'],
    achievements: [
      'Élaboration d\'analyses fonctionnelles et techniques',
      'Développement de solutions spécifiques selon les besoins clients',
      'Réalisation de tests unitaires et intégration de solutions'
    ]
  },
  {
    id: '4',
    position: 'Développeuse Backend (Alternance)',
    company: 'Orange',
    period: 'Déc 2017 - Déc 2018',
    description: 'Alternance au sein de la DSI Orange, développement backend et participation aux projets d\'infrastructure.',
    technologies: ['PHP', 'jQuery', 'Zend Framework 1', 'SVN'],
    achievements: [
      'Validation de solutions techniques à partir d\'analyses fonctionnelles',
      'Développement et paramétrage de solutions spécifiques',
      'Participation à l\'intégration et aux tests de solutions'
    ]
  }
]

export const skills: Skill[] = [
  // Frontend
  { name: 'JavaScript', category: 'frontend', level: 95 },
  { name: 'TypeScript', category: 'frontend', level: 90 },
  { name: 'React', category: 'frontend', level: 95 },
  { name: 'Next.js', category: 'frontend', level: 85 },
  { name: 'Redux', category: 'frontend', level: 80 },
  { name: 'TailwindCSS', category: 'frontend', level: 90 },
  { name: 'GSAP', category: 'frontend', level: 75 },
  { name: 'Framer Motion', category: 'frontend', level: 70 },
  { name: 'Sass', category: 'frontend', level: 85 },
  { name: 'Bootstrap', category: 'frontend', level: 80 },
  
  // Backend
  { name: 'Node.js', category: 'backend', level: 80 },
  { name: 'NestJS', category: 'backend', level: 75 },
  { name: 'Express.js', category: 'backend', level: 85 },
  
  // Database
  { name: 'MySQL', category: 'database', level: 70 },
  { name: 'PostgreSQL', category: 'database', level: 75 },
  { name: 'MongoDB', category: 'database', level: 80 },
  { name: 'Prisma', category: 'database', level: 70 },
  
  // Tools
  { name: 'Git', category: 'tools', level: 90 },
  { name: 'Docker', category: 'tools', level: 65 },
  { name: 'AWS', category: 'tools', level: 60 }
]

export const projects: Project[] = [
  {
    id: '1',
    title: 'Plateforme E-commerce',
    description: 'Plateforme e-commerce moderne avec fonctionnalités avancées incluant gestion d\'inventaire en temps réel, traitement des paiements et tableau de bord administrateur.',
    technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Stripe', 'Pinia'],
    category: 'web',
    year: 2024,
    featured: true,
    image: '/projects/ecommerce.jpg',
    githubUrl: 'https://github.com/VirginieVachet/ecommerce-platform',
    demoUrl: 'https://ecommerce-demo.vachetvirginie.fr'
  },
  {
    id: '2',
    title: 'Application de Gestion de Tâches',
    description: 'Application collaborative de gestion de tâches avec mises à jour en temps réel, fonctionnalités de collaboration d\'équipe et analyses avancées.',
    technologies: ['Vue.js', 'TypeScript', 'Socket.io', 'PostgreSQL'],
    category: 'web',
    year: 2024,
    featured: true,
    image: '/projects/task-manager.jpg',
    githubUrl: 'https://github.com/VirginieVachet/task-manager',
    demoUrl: 'https://tasks.vachetvirginie.fr'
  },
  {
    id: '3',
    title: 'Site Portfolio',
    description: 'Site portfolio personnel présentant projets et compétences avec animations modernes et design responsive.',
    technologies: ['Nuxt.js', 'TypeScript', 'GSAP', 'TailwindCSS'],
    category: 'portfolio',
    year: 2024,
    featured: true,
    image: '/projects/portfolio.jpg',
    githubUrl: 'https://github.com/VirginieVachet/portfolio-2.0',
    demoUrl: 'https://vachetvirginie.fr'
  },
  {
    id: '4',
    title: 'Tableau de Bord Météo',
    description: 'Tableau de bord météo en temps réel avec cartes interactives, prévisions et alertes météo géolocalisées.',
    technologies: ['Vue.js', 'Chart.js', 'OpenWeather API', 'Mapbox'],
    category: 'web',
    year: 2023,
    featured: false,
    image: '/projects/weather.jpg',
    githubUrl: 'https://github.com/VirginieVachet/weather-dashboard'
  },
  {
    id: '5',
    title: 'CMS de Blog',
    description: 'Système de gestion de contenu pour blogs avec support Markdown, optimisation SEO et analyses.',
    technologies: ['Nuxt.js', 'Prisma', 'PostgreSQL', 'TailwindCSS'],
    category: 'cms',
    year: 2023,
    featured: false,
    image: '/projects/blog-cms.jpg',
    githubUrl: 'https://github.com/VirginieVachet/blog-cms'
  },
  {
    id: '6',
    title: 'Application de Chat',
    description: 'Application de chat en temps réel avec messagerie de groupe, partage de fichiers et intégration d\'appels vidéo.',
    technologies: ['Vue.js', 'Socket.io', 'Node.js', 'WebRTC'],
    category: 'web',
    year: 2023,
    featured: false,
    image: '/projects/chat-app.jpg',
    githubUrl: 'https://github.com/VirginieVachet/chat-app'
  }
]