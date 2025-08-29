import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable pour optimiser les performances des animations SVG
 * et gérer l'accessibilité (prefers-reduced-motion)
 */
export function useSVGAnimations() {
  const prefersReducedMotion = ref(false)
  const isIntersecting = ref(false)
  const animationFrameId = ref<number | null>(null)
  
  // Détection de la préférence utilisateur pour les animations réduites
  const checkReducedMotionPreference = () => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      prefersReducedMotion.value = mediaQuery.matches
      
      // Écouter les changements de préférence
      const handleChange = (e: MediaQueryListEvent) => {
        prefersReducedMotion.value = e.matches
      }
      
      mediaQuery.addEventListener('change', handleChange)
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
    return () => {}
  }
  
  // Intersection Observer pour les animations basées sur la visibilité
  const createIntersectionObserver = (element: HTMLElement, threshold = 0.1) => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      isIntersecting.value = true
      return () => {}
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting.value = entry.isIntersecting
        })
      },
      { threshold }
    )
    
    observer.observe(element)
    
    return () => {
      observer.disconnect()
    }
  }
  
  // Optimisation des animations avec requestAnimationFrame
  const optimizedAnimate = (callback: () => void, fps = 60) => {
    if (prefersReducedMotion.value) return
    
    const interval = 1000 / fps
    let lastTime = 0
    
    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= interval) {
        callback()
        lastTime = currentTime
      }
      
      if (isIntersecting.value) {
        animationFrameId.value = requestAnimationFrame(animate)
      }
    }
    
    animationFrameId.value = requestAnimationFrame(animate)
  }
  
  // Arrêter les animations
  const stopAnimation = () => {
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value)
      animationFrameId.value = null
    }
  }
  
  // Configuration des animations CSS optimisées
  const getOptimizedAnimationStyles = () => {
    if (prefersReducedMotion.value) {
      return {
        animation: 'none',
        transition: 'none'
      }
    }
    
    return {
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden' as const,
      perspective: '1000px'
    }
  }
  
  // Débounce pour les événements de redimensionnement
  const debounce = (func: Function, wait: number) => {
    let timeout: number
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(null, args), wait)
    }
  }
  
  // Gestion de la performance basée sur la batterie (si disponible)
  const checkBatteryStatus = async () => {
    if ('getBattery' in navigator) {
      try {
        // @ts-ignore - getBattery n'est pas dans les types standard
        const battery = await navigator.getBattery()
        
        // Réduire les animations si la batterie est faible
        if (battery.level < 0.2 && !battery.charging) {
          return true // Réduire les animations
        }
      } catch (error) {
        console.warn('Battery API not supported')
      }
    }
    return false
  }
  
  // Détection de la performance du device
  const getDevicePerformance = () => {
    if (typeof window === 'undefined') return 'high'
    
    // Estimation basée sur les capacités du navigateur
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
    
    if (!gl) return 'low'
    
    try {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string
        
        // Détection basique de GPU intégré vs dédié
        if (renderer.includes('Intel') || renderer.includes('Mali')) {
          return 'medium'
        }
      }
    } catch (error) {
      // Fallback si WebGL debug info n'est pas disponible
    }
    
    // Vérification de la mémoire disponible
    // @ts-ignore - memory n'est pas dans les types standard
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      return 'low'
    }
    
    return 'high'
  }
  
  // Configuration adaptative des animations
  const getAdaptiveAnimationConfig = () => {
    const performance = getDevicePerformance()
    
    switch (performance) {
      case 'low':
        return {
          particleCount: 3,
          animationDuration: 2000,
          fps: 30,
          enableComplexAnimations: false
        }
      case 'medium':
        return {
          particleCount: 6,
          animationDuration: 1500,
          fps: 45,
          enableComplexAnimations: true
        }
      default:
        return {
          particleCount: 12,
          animationDuration: 1000,
          fps: 60,
          enableComplexAnimations: true
        }
    }
  }
  
  onMounted(() => {
    const cleanupReducedMotion = checkReducedMotionPreference()
    
    onUnmounted(() => {
      cleanupReducedMotion()
      stopAnimation()
    })
  })
  
  return {
    prefersReducedMotion,
    isIntersecting,
    createIntersectionObserver,
    optimizedAnimate,
    stopAnimation,
    getOptimizedAnimationStyles,
    debounce,
    checkBatteryStatus,
    getDevicePerformance,
    getAdaptiveAnimationConfig
  }
}

/**
 * Composable spécialisé pour les animations de particules optimisées
 */
export function useOptimizedParticles(containerRef: Ref<HTMLElement | null>) {
  const { 
    prefersReducedMotion, 
    isIntersecting, 
    createIntersectionObserver,
    getAdaptiveAnimationConfig 
  } = useSVGAnimations()
  
  const particles = ref<Array<{
    id: number
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    color: string
  }>>([])
  
  const animationConfig = getAdaptiveAnimationConfig()
  
  const initializeParticles = () => {
    if (prefersReducedMotion.value) return
    
    particles.value = Array.from({ length: animationConfig.particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      color: i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-accent)'
    }))
  }
  
  const updateParticles = () => {
    if (prefersReducedMotion.value || !isIntersecting.value) return
    
    particles.value.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      
      // Rebond sur les bords
      if (particle.x <= 0 || particle.x >= 100) particle.vx *= -1
      if (particle.y <= 0 || particle.y >= 100) particle.vy *= -1
      
      // Garder dans les limites
      particle.x = Math.max(0, Math.min(100, particle.x))
      particle.y = Math.max(0, Math.min(100, particle.y))
    })
  }
  
  onMounted(() => {
    if (containerRef.value) {
      const cleanup = createIntersectionObserver(containerRef.value)
      initializeParticles()
      
      onUnmounted(cleanup)
    }
  })
  
  return {
    particles,
    updateParticles,
    initializeParticles,
    animationConfig
  }
}

// Types pour TypeScript
import type { Ref } from 'vue'