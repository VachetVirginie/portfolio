import { ref, onMounted, onUnmounted, nextTick, type Ref } from 'vue'
import { gsap } from 'gsap'

interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: string
}

interface LiquidNavigationOptions {
  items?: NavigationItem[]
  blobColor?: string
  blobOpacity?: number
  animationDuration?: number
  morphingIntensity?: number
  glowEffect?: boolean
  rippleEffect?: boolean
}

const defaultItems: NavigationItem[] = [
  { id: 'hero', label: 'Accueil', href: '#hero', icon: '🏠' },
  { id: 'about', label: 'À propos', href: '#about', icon: '👨‍💻' },
  { id: 'experience', label: 'Expérience', href: '#experience', icon: '💼' },
  { id: 'projects', label: 'Projets', href: '#projects', icon: '🚀' },
  { id: 'contact', label: 'Contact', href: '#contact', icon: '📧' }
]

export function useLiquidNavigation(
  containerRef: Ref<HTMLElement | null>,
  options: LiquidNavigationOptions = {}
) {
  const {
    items = defaultItems,
    blobColor = '#00ff88',
    blobOpacity = 0.2,
    animationDuration = 0.6,
    morphingIntensity = 1.2,
    glowEffect = true,
    rippleEffect = true
  } = options

  const activeItem = ref<string>('hero')
  const isAnimating = ref(false)
  const blobElement = ref<HTMLElement | null>(null)
  const navigationItems = ref<HTMLElement[]>([])

  let resizeObserver: ResizeObserver | null = null
  let intersectionObserver: IntersectionObserver | null = null

  // Créer l'élément blob liquide
  const createLiquidBlob = () => {
    if (!containerRef.value) return

    const blob = document.createElement('div')
    blob.className = 'liquid-blob'
    blob.style.cssText = `
      position: absolute;
      background: ${blobColor};
      opacity: ${blobOpacity};
      border-radius: 50px;
      pointer-events: none;
      z-index: 0;
      transition: none;
      filter: blur(1px);
      ${glowEffect ? `box-shadow: 0 0 20px ${blobColor}40, 0 0 40px ${blobColor}20;` : ''}
    `

    containerRef.value.appendChild(blob)
    blobElement.value = blob

    // Ajouter l'effet de morphing avec SVG
    if (morphingIntensity > 1) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.style.cssText = 'position: absolute; width: 100%; height: 100%; top: 0; left: 0;'
      
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
      filter.id = 'liquid-morph'
      
      const turbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence')
      turbulence.setAttribute('baseFrequency', '0.02')
      turbulence.setAttribute('numOctaves', '3')
      turbulence.setAttribute('result', 'noise')
      
      const displace = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap')
      displace.setAttribute('in', 'SourceGraphic')
      displace.setAttribute('in2', 'noise')
      displace.setAttribute('scale', (morphingIntensity * 10).toString())
      
      filter.appendChild(turbulence)
      filter.appendChild(displace)
      defs.appendChild(filter)
      svg.appendChild(defs)
      blob.appendChild(svg)
      
      blob.style.filter += ' url(#liquid-morph)'
    }
  }

  // Créer l'effet de ripple
  const createRippleEffect = (x: number, y: number) => {
    if (!rippleEffect || !containerRef.value) return

    const ripple = document.createElement('div')
    ripple.className = 'liquid-ripple'
    ripple.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background: ${blobColor};
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
      left: ${x - 5}px;
      top: ${y - 5}px;
      opacity: 0.6;
    `

    containerRef.value.appendChild(ripple)

    gsap.to(ripple, {
      scale: 8,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    })
  }

  // Animer le blob vers un élément
  const animateBlobTo = (targetElement: HTMLElement) => {
    if (!blobElement.value || !containerRef.value || isAnimating.value) return

    isAnimating.value = true
    const containerRect = containerRef.value.getBoundingClientRect()
    const targetRect = targetElement.getBoundingClientRect()

    const x = targetRect.left - containerRect.left
    const y = targetRect.top - containerRect.top
    const width = targetRect.width
    const height = targetRect.height

    // Animation principale du blob
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.value = false
      }
    })

    // Phase 1: Étirement vers la cible
    tl.to(blobElement.value, {
      x: x + width / 2,
      y: y + height / 2,
      scaleX: morphingIntensity,
      scaleY: 0.8,
      duration: animationDuration * 0.4,
      ease: 'power2.out'
    })

    // Phase 2: Morphing et adaptation à la forme
    tl.to(blobElement.value, {
      width: width + 20,
      height: height + 10,
      x: x - 10,
      y: y - 5,
      scaleX: 1,
      scaleY: 1,
      borderRadius: `${Math.min(width, height) / 2 + 10}px`,
      duration: animationDuration * 0.6,
      ease: 'elastic.out(1, 0.8)'
    })

    // Effet de ripple au point de contact
    const centerX = x + width / 2
    const centerY = y + height / 2
    createRippleEffect(centerX, centerY)
  }

  // Mettre à jour la position du blob
  const updateBlobPosition = () => {
    const activeElement = navigationItems.value.find(item => 
      item.getAttribute('data-nav-id') === activeItem.value
    )
    
    if (activeElement) {
      animateBlobTo(activeElement)
    }
  }

  // Gérer le clic sur un élément de navigation
  const handleNavClick = (itemId: string, event: MouseEvent) => {
    if (activeItem.value === itemId) return

    activeItem.value = itemId
    
    // Créer un ripple à la position du clic
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    const containerRect = containerRef.value?.getBoundingClientRect()
    if (containerRect) {
      const x = event.clientX - containerRect.left
      const y = event.clientY - containerRect.top
      createRippleEffect(x, y)
    }

    updateBlobPosition()
  }

  // Observer les sections pour mettre à jour la navigation active
  const setupSectionObserver = () => {
    const sections = items.map(item => document.querySelector(item.href)).filter(Boolean) as HTMLElement[]
    
    if (sections.length === 0) return

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const sectionId = entry.target.id
            const navItem = items.find(item => item.href === `#${sectionId}`)
            if (navItem && activeItem.value !== navItem.id) {
              activeItem.value = navItem.id
              updateBlobPosition()
            }
          }
        })
      },
      {
        threshold: [0.3, 0.5, 0.7],
        rootMargin: '-20% 0px -20% 0px'
      }
    )

    sections.forEach(section => {
      intersectionObserver?.observe(section)
    })
  }

  // Initialiser la navigation liquide
  const initLiquidNavigation = () => {
    if (!containerRef.value) return

    // Collecter les éléments de navigation
    navigationItems.value = Array.from(
      containerRef.value.querySelectorAll('[data-nav-id]')
    ) as HTMLElement[]

    if (navigationItems.value.length === 0) {
      console.warn('Aucun élément de navigation trouvé avec l\'attribut data-nav-id')
      return
    }

    // Créer le blob liquide
    createLiquidBlob()

    // Position initiale du blob
    nextTick(() => {
      updateBlobPosition()
    })

    // Observer les changements de taille
    resizeObserver = new ResizeObserver(() => {
      updateBlobPosition()
    })
    resizeObserver.observe(containerRef.value)

    // Observer les sections
    setupSectionObserver()

    // Ajouter les styles CSS nécessaires
    const style = document.createElement('style')
    style.textContent = `
      .liquid-navigation {
        position: relative;
        overflow: visible;
      }
      
      .liquid-navigation [data-nav-id] {
        position: relative;
        z-index: 2;
        transition: transform 0.2s ease;
      }
      
      .liquid-navigation [data-nav-id]:hover {
        transform: translateY(-2px);
      }
      
      .liquid-navigation [data-nav-id].active {
        color: white;
        text-shadow: 0 0 10px ${blobColor};
      }
      
      @keyframes liquidPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .liquid-blob {
        animation: liquidPulse 4s ease-in-out infinite;
      }
    `
    document.head.appendChild(style)
  }

  // Nettoyer les ressources
  const cleanup = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    
    if (intersectionObserver) {
      intersectionObserver.disconnect()
      intersectionObserver = null
    }
    
    if (blobElement.value) {
      blobElement.value.remove()
      blobElement.value = null
    }
  }

  onMounted(() => {
    nextTick(() => {
      initLiquidNavigation()
    })
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    activeItem,
    isAnimating,
    navigationItems: items,
    handleNavClick,
    updateBlobPosition,
    initLiquidNavigation
  }
}