import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface BackgroundTheme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    gradient: string[]
  }
  particles?: {
    color: string
    count: number
    size: number
  }
  shapes?: {
    type: 'circles' | 'polygons' | 'waves' | 'organic'
    color: string
    opacity: number
  }
}

interface SectionTheme {
  selector: string
  theme: BackgroundTheme
  transition?: {
    duration: number
    ease: string
  }
}

interface UseMorphingBackgroundsOptions {
  container?: string
  sections?: SectionTheme[]
  defaultTheme?: BackgroundTheme
  transitionDuration?: number
  enableParticles?: boolean
  enableShapes?: boolean
}

const defaultThemes: BackgroundTheme[] = [
  {
    id: 'hero',
    name: 'Hero Cosmic',
    colors: {
      primary: '#0a0a0a',
      secondary: '#1a1a2e',
      accent: '#00ff88',
      gradient: ['#0a0a0a', '#1a1a2e', '#16213e']
    },
    particles: {
      color: '#00ff88',
      count: 50,
      size: 2
    },
    shapes: {
      type: 'circles',
      color: '#00ff88',
      opacity: 0.1
    }
  },
  {
    id: 'about',
    name: 'About Warm',
    colors: {
      primary: '#2d1b69',
      secondary: '#11998e',
      accent: '#38ef7d',
      gradient: ['#2d1b69', '#11998e', '#38ef7d']
    },
    particles: {
      color: '#38ef7d',
      count: 30,
      size: 3
    },
    shapes: {
      type: 'waves',
      color: '#38ef7d',
      opacity: 0.15
    }
  },
  {
    id: 'experience',
    name: 'Experience Professional',
    colors: {
      primary: '#1e3c72',
      secondary: '#2a5298',
      accent: '#74b9ff',
      gradient: ['#1e3c72', '#2a5298', '#74b9ff']
    },
    particles: {
      color: '#74b9ff',
      count: 40,
      size: 2.5
    },
    shapes: {
      type: 'polygons',
      color: '#74b9ff',
      opacity: 0.12
    }
  },
  {
    id: 'projects',
    name: 'Projects Creative',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      gradient: ['#667eea', '#764ba2', '#f093fb']
    },
    particles: {
      color: '#f093fb',
      count: 60,
      size: 1.8
    },
    shapes: {
      type: 'organic',
      color: '#f093fb',
      opacity: 0.08
    }
  },
  {
    id: 'contact',
    name: 'Contact Energetic',
    colors: {
      primary: '#ff6b6b',
      secondary: '#ee5a24',
      accent: '#feca57',
      gradient: ['#ff6b6b', '#ee5a24', '#feca57']
    },
    particles: {
      color: '#feca57',
      count: 35,
      size: 2.2
    },
    shapes: {
      type: 'circles',
      color: '#feca57',
      opacity: 0.1
    }
  }
]

export function useMorphingBackgrounds(
  containerRef: Ref<HTMLElement | null>,
  options: UseMorphingBackgroundsOptions = {}
) {
  const {
    sections = [],
    defaultTheme = defaultThemes[0],
    transitionDuration = 1.5,
    enableParticles = true,
    enableShapes = true
  } = options

  // État
  const currentTheme = ref<BackgroundTheme>(defaultTheme)
  const isTransitioning = ref(false)
  const backgroundElements = ref<HTMLElement[]>([])
  const particleElements = ref<HTMLElement[]>([])
  const shapeElements = ref<HTMLElement[]>([])

  // Créer les éléments d'arrière-plan
  const createBackgroundElements = () => {
    if (!containerRef.value) return

    // Container principal
    const bgContainer = document.createElement('div')
    bgContainer.className = 'morphing-background'
    bgContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
      overflow: hidden;
    `

    // Couches de gradient
    for (let i = 0; i < 3; i++) {
      const layer = document.createElement('div')
      layer.className = `bg-layer bg-layer-${i}`
      layer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: ${1 - i * 0.3};
        mix-blend-mode: ${i === 0 ? 'normal' : i === 1 ? 'multiply' : 'overlay'};
        transition: all ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1);
      `
      bgContainer.appendChild(layer)
      backgroundElements.value.push(layer)
    }

    // Particules si activées
    if (enableParticles) {
      const particlesContainer = document.createElement('div')
      particlesContainer.className = 'particles-container'
      particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      `
      bgContainer.appendChild(particlesContainer)
      createParticles(particlesContainer)
    }

    // Formes si activées
    if (enableShapes) {
      const shapesContainer = document.createElement('div')
      shapesContainer.className = 'shapes-container'
      shapesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      `
      bgContainer.appendChild(shapesContainer)
      createShapes(shapesContainer)
    }

    containerRef.value.appendChild(bgContainer)
    applyTheme(currentTheme.value)
  }

  // Créer les particules
  const createParticles = (container: HTMLElement) => {
    const particleCount = currentTheme.value.particles?.count || 50
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'morphing-particle'
      particle.style.cssText = `
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        opacity: ${Math.random() * 0.8 + 0.2};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${(currentTheme.value.particles?.size || 2) + Math.random() * 2}px;
        height: ${(currentTheme.value.particles?.size || 2) + Math.random() * 2}px;
        background: ${currentTheme.value.particles?.color || '#00ff88'};
        box-shadow: 0 0 10px ${currentTheme.value.particles?.color || '#00ff88'};
        transition: all ${transitionDuration}s ease-out;
      `
      
      container.appendChild(particle)
      particleElements.value.push(particle)
      
      // Animation flottante
      gsap.to(particle, {
        y: `+=${Math.random() * 100 - 50}`,
        x: `+=${Math.random() * 100 - 50}`,
        duration: Math.random() * 10 + 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }
  }

  // Créer les formes
  const createShapes = (container: HTMLElement) => {
    const shapeCount = 8
    
    for (let i = 0; i < shapeCount; i++) {
      const shape = document.createElement('div')
      shape.className = 'morphing-shape'
      
      const size = Math.random() * 200 + 100
      const shapeType = currentTheme.value.shapes?.type || 'circles'
      
      let shapeStyles = `
        position: absolute;
        pointer-events: none;
        opacity: ${currentTheme.value.shapes?.opacity || 0.1};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        background: ${currentTheme.value.shapes?.color || '#00ff88'};
        transition: all ${transitionDuration}s ease-out;
      `
      
      switch (shapeType) {
        case 'circles':
          shapeStyles += 'border-radius: 50%;'
          break
        case 'polygons':
          shapeStyles += 'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);'
          break
        case 'waves':
          shapeStyles += 'border-radius: 50% 20% 50% 20%;'
          break
        case 'organic':
          shapeStyles += 'border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;'
          break
      }
      
      shape.style.cssText = shapeStyles
      container.appendChild(shape)
      shapeElements.value.push(shape)
      
      // Animation de rotation et mouvement
      gsap.to(shape, {
        rotation: 360,
        duration: Math.random() * 20 + 10,
        repeat: -1,
        ease: 'none'
      })
      
      gsap.to(shape, {
        y: `+=${Math.random() * 50 - 25}`,
        x: `+=${Math.random() * 50 - 25}`,
        duration: Math.random() * 15 + 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }
  }

  // Appliquer un thème
  const applyTheme = (theme: BackgroundTheme) => {
    if (isTransitioning.value) return
    
    isTransitioning.value = true
    currentTheme.value = theme
    
    // Animer les couches de gradient
    backgroundElements.value.forEach((layer, index) => {
      const gradientColor = theme.colors.gradient[index] || theme.colors.primary
      
      gsap.to(layer, {
        background: `radial-gradient(circle at ${50 + Math.random() * 50}% ${50 + Math.random() * 50}%, ${gradientColor}, transparent)`,
        duration: transitionDuration,
        ease: 'power2.inOut'
      })
    })
    
    // Animer les particules
    if (enableParticles && theme.particles) {
      particleElements.value.forEach(particle => {
        gsap.to(particle, {
          background: theme.particles!.color,
          boxShadow: `0 0 10px ${theme.particles!.color}`,
          duration: transitionDuration,
          ease: 'power2.inOut'
        })
      })
    }
    
    // Animer les formes
    if (enableShapes && theme.shapes) {
      shapeElements.value.forEach(shape => {
        gsap.to(shape, {
          background: theme.shapes!.color,
          opacity: theme.shapes!.opacity,
          duration: transitionDuration,
          ease: 'power2.inOut'
        })
      })
    }
    
    // Mettre à jour les variables CSS
    document.documentElement.style.setProperty('--bg-primary', theme.colors.primary)
    document.documentElement.style.setProperty('--bg-secondary', theme.colors.secondary)
    document.documentElement.style.setProperty('--bg-accent', theme.colors.accent)
    
    setTimeout(() => {
      isTransitioning.value = false
    }, transitionDuration * 1000)
  }

  // Configurer les triggers de scroll
  const setupScrollTriggers = () => {
    const defaultSections: SectionTheme[] = [
      { selector: '.hero', theme: defaultThemes[0] },
      { selector: '.about', theme: defaultThemes[1] },
      { selector: '.experience', theme: defaultThemes[2] },
      { selector: '.projects', theme: defaultThemes[3] },
      { selector: '.contact', theme: defaultThemes[4] }
    ]
    
    const sectionsToUse = sections.length > 0 ? sections : defaultSections
    
    sectionsToUse.forEach(({ selector, theme, transition }) => {
      const element = document.querySelector(selector)
      if (!element) return
      
      ScrollTrigger.create({
        trigger: element,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => applyTheme(theme),
        onEnterBack: () => applyTheme(theme)
      })
    })
  }

  // Nettoyage
  const cleanup = () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    
    const bgContainer = document.querySelector('.morphing-background')
    if (bgContainer) {
      bgContainer.remove()
    }
    
    backgroundElements.value = []
    particleElements.value = []
    shapeElements.value = []
  }

  // Lifecycle
  onMounted(() => {
    createBackgroundElements()
    setupScrollTriggers()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    currentTheme,
    isTransitioning,
    applyTheme,
    cleanup,
    defaultThemes
  }
}