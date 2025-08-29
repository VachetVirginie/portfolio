import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

/**
 * Composable pour optimiser les performances des animations et interactions
 * Gère la limitation du taux de rafraîchissement, la mise en cache, et l'optimisation des ressources
 */
export function usePerformanceOptimization() {
  const isLowPerformanceDevice = ref(false)
  const animationQuality = ref<'high' | 'medium' | 'low'>('high')
  const frameRate = ref(60)
  const isVisible = ref(true)
  
  let performanceObserver: PerformanceObserver | null = null
  let intersectionObserver: IntersectionObserver | null = null
  let animationFrameId: number | null = null
  let lastFrameTime = 0
  let frameCount = 0
  let fps = 60

  // Détecter les performances de l'appareil
  const detectDevicePerformance = () => {
    // Vérifier la mémoire disponible
    const memory = (navigator as any).deviceMemory
    const hardwareConcurrency = navigator.hardwareConcurrency || 4
    
    // Vérifier si c'est un appareil mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // Détecter les performances basées sur plusieurs facteurs
    if (memory && memory < 4) {
      isLowPerformanceDevice.value = true
      animationQuality.value = 'low'
    } else if (hardwareConcurrency < 4 || isMobile) {
      animationQuality.value = 'medium'
    } else {
      animationQuality.value = 'high'
    }
    
    // Ajuster le taux de rafraîchissement
    frameRate.value = isLowPerformanceDevice.value ? 30 : 60
  }

  // Monitorer les performances en temps réel
  const monitorPerformance = () => {
    if ('PerformanceObserver' in window) {
      performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        
        entries.forEach((entry) => {
          // Surveiller les tâches longues (> 50ms)
          if (entry.entryType === 'longtask' && entry.duration > 50) {
            console.warn('Long task detected:', entry.duration + 'ms')
            
            // Réduire la qualité des animations si nécessaire
            if (animationQuality.value === 'high') {
              animationQuality.value = 'medium'
              optimizeAnimations()
            } else if (animationQuality.value === 'medium') {
              animationQuality.value = 'low'
              optimizeAnimations()
            }
          }
        })
      })
      
      try {
        performanceObserver.observe({ entryTypes: ['longtask'] })
      } catch (e) {
        console.warn('Performance monitoring not supported')
      }
    }
  }

  // Calculer le FPS en temps réel
  const calculateFPS = () => {
    const now = performance.now()
    frameCount++
    
    if (now - lastFrameTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (now - lastFrameTime))
      frameCount = 0
      lastFrameTime = now
      
      // Ajuster la qualité basée sur le FPS
      if (fps < 30 && animationQuality.value !== 'low') {
        animationQuality.value = 'low'
        optimizeAnimations()
      } else if (fps > 50 && animationQuality.value === 'low') {
        animationQuality.value = 'medium'
        optimizeAnimations()
      }
    }
    
    animationFrameId = requestAnimationFrame(calculateFPS)
  }

  // Optimiser les animations basées sur la qualité
  const optimizeAnimations = () => {
    const settings = {
      high: {
        ease: 'power2.out',
        duration: 1,
        stagger: 0.1,
        blur: true,
        particles: true
      },
      medium: {
        ease: 'power1.out',
        duration: 0.6,
        stagger: 0.05,
        blur: false,
        particles: true
      },
      low: {
        ease: 'none',
        duration: 0.3,
        stagger: 0,
        blur: false,
        particles: false
      }
    }
    
    const currentSettings = settings[animationQuality.value]
    
    // Appliquer les paramètres globaux GSAP
    gsap.defaults({
      ease: currentSettings.ease,
      duration: currentSettings.duration
    })
    
    // Désactiver certains effets si nécessaire
    if (!currentSettings.blur) {
      document.documentElement.style.setProperty('--enable-blur', '0')
    }
    
    if (!currentSettings.particles) {
      document.documentElement.style.setProperty('--enable-particles', '0')
    }
  }

  // Optimiser les images avec lazy loading
  const optimizeImages = () => {
    const images = document.querySelectorAll('img[data-src]')
    
    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.getAttribute('data-src')
            
            if (src) {
              img.src = src
              img.removeAttribute('data-src')
              intersectionObserver?.unobserve(img)
            }
          }
        })
      }, {
        rootMargin: '50px'
      })
      
      images.forEach((img) => {
        intersectionObserver?.observe(img)
      })
    } else {
      // Fallback pour les navigateurs sans IntersectionObserver
      images.forEach((img) => {
        const src = img.getAttribute('data-src')
        if (src) {
          (img as HTMLImageElement).src = src
          img.removeAttribute('data-src')
        }
      })
    }
  }

  // Throttle pour les événements de scroll
  const throttle = <T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return function (this: any, ...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  // Debounce pour les événements de resize
  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: number | undefined
    return function (this: any, ...args: Parameters<T>) {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  // Gérer la visibilité de la page
  const handleVisibilityChange = () => {
    isVisible.value = !document.hidden
    
    if (document.hidden) {
      // Pause toutes les animations GSAP
      gsap.globalTimeline.pause()
      
      // Arrêter le monitoring FPS
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    } else {
      // Reprendre les animations
      gsap.globalTimeline.resume()
      
      // Reprendre le monitoring FPS
      calculateFPS()
    }
  }

  // Précharger les ressources critiques
  const preloadCriticalResources = () => {
    // Précharger les polices
    const fonts = [
      'Inter',
      'JetBrains Mono'
    ]
    
    fonts.forEach((font) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      link.href = `/fonts/${font}.woff2`
      document.head.appendChild(link)
    })
    
    // Précharger les images critiques
    const criticalImages = document.querySelectorAll('img[data-critical]')
    criticalImages.forEach((img) => {
      const src = img.getAttribute('src') || img.getAttribute('data-src')
      if (src) {
        const preloadLink = document.createElement('link')
        preloadLink.rel = 'preload'
        preloadLink.as = 'image'
        preloadLink.href = src
        document.head.appendChild(preloadLink)
      }
    })
  }

  // Optimiser les animations CSS avec will-change
  const optimizeCSSAnimations = () => {
    const animatedElements = document.querySelectorAll('[data-animate]')
    
    animatedElements.forEach((element) => {
      const htmlElement = element as HTMLElement
      htmlElement.style.willChange = 'transform, opacity'
      
      // Nettoyer will-change après l'animation
      const observer = new MutationObserver(() => {
        if (!htmlElement.style.transform && !htmlElement.style.opacity) {
          htmlElement.style.willChange = 'auto'
          observer.disconnect()
        }
      })
      
      observer.observe(htmlElement, {
        attributes: true,
        attributeFilter: ['style']
      })
    })
  }

  // Initialiser les optimisations
  const initPerformanceOptimizations = () => {
    detectDevicePerformance()
    monitorPerformance()
    optimizeImages()
    preloadCriticalResources()
    optimizeCSSAnimations()
    
    // Démarrer le monitoring FPS
    calculateFPS()
    
    // Écouter les changements de visibilité
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Optimiser les animations initiales
    optimizeAnimations()
  }

  // Nettoyer les ressources
  const cleanup = () => {
    if (performanceObserver) {
      performanceObserver.disconnect()
    }
    
    if (intersectionObserver) {
      intersectionObserver.disconnect()
    }
    
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }

  onMounted(() => {
    initPerformanceOptimizations()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    // État
    isLowPerformanceDevice,
    animationQuality,
    frameRate,
    isVisible,
    fps: ref(fps),
    
    // Méthodes
    optimizeAnimations,
    optimizeImages,
    throttle,
    debounce,
    preloadCriticalResources,
    initPerformanceOptimizations,
    cleanup
  }
}