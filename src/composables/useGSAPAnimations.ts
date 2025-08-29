import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Enregistrer le plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

export function useGSAPAnimations() {
  const isInitialized = ref(false)
  const animations = ref<gsap.core.Timeline[]>([])

  // Animation d'entrée sophistiquée pour les éléments
  const animateIn = (element: HTMLElement | string, options: {
    delay?: number
    duration?: number
    y?: number
    x?: number
    scale?: number
    rotation?: number
    opacity?: number
    ease?: string
    stagger?: number
  } = {}) => {
    const defaults = {
      delay: 0,
      duration: 1.2,
      y: 60,
      x: 0,
      scale: 1,
      rotation: 0,
      opacity: 0,
      ease: 'power3.out',
      stagger: 0.1
    }

    const config = { ...defaults, ...options }

    return gsap.fromTo(element, 
      {
        y: config.y,
        x: config.x,
        scale: config.scale === 1 ? 0.8 : config.scale,
        rotation: config.rotation,
        opacity: config.opacity
      },
      {
        y: 0,
        x: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: config.duration,
        delay: config.delay,
        ease: config.ease,
        stagger: config.stagger
      }
    )
  }

  // Animation de révélation de texte sophistiquée
  const animateText = (element: HTMLElement | string, options: {
    splitType?: 'chars' | 'words' | 'lines'
    stagger?: number
    duration?: number
    ease?: string
    delay?: number
  } = {}) => {
    const defaults = {
      splitType: 'chars' as const,
      stagger: 0.03,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0
    }

    const config = { ...defaults, ...options }
    const el = typeof element === 'string' ? document.querySelector(element) : element
    
    if (!el) return

    // Diviser le texte en caractères/mots
    const text = el.textContent || ''
    const splitText = config.splitType === 'chars' ? text.split('') : text.split(' ')
    
    el.innerHTML = splitText.map((char, i) => 
      `<span style="display: inline-block; opacity: 0; transform: translateY(50px);">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('')

    const spans = el.querySelectorAll('span')
    
    return gsap.to(spans, {
      opacity: 1,
      y: 0,
      duration: config.duration,
      ease: config.ease,
      stagger: config.stagger,
      delay: config.delay
    })
  }

  // Animation avec ScrollTrigger
  const animateOnScroll = (element: HTMLElement | string, animation: gsap.TweenVars, options: {
    trigger?: string | HTMLElement
    start?: string
    end?: string
    scrub?: boolean | number
    pin?: boolean
    markers?: boolean
    onEnter?: () => void
    onLeave?: () => void
  } = {}) => {
    const defaults = {
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: false,
      pin: false,
      markers: false
    }

    const config = { ...defaults, ...options }
    const trigger = config.trigger || element

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: config.start,
        end: config.end,
        scrub: config.scrub,
        pin: config.pin,
        markers: config.markers,
        onEnter: config.onEnter,
        onLeave: config.onLeave
      }
    })

    tl.to(element, animation)
    animations.value.push(tl)
    
    return tl
  }

  // Animation de parallaxe
  const parallaxEffect = (element: HTMLElement | string, speed: number = 0.5) => {
    return animateOnScroll(element, {
      y: (i, target) => -ScrollTrigger.maxScroll(window) * speed,
      ease: 'none'
    }, {
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    })
  }

  // Animation de morphing/transformation
  const morphEffect = (element: HTMLElement | string, options: {
    scale?: number
    rotation?: number
    skew?: number
    duration?: number
    ease?: string
  } = {}) => {
    const defaults = {
      scale: 1.1,
      rotation: 5,
      skew: 2,
      duration: 1.5,
      ease: 'power2.inOut'
    }

    const config = { ...defaults, ...options }

    return animateOnScroll(element, {
      scale: config.scale,
      rotation: config.rotation,
      skew: config.skew,
      duration: config.duration,
      ease: config.ease,
      yoyo: true,
      repeat: -1
    })
  }

  // Animation de glow pulsant
  const glowPulse = (element: HTMLElement | string, options: {
    intensity?: number
    duration?: number
    color?: string
  } = {}) => {
    const defaults = {
      intensity: 20,
      duration: 2,
      color: '#DD305C'
    }

    const config = { ...defaults, ...options }

    return gsap.to(element, {
      filter: `drop-shadow(0 0 ${config.intensity}px ${config.color})`,
      duration: config.duration,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    })
  }

  // Animation de révélation en cascade
  const cascadeReveal = (elements: HTMLElement[] | NodeList | string, options: {
    stagger?: number
    duration?: number
    direction?: 'up' | 'down' | 'left' | 'right'
    distance?: number
  } = {}) => {
    const defaults = {
      stagger: 0.2,
      duration: 1,
      direction: 'up' as const,
      distance: 50
    }

    const config = { ...defaults, ...options }
    
    const getTransform = () => {
      switch (config.direction) {
        case 'up': return { y: config.distance }
        case 'down': return { y: -config.distance }
        case 'left': return { x: config.distance }
        case 'right': return { x: -config.distance }
        default: return { y: config.distance }
      }
    }

    const transform = getTransform()

    return gsap.fromTo(elements, 
      { ...transform, opacity: 0 },
      {
        ...Object.keys(transform).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
        opacity: 1,
        duration: config.duration,
        stagger: config.stagger,
        ease: 'power3.out'
      }
    )
  }

  // Nettoyage des animations
  const cleanup = () => {
    animations.value.forEach(animation => {
      animation.kill()
    })
    animations.value = []
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }

  // Rafraîchir ScrollTrigger (utile après des changements de layout)
  const refresh = () => {
    ScrollTrigger.refresh()
  }

  onMounted(() => {
    isInitialized.value = true
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    isInitialized,
    animateIn,
    animateText,
    animateOnScroll,
    parallaxEffect,
    morphEffect,
    glowPulse,
    cascadeReveal,
    cleanup,
    refresh
  }
}

// Utilitaires pour les animations prédéfinies
export const ANIMATION_PRESETS = {
  fadeInUp: { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out' },
  fadeInDown: { y: -60, opacity: 0, duration: 1.2, ease: 'power3.out' },
  fadeInLeft: { x: -60, opacity: 0, duration: 1.2, ease: 'power3.out' },
  fadeInRight: { x: 60, opacity: 0, duration: 1.2, ease: 'power3.out' },
  scaleIn: { scale: 0.8, opacity: 0, duration: 1, ease: 'back.out(1.7)' },
  rotateIn: { rotation: 180, opacity: 0, duration: 1.5, ease: 'power2.out' },
  slideInUp: { y: 100, opacity: 0, duration: 1, ease: 'power4.out' },
  bounceIn: { scale: 0, opacity: 0, duration: 1.2, ease: 'bounce.out' }
}