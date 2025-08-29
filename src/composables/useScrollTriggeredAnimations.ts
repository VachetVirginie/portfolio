import { ref, onMounted, onUnmounted, nextTick, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(ScrollTrigger, TextPlugin)

interface AnimationConfig {
  id: string
  selector: string
  trigger?: string
  animation: AnimationType
  options?: AnimationOptions
}

interface AnimationOptions {
  duration?: number
  delay?: number
  ease?: string
  stagger?: number
  start?: string
  end?: string
  scrub?: boolean | number
  pin?: boolean
  snap?: boolean | number[]
  onComplete?: () => void
  onStart?: () => void
  onUpdate?: (progress: number) => void
}

type AnimationType = 
  | 'fadeIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'scaleOut'
  | 'rotateIn'
  | 'flipX'
  | 'flipY'
  | 'morphText'
  | 'countUp'
  | 'drawSVG'
  | 'liquidMorph'
  | 'particleExplosion'
  | 'glitchEffect'
  | 'typewriter'
  | 'waveText'
  | 'magneticHover'
  | 'parallaxReveal'
  | 'custom'

interface ScrollAnimationOptions {
  animations?: AnimationConfig[]
  globalOptions?: {
    markers?: boolean
    refreshPriority?: number
    normalizeScroll?: boolean
  }
}

const defaultAnimations: AnimationConfig[] = [
  {
    id: 'hero-title',
    selector: '.hero-title',
    animation: 'typewriter',
    options: {
      duration: 2,
      delay: 0.5,
      start: 'top 80%'
    }
  },
  {
    id: 'hero-subtitle',
    selector: '.hero-subtitle',
    animation: 'waveText',
    options: {
      duration: 1.5,
      delay: 1,
      stagger: 0.1,
      start: 'top 75%'
    }
  },
  {
    id: 'about-cards',
    selector: '.about-card',
    animation: 'slideUp',
    options: {
      duration: 0.8,
      stagger: 0.2,
      start: 'top 85%'
    }
  },
  {
    id: 'skills-items',
    selector: '.skill-item',
    animation: 'scaleIn',
    options: {
      duration: 0.6,
      stagger: 0.1,
      start: 'top 90%'
    }
  },
  {
    id: 'experience-timeline',
    selector: '.timeline-item',
    animation: 'slideLeft',
    options: {
      duration: 1,
      stagger: 0.3,
      start: 'top 80%'
    }
  }
]

export function useScrollTriggeredAnimations(
  containerRef?: Ref<HTMLElement | null>,
  options: ScrollAnimationOptions = {}
) {
  const {
    animations = defaultAnimations,
    globalOptions = {}
  } = options

  const {
    markers = false,
    refreshPriority = 0,
    normalizeScroll = true
  } = globalOptions

  const activeAnimations = ref<gsap.core.Timeline[]>([])
  const scrollTriggers = ref<ScrollTrigger[]>([])
  const isInitialized = ref(false)

  // Créer les animations selon le type
  const createAnimation = (config: AnimationConfig, elements: Element[]): gsap.core.Timeline => {
    const tl = gsap.timeline({
      paused: true,
      onComplete: config.options?.onComplete,
      onStart: config.options?.onStart,
      onUpdate: config.options?.onUpdate ? () => config.options?.onUpdate?.(tl.progress()) : undefined
    })

    const {
      duration = 1,
      delay = 0,
      ease = 'power2.out',
      stagger = 0
    } = config.options || {}

    switch (config.animation) {
      case 'fadeIn':
        tl.fromTo(elements, 
          { opacity: 0 },
          { opacity: 1, duration, ease, stagger, delay }
        )
        break

      case 'slideUp':
        tl.fromTo(elements,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration, ease, stagger, delay }
        )
        break

      case 'slideDown':
        tl.fromTo(elements,
          { y: -100, opacity: 0 },
          { y: 0, opacity: 1, duration, ease, stagger, delay }
        )
        break

      case 'slideLeft':
        tl.fromTo(elements,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration, ease, stagger, delay }
        )
        break

      case 'slideRight':
        tl.fromTo(elements,
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration, ease, stagger, delay }
        )
        break

      case 'scaleIn':
        tl.fromTo(elements,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration, ease, stagger, delay }
        )
        break

      case 'scaleOut':
        tl.fromTo(elements,
          { scale: 1.5, opacity: 0 },
          { scale: 1, opacity: 1, duration, ease, stagger, delay }
        )
        break

      case 'rotateIn':
        tl.fromTo(elements,
          { rotation: 180, opacity: 0 },
          { rotation: 0, opacity: 1, duration, ease, stagger, delay }
        )
        break

      case 'flipX':
        tl.fromTo(elements,
          { rotationX: -90, opacity: 0 },
          { rotationX: 0, opacity: 1, duration, ease, stagger, delay }
        )
        break

      case 'flipY':
        tl.fromTo(elements,
          { rotationY: -90, opacity: 0 },
          { rotationY: 0, opacity: 1, duration, ease, stagger, delay }
        )
        break

      case 'typewriter':
        elements.forEach((element, index) => {
          const text = element.textContent || ''
          element.textContent = ''
          tl.to(element, {
            text: { value: text, delimiter: '' },
            duration: duration,
            ease: 'none',
            delay: delay + (stagger * index)
          }, 0)
        })
        break

      case 'waveText':
        elements.forEach((element) => {
          const text = element.textContent || ''
          const chars = text.split('')
          element.innerHTML = chars.map(char => 
            char === ' ' ? ' ' : `<span class="wave-char">${char}</span>`
          ).join('')
          
          const charElements = element.querySelectorAll('.wave-char')
          tl.fromTo(charElements,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.05, delay }
          )
        })
        break

      case 'countUp':
        elements.forEach((element, index) => {
          const targetValue = parseInt(element.textContent || '0')
          const counter = { value: 0 }
          element.textContent = '0'
          
          tl.to(counter, {
            value: targetValue,
            duration: duration,
            ease: 'power2.out',
            delay: delay + (stagger * index),
            onUpdate: () => {
              element.textContent = Math.round(counter.value).toString()
            }
          })
        })
        break

      case 'drawSVG':
        elements.forEach((element, index) => {
          const paths = element.querySelectorAll('path, line, circle, rect')
          paths.forEach(path => {
            const length = (path as SVGPathElement).getTotalLength?.()
            if (length) {
              gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length
              })
            }
          })
          
          tl.to(paths, {
            strokeDashoffset: 0,
            duration: duration,
            ease: ease,
            stagger: 0.1,
            delay: delay + (stagger * index)
          })
        })
        break

      case 'liquidMorph':
        tl.fromTo(elements,
          { 
            scale: 0.8,
            borderRadius: '50%',
            opacity: 0,
            filter: 'blur(10px)'
          },
          { 
            scale: 1,
            borderRadius: '0%',
            opacity: 1,
            filter: 'blur(0px)',
            duration,
            ease: 'elastic.out(1, 0.8)',
            stagger,
            delay
          }
        )
        break

      case 'particleExplosion':
        elements.forEach((element, index) => {
          // Créer des particules temporaires
          const particles: HTMLElement[] = []
          for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div')
            particle.style.cssText = `
              position: absolute;
              width: 4px;
              height: 4px;
              background: #00ff88;
              border-radius: 50%;
              pointer-events: none;
            `
            element.appendChild(particle)
            particles.push(particle)
          }
          
          // Animer l'explosion
          tl.set(element, { opacity: 0 })
          tl.fromTo(particles, 
            { scale: 0, x: 0, y: 0 },
            {
              scale: 1,
              x: () => (Math.random() - 0.5) * 200,
              y: () => (Math.random() - 0.5) * 200,
              opacity: 0,
              duration: 1,
              ease: 'power2.out',
              delay: delay + (stagger * index),
              onComplete: () => particles.forEach(p => p.remove())
            }
          )
          tl.to(element, { opacity: 1, duration: 0.3 }, '-=0.7')
        })
        break

      case 'glitchEffect':
        elements.forEach((element, index) => {
          const glitchTl = gsap.timeline({ repeat: 3, yoyo: true })
          glitchTl.to(element, {
            x: () => Math.random() * 10 - 5,
            y: () => Math.random() * 10 - 5,
            skewX: () => Math.random() * 10 - 5,
            filter: 'hue-rotate(90deg) saturate(2)',
            duration: 0.1,
            ease: 'power2.inOut'
          })
          
          tl.add(glitchTl, delay + (stagger * index))
          tl.fromTo(element, 
            { opacity: 0 },
            { opacity: 1, duration: 0.1 },
            delay + (stagger * index)
          )
        })
        break

      case 'magneticHover':
        elements.forEach((element) => {
          const handleMouseMove = (e: Event) => {
            const mouseEvent = e as MouseEvent
            const rect = element.getBoundingClientRect()
            const x = mouseEvent.clientX - rect.left - rect.width / 2
            const y = mouseEvent.clientY - rect.top - rect.height / 2
            
            gsap.to(element, {
              x: x * 0.3,
              y: y * 0.3,
              duration: 0.3,
              ease: 'power2.out'
            })
          }
          
          const handleMouseLeave = () => {
            gsap.to(element, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: 'elastic.out(1, 0.3)'
            })
          }
          
          element.addEventListener('mousemove', handleMouseMove)
          element.addEventListener('mouseleave', handleMouseLeave)
        })
        break

      case 'parallaxReveal':
        tl.fromTo(elements,
          { 
            y: 200,
            opacity: 0,
            scale: 1.2,
            filter: 'blur(20px)'
          },
          { 
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration,
            ease,
            stagger,
            delay
          }
        )
        break

      default:
        // Animation par défaut (fadeIn)
        tl.fromTo(elements, 
          { opacity: 0 },
          { opacity: 1, duration, ease, stagger, delay }
        )
    }

    return tl
  }

  // Configurer les ScrollTriggers
  const setupScrollTriggers = () => {
    animations.forEach(config => {
      const elements = Array.from(
        containerRef?.value?.querySelectorAll(config.selector) || 
        document.querySelectorAll(config.selector)
      )
      
      if (elements.length === 0) {
        console.warn(`Aucun élément trouvé pour le sélecteur: ${config.selector}`)
        return
      }

      const animation = createAnimation(config, elements)
      activeAnimations.value.push(animation)

      const {
        start = 'top 80%',
        end = 'bottom 20%',
        scrub = false,
        pin = false,
        snap
      } = config.options || {}
      
      const snapValue = snap === false ? undefined : snap === true ? 1 : snap

      const trigger = ScrollTrigger.create({
        trigger: config.trigger || elements[0],
        start,
        end,
        scrub,
        pin,
        snap: snapValue,
        markers,
        refreshPriority,
        animation,
        onEnter: () => {
          if (!scrub) animation.play()
        },
        onLeave: () => {
          if (!scrub && config.animation !== 'magneticHover') {
            animation.reverse()
          }
        },
        onEnterBack: () => {
          if (!scrub) animation.play()
        },
        onLeaveBack: () => {
          if (!scrub && config.animation !== 'magneticHover') {
            animation.reverse()
          }
        }
      })

      scrollTriggers.value.push(trigger)
    })
  }

  // Ajouter une animation personnalisée
  const addAnimation = (config: AnimationConfig) => {
    animations.push(config)
    if (isInitialized.value) {
      setupScrollTriggers()
    }
  }

  // Supprimer une animation
  const removeAnimation = (animationId: string) => {
    const index = animations.findIndex(anim => anim.id === animationId)
    if (index !== -1) {
      // Nettoyer le ScrollTrigger correspondant
      const trigger = scrollTriggers.value[index]
      if (trigger) {
        trigger.kill()
        scrollTriggers.value.splice(index, 1)
      }
      
      // Nettoyer l'animation
      const animation = activeAnimations.value[index]
      if (animation) {
        animation.kill()
        activeAnimations.value.splice(index, 1)
      }
      
      animations.splice(index, 1)
    }
  }

  // Rafraîchir tous les ScrollTriggers
  const refreshScrollTriggers = () => {
    ScrollTrigger.refresh()
  }

  // Initialiser le système d'animations
  const initScrollAnimations = () => {
    if (isInitialized.value) return

    // Configuration globale
    if (normalizeScroll) {
      ScrollTrigger.normalizeScroll(true)
    }

    // Ajouter les styles CSS nécessaires
    const style = document.createElement('style')
    style.textContent = `
      .wave-char {
        display: inline-block;
        will-change: transform;
      }
      
      .scroll-triggered-element {
        will-change: transform, opacity, filter;
      }
      
      .magnetic-element {
        cursor: pointer;
        transition: transform 0.3s ease;
      }
      
      .magnetic-element:hover {
        z-index: 10;
      }
    `
    document.head.appendChild(style)

    // Configurer les animations
    setupScrollTriggers()
    
    isInitialized.value = true
  }

  // Nettoyer les ressources
  const cleanup = () => {
    // Tuer toutes les animations
    activeAnimations.value.forEach(animation => animation.kill())
    activeAnimations.value = []
    
    // Tuer tous les ScrollTriggers
    scrollTriggers.value.forEach(trigger => trigger.kill())
    scrollTriggers.value = []
    
    isInitialized.value = false
  }

  // Pause/reprendre toutes les animations
  const pauseAnimations = () => {
    activeAnimations.value.forEach(animation => animation.pause())
  }

  const resumeAnimations = () => {
    activeAnimations.value.forEach(animation => animation.resume())
  }

  onMounted(() => {
    nextTick(() => {
      initScrollAnimations()
    })
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    activeAnimations,
    scrollTriggers,
    isInitialized,
    initScrollAnimations,
    addAnimation,
    removeAnimation,
    refreshScrollTriggers,
    pauseAnimations,
    resumeAnimations,
    cleanup
  }
}