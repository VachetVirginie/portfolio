import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Enregistrer le plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

/**
 * Composable pour gérer les animations au scroll avancées
 * Inclut parallaxe, reveal effects, et indicateurs de progression
 */
export function useScrollAnimations() {
  const scrollProgress = ref(0)
  const isScrolling = ref(false)
  const scrollDirection = ref<'up' | 'down'>('down')
  const lastScrollY = ref(0)
  
  let scrollTimeout: number | undefined
  let progressBar: HTMLElement | null = null

  // Créer un indicateur de progression de scroll
  const createProgressIndicator = () => {
    const indicator = document.createElement('div')
    indicator.className = 'scroll-progress-indicator'
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, var(--color-primary, #007bff), var(--color-secondary, #6c757d));
      z-index: 9999;
      transition: opacity 0.3s ease;
      opacity: 0;
    `
    
    document.body.appendChild(indicator)
    progressBar = indicator
    
    return indicator
  }

  // Mettre à jour la progression du scroll
  const updateScrollProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = Math.min(scrollTop / scrollHeight, 1)
    
    scrollProgress.value = progress
    
    if (progressBar) {
      gsap.to(progressBar, {
        width: `${progress * 100}%`,
        duration: 0.1,
        ease: 'none'
      })
      
      // Afficher/masquer l'indicateur
      if (progress > 0.05 && progress < 0.95) {
        gsap.to(progressBar, { opacity: 1, duration: 0.3 })
      } else {
        gsap.to(progressBar, { opacity: 0, duration: 0.3 })
      }
    }
  }

  // Détecter la direction du scroll
  const updateScrollDirection = () => {
    const currentScrollY = window.pageYOffset
    
    if (currentScrollY > lastScrollY.value) {
      scrollDirection.value = 'down'
    } else if (currentScrollY < lastScrollY.value) {
      scrollDirection.value = 'up'
    }
    
    lastScrollY.value = currentScrollY
  }

  // Gérer l'état de scroll
  const handleScroll = () => {
    isScrolling.value = true
    updateScrollProgress()
    updateScrollDirection()
    
    // Réinitialiser le timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
    
    scrollTimeout = setTimeout(() => {
      isScrolling.value = false
    }, 150)
  }

  // Animation de révélation au scroll
  const createRevealAnimation = (element: HTMLElement, options: {
    direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
    distance?: number
    duration?: number
    delay?: number
    trigger?: string
    start?: string
    end?: string
  } = {}) => {
    const {
      direction = 'up',
      distance = 50,
      duration = 1,
      delay = 0,
      trigger = element,
      start = 'top 80%',
      end = 'bottom 20%'
    } = options

    // Configuration initiale basée sur la direction
    const initialState: any = { opacity: 0 }
    const finalState: any = { opacity: 1 }

    switch (direction) {
      case 'up':
        initialState.y = distance
        finalState.y = 0
        break
      case 'down':
        initialState.y = -distance
        finalState.y = 0
        break
      case 'left':
        initialState.x = distance
        finalState.x = 0
        break
      case 'right':
        initialState.x = -distance
        finalState.x = 0
        break
      case 'fade':
        // Seulement l'opacité
        break
    }

    // Appliquer l'état initial
    gsap.set(element, initialState)

    // Créer l'animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start,
        end,
        toggleActions: 'play none none reverse'
      }
    })

    tl.to(element, {
      ...finalState,
      duration,
      delay,
      ease: 'power2.out'
    })

    return tl
  }

  // Animation de parallaxe
  const createParallaxAnimation = (element: HTMLElement, options: {
    speed?: number
    direction?: 'vertical' | 'horizontal'
    trigger?: string
    start?: string
    end?: string
  } = {}) => {
    const {
      speed = 0.5,
      direction = 'vertical',
      trigger = element,
      start = 'top bottom',
      end = 'bottom top'
    } = options

    const property = direction === 'vertical' ? 'yPercent' : 'xPercent'
    const distance = direction === 'vertical' ? -100 * speed : -100 * speed

    gsap.to(element, {
      [property]: distance,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub: true
      }
    })
  }

  // Animation de texte qui se révèle lettre par lettre
  const createTextRevealAnimation = (element: HTMLElement, options: {
    duration?: number
    stagger?: number
    trigger?: string
    start?: string
  } = {}) => {
    const {
      duration = 0.05,
      stagger = 0.02,
      trigger = element,
      start = 'top 80%'
    } = options

    // Diviser le texte en spans pour chaque caractère
    const text = element.textContent || ''
    element.innerHTML = text
      .split('')
      .map(char => char === ' ' ? ' ' : `<span style="display: inline-block; opacity: 0; transform: translateY(20px);">${char}</span>`)
      .join('')

    const chars = element.querySelectorAll('span')

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger,
        start,
        toggleActions: 'play none none reverse'
      }
    })
  }

  // Animation de compteur numérique
  const createCounterAnimation = (element: HTMLElement, options: {
    from?: number
    to?: number
    duration?: number
    trigger?: string
    start?: string
  } = {}) => {
    const {
      from = 0,
      to = parseInt(element.textContent || '0'),
      duration = 2,
      trigger = element,
      start = 'top 80%'
    } = options

    const counter = { value: from }

    gsap.to(counter, {
      value: to,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = Math.round(counter.value).toString()
      },
      scrollTrigger: {
        trigger,
        start,
        toggleActions: 'play none none reverse'
      }
    })
  }

  // Animation de morphing de formes SVG
  const createMorphAnimation = (element: SVGPathElement, options: {
    paths: string[]
    duration?: number
    trigger?: string
    start?: string
  }) => {
    const {
      paths,
      duration = 1,
      trigger = element,
      start = 'top 80%'
    } = options

    if (paths.length < 2) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start,
        end: 'bottom 20%',
        scrub: 1
      }
    })

    paths.forEach((path, index) => {
      if (index === 0) return // Skip first path (initial state)
      
      tl.to(element, {
        attr: { d: path },
        duration,
        ease: 'power2.inOut'
      })
    })

    return tl
  }

  // Animation de particules au scroll
  const createParticleAnimation = (container: HTMLElement, options: {
    count?: number
    size?: number
    color?: string
    speed?: number
  } = {}) => {
    const {
      count = 20,
      size = 4,
      color = 'var(--color-primary, #007bff)',
      speed = 0.5
    } = options

    const particles: HTMLElement[] = []

    // Créer les particules
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.7;
      `
      
      // Position aléatoire
      const x = Math.random() * container.offsetWidth
      const y = Math.random() * container.offsetHeight
      
      gsap.set(particle, { x, y })
      container.appendChild(particle)
      particles.push(particle)
    }

    // Animer les particules au scroll
    particles.forEach((particle, index) => {
      gsap.to(particle, {
        y: `-=${Math.random() * 200 + 100}`,
        x: `+=${(Math.random() - 0.5) * 100}`,
        opacity: 0,
        scale: Math.random() * 0.5 + 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: speed + Math.random() * 0.5
        }
      })
    })

    return particles
  }

  // Initialiser les animations de scroll
  const initScrollAnimations = () => {
    // Vérifier si l'utilisateur préfère les animations réduites
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    createProgressIndicator()
    
    // Ajouter les event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Rafraîchir ScrollTrigger après initialisation
    nextTick(() => {
      ScrollTrigger.refresh()
    })
  }

  // Nettoyer les animations
  const cleanup = () => {
    window.removeEventListener('scroll', handleScroll)
    
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
    
    // Supprimer l'indicateur de progression
    progressBar?.remove()
    
    // Tuer toutes les animations ScrollTrigger
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }

  onMounted(() => {
    initScrollAnimations()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    // État
    scrollProgress,
    isScrolling,
    scrollDirection,
    
    // Méthodes d'animation
    createRevealAnimation,
    createParallaxAnimation,
    createTextRevealAnimation,
    createCounterAnimation,
    createMorphAnimation,
    createParticleAnimation,
    
    // Utilitaires
    updateScrollProgress,
    initScrollAnimations,
    cleanup
  }
}

/**
 * Directive Vue pour les animations de révélation au scroll
 */
export const vScrollReveal = {
  mounted(el: HTMLElement, binding: any) {
    const { createRevealAnimation } = useScrollAnimations()
    createRevealAnimation(el, binding.value || {})
  }
}

/**
 * Directive Vue pour les animations de parallaxe
 */
export const vParallax = {
  mounted(el: HTMLElement, binding: any) {
    const { createParallaxAnimation } = useScrollAnimations()
    createParallaxAnimation(el, binding.value || {})
  }
}