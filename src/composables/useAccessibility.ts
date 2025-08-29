import { ref, onMounted, onUnmounted, computed } from 'vue'

/**
 * Composable pour améliorer l'accessibilité WCAG
 * Gère la navigation clavier, les préférences utilisateur et les aria-labels
 */
export function useAccessibility() {
  const prefersReducedMotion = ref(false)
  const prefersHighContrast = ref(false)
  const currentFocusIndex = ref(-1)
  const focusableElements = ref<HTMLElement[]>([])
  const announcements = ref<string[]>([])

  // Détection des préférences utilisateur
  const detectUserPreferences = () => {
    if (typeof window === 'undefined') return

    // Préférence pour les animations réduites
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = motionQuery.matches
    motionQuery.addEventListener('change', (e) => {
      prefersReducedMotion.value = e.matches
    })

    // Préférence pour le contraste élevé
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    prefersHighContrast.value = contrastQuery.matches
    contrastQuery.addEventListener('change', (e) => {
      prefersHighContrast.value = e.matches
    })
  }

  // Navigation clavier
  const setupKeyboardNavigation = (container: HTMLElement) => {
    const updateFocusableElements = () => {
      const selector = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ].join(', ')
      
      focusableElements.value = Array.from(
        container.querySelectorAll(selector)
      ) as HTMLElement[]
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Navigation avec Tab/Shift+Tab
      if (event.key === 'Tab') {
        updateFocusableElements()
        
        if (focusableElements.value.length === 0) return

        const activeElement = document.activeElement as HTMLElement
        const currentIndex = focusableElements.value.indexOf(activeElement)

        if (event.shiftKey) {
          // Shift + Tab (navigation arrière)
          const prevIndex = currentIndex <= 0 ? focusableElements.value.length - 1 : currentIndex - 1
          focusableElements.value[prevIndex]?.focus()
          event.preventDefault()
        } else {
          // Tab (navigation avant)
          const nextIndex = currentIndex >= focusableElements.value.length - 1 ? 0 : currentIndex + 1
          focusableElements.value[nextIndex]?.focus()
          event.preventDefault()
        }
      }

      // Échapper pour fermer les modales/menus
      if (event.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"][aria-modal="true"]')
        if (activeModal) {
          const closeButton = activeModal.querySelector('[aria-label*="fermer"], [aria-label*="close"]') as HTMLElement
          closeButton?.click()
        }
      }

      // Entrée/Espace pour activer les éléments
      if (event.key === 'Enter' || event.key === ' ') {
        const target = event.target as HTMLElement
        if (target.getAttribute('role') === 'button' && !target.matches('button, input, textarea')) {
          target.click()
          event.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    updateFocusableElements()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }

  // Gestion des annonces pour les lecteurs d'écran
  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announcements.value.push(message)
    
    // Créer un élément live region temporaire
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', priority)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    liveRegion.textContent = message
    
    document.body.appendChild(liveRegion)
    
    // Nettoyer après 1 seconde
    setTimeout(() => {
      document.body.removeChild(liveRegion)
    }, 1000)
  }

  // Améliorer le focus visible
  const enhanceFocusVisibility = () => {
    const style = document.createElement('style')
    style.textContent = `
      /* Focus visible amélioré */
      *:focus {
        outline: 2px solid var(--color-primary, #007bff);
        outline-offset: 2px;
        border-radius: 4px;
      }
      
      *:focus:not(:focus-visible) {
        outline: none;
      }
      
      *:focus-visible {
        outline: 2px solid var(--color-primary, #007bff);
        outline-offset: 2px;
        border-radius: 4px;
        box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.25);
      }
      
      /* Skip link */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary, #007bff);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 9999;
        transition: top 0.3s;
      }
      
      .skip-link:focus {
        top: 6px;
      }
      
      /* Screen reader only */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      /* Contraste élevé */
      @media (prefers-contrast: high) {
        * {
          border-color: currentColor !important;
        }
        
        .hero__background,
        .about__background {
          opacity: 0.1 !important;
        }
      }
      
      /* Animations réduites */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `
    
    document.head.appendChild(style)
    return style
  }

  // Ajouter un skip link
  const addSkipLink = () => {
    const skipLink = document.createElement('a')
    skipLink.href = '#main-content'
    skipLink.className = 'skip-link'
    skipLink.textContent = 'Aller au contenu principal'
    skipLink.setAttribute('aria-label', 'Aller directement au contenu principal')
    
    document.body.insertBefore(skipLink, document.body.firstChild)
    return skipLink
  }

  // Valider le contraste des couleurs
  const validateColorContrast = (foreground: string, background: string): boolean => {
    // Fonction simplifiée pour valider le contraste WCAG AA (4.5:1)
    // Dans un vrai projet, utiliser une librairie comme 'color-contrast'
    const getLuminance = (color: string): number => {
      // Conversion simplifiée - à améliorer avec une vraie librairie
      const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0]
      const [r, g, b] = rgb.map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    
    return contrast >= 4.5 // WCAG AA standard
  }

  // Helpers pour les aria-labels dynamiques
  const generateAriaLabel = (element: HTMLElement, context?: string): string => {
    const text = element.textContent?.trim() || ''
    const role = element.getAttribute('role') || element.tagName.toLowerCase()
    
    if (context) {
      return `${text} - ${context}, ${role}`
    }
    
    return `${text}, ${role}`
  }

  // État calculé pour les classes CSS conditionnelles
  const accessibilityClasses = computed(() => ({
    'reduced-motion': prefersReducedMotion.value,
    'high-contrast': prefersHighContrast.value
  }))

  onMounted(() => {
    detectUserPreferences()
    enhanceFocusVisibility()
    addSkipLink()
  })

  return {
    // État
    prefersReducedMotion,
    prefersHighContrast,
    accessibilityClasses,
    announcements,
    
    // Méthodes
    setupKeyboardNavigation,
    announceToScreenReader,
    validateColorContrast,
    generateAriaLabel,
    enhanceFocusVisibility
  }
}

/**
 * Directive Vue pour améliorer automatiquement l'accessibilité
 */
export const vAccessible = {
  mounted(el: HTMLElement, binding: any) {
    const { setupKeyboardNavigation, generateAriaLabel } = useAccessibility()
    
    // Configuration automatique de la navigation clavier
    setupKeyboardNavigation(el)
    
    // Ajout automatique d'aria-labels si manquants
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
      const label = generateAriaLabel(el, binding.value)
      el.setAttribute('aria-label', label)
    }
    
    // Ajout du rôle si manquant pour les éléments interactifs
    if (el.onclick && !el.getAttribute('role')) {
      el.setAttribute('role', 'button')
    }
  }
}