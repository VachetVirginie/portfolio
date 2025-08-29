import { ref, onMounted, onUnmounted, nextTick, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxLayer {
  id: string
  element?: HTMLElement
  speed: number
  direction: 'up' | 'down' | 'left' | 'right'
  rotation?: number
  scale?: number
  opacity?: number
  blur?: number
  zIndex?: number
}

interface FloatingElement {
  id: string
  type: 'circle' | 'square' | 'triangle' | 'hexagon' | 'star' | 'custom'
  size: number
  color: string
  opacity: number
  speed: number
  rotationSpeed: number
  floatRange: number
  glowEffect?: boolean
  customShape?: string
}

interface ParallaxOptions {
  layers?: ParallaxLayer[]
  floatingElements?: FloatingElement[]
  enableMouseParallax?: boolean
  mouseIntensity?: number
  enableAutoFloat?: boolean
  floatDuration?: number
  enableDepthOfField?: boolean
  maxBlur?: number
  enablePerspective?: boolean
  perspectiveOrigin?: string
}

const defaultFloatingElements: FloatingElement[] = [
  {
    id: 'circle-1',
    type: 'circle',
    size: 60,
    color: '#00ff88',
    opacity: 0.1,
    speed: 0.5,
    rotationSpeed: 0.2,
    floatRange: 30,
    glowEffect: true
  },
  {
    id: 'hexagon-1',
    type: 'hexagon',
    size: 40,
    color: '#74b9ff',
    opacity: 0.15,
    speed: 0.8,
    rotationSpeed: -0.3,
    floatRange: 50,
    glowEffect: true
  },
  {
    id: 'triangle-1',
    type: 'triangle',
    size: 35,
    color: '#f093fb',
    opacity: 0.12,
    speed: 0.3,
    rotationSpeed: 0.4,
    floatRange: 25,
    glowEffect: false
  },
  {
    id: 'star-1',
    type: 'star',
    size: 45,
    color: '#feca57',
    opacity: 0.08,
    speed: 0.6,
    rotationSpeed: -0.1,
    floatRange: 40,
    glowEffect: true
  },
  {
    id: 'square-1',
    type: 'square',
    size: 30,
    color: '#ff6b6b',
    opacity: 0.1,
    speed: 0.4,
    rotationSpeed: 0.5,
    floatRange: 35,
    glowEffect: false
  }
]

export function useMultiLayerParallax(
  containerRef: Ref<HTMLElement | null>,
  options: ParallaxOptions = {}
) {
  const {
    layers = [],
    floatingElements = defaultFloatingElements,
    enableMouseParallax = true,
    mouseIntensity = 0.1,
    enableAutoFloat = true,
    floatDuration = 4,
    enableDepthOfField = true,
    maxBlur = 3,
    enablePerspective = true,
    perspectiveOrigin = '50% 50%'
  } = options

  const parallaxLayers = ref<ParallaxLayer[]>(layers)
  const floatingElementsRef = ref<HTMLElement[]>([])
  const mousePosition = ref({ x: 0, y: 0 })
  const isInitialized = ref(false)

  let scrollTriggers: ScrollTrigger[] = []
  let floatingAnimations: gsap.core.Tween[] = []
  let mouseParallaxAnimation: gsap.core.Tween | null = null

  // Créer les formes SVG
  const createSVGShape = (type: string, size: number, color: string): string => {
    const half = size / 2
    
    switch (type) {
      case 'circle':
        return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle cx="${half}" cy="${half}" r="${half - 2}" fill="${color}" stroke="${color}" stroke-width="1" opacity="0.8"/>
        </svg>`
      
      case 'hexagon':
        const points = []
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3
          const x = half + (half - 2) * Math.cos(angle)
          const y = half + (half - 2) * Math.sin(angle)
          points.push(`${x},${y}`)
        }
        return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <polygon points="${points.join(' ')}" fill="${color}" stroke="${color}" stroke-width="1" opacity="0.8"/>
        </svg>`
      
      case 'triangle':
        return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <polygon points="${half},2 ${size-2},${size-2} 2,${size-2}" fill="${color}" stroke="${color}" stroke-width="1" opacity="0.8"/>
        </svg>`
      
      case 'star':
        const starPoints = []
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5
          const radius = i % 2 === 0 ? half - 2 : (half - 2) * 0.5
          const x = half + radius * Math.cos(angle - Math.PI / 2)
          const y = half + radius * Math.sin(angle - Math.PI / 2)
          starPoints.push(`${x},${y}`)
        }
        return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <polygon points="${starPoints.join(' ')}" fill="${color}" stroke="${color}" stroke-width="1" opacity="0.8"/>
        </svg>`
      
      case 'square':
      default:
        return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <rect x="2" y="2" width="${size-4}" height="${size-4}" fill="${color}" stroke="${color}" stroke-width="1" opacity="0.8"/>
        </svg>`
    }
  }

  // Créer les éléments flottants
  const createFloatingElements = () => {
    if (!containerRef.value) return

    floatingElements.forEach((config, index) => {
      const element = document.createElement('div')
      element.className = `floating-element floating-element--${config.type}`
      element.setAttribute('data-element-id', config.id)
      
      const svgContent = config.type === 'custom' && config.customShape 
        ? config.customShape 
        : createSVGShape(config.type, config.size, config.color)
      
      element.innerHTML = svgContent
      
      // Styles de base
      element.style.cssText = `
        position: absolute;
        width: ${config.size}px;
        height: ${config.size}px;
        opacity: ${config.opacity};
        pointer-events: none;
        z-index: ${100 + index};
        ${config.glowEffect ? `filter: drop-shadow(0 0 10px ${config.color}40);` : ''}
      `
      
      // Position aléatoire initiale
      const containerRect = containerRef.value!.getBoundingClientRect()
      const x = Math.random() * (containerRect.width - config.size)
      const y = Math.random() * (containerRect.height - config.size)
      
      gsap.set(element, {
        x,
        y,
        rotation: Math.random() * 360
      })
      
      containerRef.value!.appendChild(element)
      floatingElementsRef.value.push(element)
    })
  }

  // Animer les éléments flottants
  const animateFloatingElements = () => {
    if (!enableAutoFloat) return

    floatingElementsRef.value.forEach((element, index) => {
      const config = floatingElements[index]
      if (!config) return

      // Animation de flottement
      const floatTween = gsap.to(element, {
        y: `+=${config.floatRange}`,
        duration: floatDuration + Math.random() * 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2
      })

      // Animation de rotation
      const rotationTween = gsap.to(element, {
        rotation: `+=${360 * config.rotationSpeed}`,
        duration: 10 + Math.random() * 5,
        ease: 'none',
        repeat: -1
      })

      // Animation de déplacement horizontal subtil
      const driftTween = gsap.to(element, {
        x: `+=${config.floatRange * 0.5}`,
        duration: floatDuration * 1.5 + Math.random() * 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 3
      })

      floatingAnimations.push(floatTween, rotationTween, driftTween)
    })
  }

  // Configurer le parallax au scroll
  const setupScrollParallax = () => {
    if (!containerRef.value) return

    // Parallax pour les couches définies
    parallaxLayers.value.forEach(layer => {
      if (!layer.element) return

      const trigger = ScrollTrigger.create({
        trigger: containerRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress
          const distance = window.innerHeight * progress * layer.speed
          
          let transform = ''
          
          switch (layer.direction) {
            case 'up':
              transform += `translateY(${-distance}px) `
              break
            case 'down':
              transform += `translateY(${distance}px) `
              break
            case 'left':
              transform += `translateX(${-distance}px) `
              break
            case 'right':
              transform += `translateX(${distance}px) `
              break
          }
          
          if (layer.rotation) {
            transform += `rotate(${progress * layer.rotation}deg) `
          }
          
          if (layer.scale) {
            const scale = 1 + (progress * (layer.scale - 1))
            transform += `scale(${scale}) `
          }
          
          if (layer.element) {
             gsap.set(layer.element, {
               transform,
               opacity: layer.opacity !== undefined ? layer.opacity * (1 - progress * 0.3) : undefined,
               filter: enableDepthOfField && layer.blur ? `blur(${progress * layer.blur}px)` : undefined
             })
           }
        }
      })
      
      scrollTriggers.push(trigger)
    })

    // Parallax pour les éléments flottants
    floatingElementsRef.value.forEach((element, index) => {
      const config = floatingElements[index]
      if (!config) return

      const trigger = ScrollTrigger.create({
        trigger: containerRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const parallaxY = progress * config.speed * 100
          const blur = enableDepthOfField ? progress * maxBlur * (1 - config.speed) : 0
          
          gsap.set(element, {
            y: `+=${parallaxY}`,
            filter: blur > 0 ? `blur(${blur}px)` : 'none'
          })
        }
      })
      
      scrollTriggers.push(trigger)
    })
  }

  // Configurer le parallax de la souris
  const setupMouseParallax = () => {
    if (!enableMouseParallax || !containerRef.value) return

    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.value?.getBoundingClientRect()
      if (!rect) return

      const x = (event.clientX - rect.left - rect.width / 2) / rect.width
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height
      
      mousePosition.value = { x, y }
    }

    containerRef.value.addEventListener('mousemove', handleMouseMove)
    
    // Animer les éléments en fonction de la position de la souris
    mouseParallaxAnimation = gsap.to({}, {
      duration: 0.1,
      repeat: -1,
      onRepeat: () => {
        floatingElementsRef.value.forEach((element, index) => {
          const config = floatingElements[index]
          if (!config) return

          const intensity = mouseIntensity * (1 + config.speed)
          const offsetX = mousePosition.value.x * intensity * 50
          const offsetY = mousePosition.value.y * intensity * 30
          
          gsap.to(element, {
            x: `+=${offsetX}`,
            y: `+=${offsetY}`,
            duration: 0.8,
            ease: 'power2.out'
          })
        })
      }
    })
  }

  // Configurer la perspective
  const setupPerspective = () => {
    if (!enablePerspective || !containerRef.value) return

    containerRef.value.style.perspective = '1000px'
    containerRef.value.style.perspectiveOrigin = perspectiveOrigin
    
    floatingElementsRef.value.forEach((element, index) => {
      const config = floatingElements[index]
      const depth = (1 - config.speed) * 200
      element.style.transform += ` translateZ(${depth}px)`
    })
  }

  // Initialiser le système de parallax
  const initMultiLayerParallax = () => {
    if (!containerRef.value || isInitialized.value) return

    // Ajouter les styles CSS nécessaires
    const style = document.createElement('style')
    style.textContent = `
      .multi-layer-parallax {
        position: relative;
        overflow: hidden;
        transform-style: preserve-3d;
      }
      
      .floating-element {
        will-change: transform, opacity, filter;
        backface-visibility: hidden;
      }
      
      .floating-element svg {
        width: 100%;
        height: 100%;
        display: block;
      }
    `
    document.head.appendChild(style)

    // Ajouter la classe au conteneur
    containerRef.value.classList.add('multi-layer-parallax')

    // Créer et animer les éléments
    createFloatingElements()
    setupPerspective()
    animateFloatingElements()
    setupScrollParallax()
    setupMouseParallax()

    isInitialized.value = true
  }

  // Nettoyer les ressources
  const cleanup = () => {
    // Arrêter les animations
    floatingAnimations.forEach(animation => animation.kill())
    floatingAnimations = []
    
    if (mouseParallaxAnimation) {
      mouseParallaxAnimation.kill()
      mouseParallaxAnimation = null
    }
    
    // Nettoyer les ScrollTriggers
    scrollTriggers.forEach(trigger => trigger.kill())
    scrollTriggers = []
    
    // Supprimer les éléments flottants
    floatingElementsRef.value.forEach(element => element.remove())
    floatingElementsRef.value = []
    
    isInitialized.value = false
  }

  // Ajouter une couche de parallax
  const addParallaxLayer = (layer: ParallaxLayer) => {
    parallaxLayers.value.push(layer)
    if (isInitialized.value) {
      // Reconfigurer le parallax
      setupScrollParallax()
    }
  }

  // Supprimer une couche de parallax
  const removeParallaxLayer = (layerId: string) => {
    const index = parallaxLayers.value.findIndex(layer => layer.id === layerId)
    if (index !== -1) {
      parallaxLayers.value.splice(index, 1)
      if (isInitialized.value) {
        setupScrollParallax()
      }
    }
  }

  onMounted(() => {
    nextTick(() => {
      initMultiLayerParallax()
    })
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    parallaxLayers,
    floatingElementsRef,
    mousePosition,
    isInitialized,
    initMultiLayerParallax,
    addParallaxLayer,
    removeParallaxLayer,
    cleanup
  }
}