import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

/**
 * Composable pour gérer les micro-interactions
 * Inclut hover effects, feedback visuel et transitions fluides
 */
export function useMicroInteractions() {
  const activeInteractions = ref(new Map<HTMLElement, gsap.core.Timeline>())
  const hoverElements = ref(new Set<HTMLElement>())

  // Effet de hover avec scale et glow
  const createHoverEffect = (element: HTMLElement, options = {}) => {
    const defaultOptions = {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
      glow: true,
      lift: true,
      ...options
    }

    const timeline = gsap.timeline({ paused: true })
    
    if (defaultOptions.lift) {
      timeline.to(element, {
        y: -5,
        duration: defaultOptions.duration,
        ease: defaultOptions.ease
      }, 0)
    }
    
    timeline.to(element, {
      scale: defaultOptions.scale,
      duration: defaultOptions.duration,
      ease: defaultOptions.ease
    }, 0)
    
    if (defaultOptions.glow) {
      timeline.to(element, {
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        duration: defaultOptions.duration,
        ease: defaultOptions.ease
      }, 0)
    }

    const handleMouseEnter = () => timeline.play()
    const handleMouseLeave = () => timeline.reverse()

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
    
    hoverElements.value.add(element)
    activeInteractions.value.set(element, timeline)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      timeline.kill()
      hoverElements.value.delete(element)
      activeInteractions.value.delete(element)
    }
  }

  // Effet de click avec ripple
  const createRippleEffect = (element: HTMLElement, options = {}) => {
    const defaultOptions = {
      color: 'rgba(255, 255, 255, 0.6)',
      duration: 0.6,
      ...options
    }

    const handleClick = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const ripple = document.createElement('div')
      ripple.className = 'ripple-effect'
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: ${defaultOptions.color};
        pointer-events: none;
        transform: scale(0);
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        margin-left: -10px;
        margin-top: -10px;
        z-index: 1000;
      `
      
      element.style.position = 'relative'
      element.style.overflow = 'hidden'
      element.appendChild(ripple)
      
      gsap.to(ripple, {
        scale: 4,
        opacity: 0,
        duration: defaultOptions.duration,
        ease: 'power2.out',
        onComplete: () => {
          ripple.remove()
        }
      })
    }

    element.addEventListener('click', handleClick)
    
    return () => {
      element.removeEventListener('click', handleClick)
    }
  }

  // Effet de focus avec animation de bordure
  const createFocusEffect = (element: HTMLElement, options = {}) => {
    const defaultOptions = {
      color: 'var(--color-primary, #007bff)',
      width: 2,
      duration: 0.3,
      ...options
    }

    const focusRing = document.createElement('div')
    focusRing.className = 'focus-ring'
    focusRing.style.cssText = `
      position: absolute;
      top: -${defaultOptions.width}px;
      left: -${defaultOptions.width}px;
      right: -${defaultOptions.width}px;
      bottom: -${defaultOptions.width}px;
      border: ${defaultOptions.width}px solid ${defaultOptions.color};
      border-radius: inherit;
      opacity: 0;
      pointer-events: none;
      z-index: 1001;
    `
    
    element.style.position = 'relative'
    element.appendChild(focusRing)

    const handleFocus = () => {
      gsap.to(focusRing, {
        opacity: 1,
        scale: 1.02,
        duration: defaultOptions.duration,
        ease: 'power2.out'
      })
    }

    const handleBlur = () => {
      gsap.to(focusRing, {
        opacity: 0,
        scale: 1,
        duration: defaultOptions.duration,
        ease: 'power2.out'
      })
    }

    element.addEventListener('focus', handleFocus)
    element.addEventListener('blur', handleBlur)
    
    return () => {
      element.removeEventListener('focus', handleFocus)
      element.removeEventListener('blur', handleBlur)
      focusRing.remove()
    }
  }

  // Effet de loading sur les boutons
  const createButtonLoadingEffect = (button: HTMLElement) => {
    const originalContent = button.innerHTML
    const originalWidth = button.offsetWidth
    
    const startLoading = () => {
      button.style.width = `${originalWidth}px`
      button.innerHTML = `
        <div class="button-spinner" style="
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          margin: 0 auto;
          animation: spin 1s linear infinite;
        "></div>
      `
      if (button instanceof HTMLButtonElement || button instanceof HTMLInputElement) {
        button.disabled = true
      } else {
        button.setAttribute('disabled', 'true')
        button.style.pointerEvents = 'none'
      }
      
      // Ajouter l'animation CSS si elle n'existe pas
      if (!document.querySelector('#button-spinner-styles')) {
        const style = document.createElement('style')
        style.id = 'button-spinner-styles'
        style.textContent = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
        document.head.appendChild(style)
      }
    }
    
    const stopLoading = () => {
      button.innerHTML = originalContent
      if (button instanceof HTMLButtonElement || button instanceof HTMLInputElement) {
        button.disabled = false
      } else {
        button.removeAttribute('disabled')
        button.style.pointerEvents = 'auto'
      }
      button.style.width = 'auto'
    }
    
    return { startLoading, stopLoading }
  }

  // Effet de shake pour les erreurs
  const createShakeEffect = (element: HTMLElement, options = {}) => {
    const defaultOptions = {
      intensity: 10,
      duration: 0.5,
      ...options
    }
    
    return () => {
      gsap.to(element, {
        x: defaultOptions.intensity,
        duration: 0.1,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 5,
        onComplete: () => {
          gsap.set(element, { x: 0 })
        }
      })
    }
  }

  // Effet de bounce pour les succès
  const createBounceEffect = (element: HTMLElement, options = {}) => {
    const defaultOptions = {
      scale: 1.1,
      duration: 0.3,
      ...options
    }
    
    return () => {
      gsap.to(element, {
        scale: defaultOptions.scale,
        duration: defaultOptions.duration,
        ease: 'back.out(1.7)',
        yoyo: true,
        repeat: 1
      })
    }
  }

  // Effet de typing pour le texte
  const createTypingEffect = (element: HTMLElement, text: string, options = {}) => {
    const defaultOptions = {
      speed: 50,
      cursor: true,
      ...options
    }
    
    element.innerHTML = ''
    
    if (defaultOptions.cursor) {
      element.innerHTML = '<span class="typing-cursor">|</span>'
      
      // Ajouter l'animation du curseur
      const style = document.createElement('style')
      style.textContent = `
        .typing-cursor {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }
    
    let i = 0
    const typeWriter = () => {
      if (i < text.length) {
        const cursor = element.querySelector('.typing-cursor')
        const textContent = text.charAt(i)
        
        if (cursor) {
          cursor.insertAdjacentText('beforebegin', textContent)
        } else {
          element.innerHTML += textContent
        }
        
        i++
        setTimeout(typeWriter, defaultOptions.speed)
      } else if (defaultOptions.cursor) {
        // Supprimer le curseur à la fin
        setTimeout(() => {
          const cursor = element.querySelector('.typing-cursor')
          cursor?.remove()
        }, 1000)
      }
    }
    
    typeWriter()
  }

  // Effet de morphing entre deux états
  const createMorphEffect = (element: HTMLElement, states: { from: any; to: any }, options = {}) => {
    const defaultOptions = {
      duration: 0.5,
      ease: 'power2.inOut',
      ...options
    }
    
    const timeline = gsap.timeline({ paused: true })
    timeline.to(element, {
      ...states.to,
      duration: defaultOptions.duration,
      ease: defaultOptions.ease
    })
    
    const morphTo = () => timeline.play()
    const morphBack = () => timeline.reverse()
    
    return { morphTo, morphBack, timeline }
  }

  // Nettoyer toutes les interactions
  const cleanup = () => {
    activeInteractions.value.forEach((timeline, element) => {
      timeline.kill()
    })
    activeInteractions.value.clear()
    hoverElements.value.clear()
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    // État
    activeInteractions,
    hoverElements,
    
    // Effets de base
    createHoverEffect,
    createRippleEffect,
    createFocusEffect,
    
    // Effets spécialisés
    createButtonLoadingEffect,
    createShakeEffect,
    createBounceEffect,
    createTypingEffect,
    createMorphEffect,
    
    // Utilitaires
    cleanup
  }
}

/**
 * Directive Vue pour appliquer automatiquement des micro-interactions
 */
export const vMicroInteraction = {
  mounted(el: HTMLElement, binding: any) {
    const { createHoverEffect, createRippleEffect, createFocusEffect } = useMicroInteractions()
    
    const options = binding.value || {}
    const effects = options.effects || ['hover']
    
    const cleanupFunctions: (() => void)[] = []
    
    if (effects.includes('hover')) {
      cleanupFunctions.push(createHoverEffect(el, options.hover))
    }
    
    if (effects.includes('ripple')) {
      cleanupFunctions.push(createRippleEffect(el, options.ripple))
    }
    
    if (effects.includes('focus')) {
      cleanupFunctions.push(createFocusEffect(el, options.focus))
    }
    
    // Stocker les fonctions de nettoyage
    ;(el as any)._microInteractionCleanup = cleanupFunctions
  },
  
  unmounted(el: HTMLElement) {
    const cleanupFunctions = (el as any)._microInteractionCleanup
    if (cleanupFunctions) {
      cleanupFunctions.forEach((cleanup: () => void) => cleanup())
    }
  }
}