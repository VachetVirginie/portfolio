import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'

/**
 * Composable pour gérer un curseur personnalisé interactif
 * Avec animations contextuelles et effets visuels
 */
export function useCustomCursor() {
  const cursorRef = ref<HTMLElement | null>(null)
  const cursorDotRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  const isHovering = ref(false)
  const cursorType = ref<'default' | 'pointer' | 'text' | 'grab' | 'grabbing' | 'loading'>('default')
  const mousePosition = ref({ x: 0, y: 0 })
  const particles: HTMLElement[] = []
  const trailHistory: { x: number; y: number; timestamp: number }[] = []
  const currentColor = ref('#007bff')
  let colorAdaptationInterval: number | undefined
  
  let cursorTimeline: gsap.core.Timeline | undefined
  let followTimeline: gsap.core.Timeline | undefined
  let handleMouseMove: ((e: MouseEvent) => void) | undefined

  // Créer les éléments du curseur
  const createCursorElements = () => {
    // Vérifier s'il existe déjà des curseurs personnalisés
    const existingCursor = document.querySelector('.custom-cursor')
    const existingDot = document.querySelector('.custom-cursor-dot')
    if (existingCursor) existingCursor.remove()
    if (existingDot) existingDot.remove()
    
    // Curseur principal (cercle extérieur)
    const cursor = document.createElement('div')
    cursor.className = 'custom-cursor'
    cursor.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      border: 2px solid var(--color-primary, #007bff);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transform: translate(-50%, -50%);
      transition: border-color 0.3s ease;
      mix-blend-mode: difference;
    `
    
    // Point central (cercle intérieur)
    const cursorDot = document.createElement('div')
    cursorDot.className = 'custom-cursor-dot'
    cursorDot.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 8px;
      height: 8px;
      background: var(--color-primary, #007bff);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      opacity: 0;
      transform: translate(-50%, -50%);
      transition: background-color 0.3s ease;
    `
    
    document.body.appendChild(cursor)
    document.body.appendChild(cursorDot)
    
    cursorRef.value = cursor
    cursorDotRef.value = cursorDot
    
    return { cursor, cursorDot }
  }

  // Analyser la couleur de l'arrière-plan et adapter le curseur
  const adaptCursorColor = () => {
    if (!cursorRef.value || !cursorDotRef.value) return
    
    try {
      // Créer un canvas temporaire pour analyser la couleur
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      canvas.width = 1
      canvas.height = 1
      
      // Capturer l'élément sous le curseur
      const elementUnderCursor = document.elementFromPoint(
        mousePosition.value.x, 
        mousePosition.value.y
      )
      
      if (elementUnderCursor) {
        const computedStyle = window.getComputedStyle(elementUnderCursor)
        const bgColor = computedStyle.backgroundColor
        
        // Convertir la couleur en RGB pour analyse
        const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1])
          const g = parseInt(rgbMatch[2])
          const b = parseInt(rgbMatch[3])
          
          // Calculer la luminosité
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
          
          // Choisir une couleur contrastante
          let newColor: string
          if (luminance > 0.5) {
            // Arrière-plan clair -> curseur sombre
            newColor = `rgb(${Math.max(0, 50 - r/4)}, ${Math.max(0, 50 - g/4)}, ${Math.max(0, 100 - b/4)})`
          } else {
            // Arrière-plan sombre -> curseur clair
            newColor = `rgb(${Math.min(255, 200 + r/4)}, ${Math.min(255, 220 + g/4)}, ${Math.min(255, 255)})`
          }
          
          // Appliquer la nouvelle couleur si elle a changé
          if (newColor !== currentColor.value) {
            currentColor.value = newColor
            
            // Animer le changement de couleur
            gsap.to(cursorRef.value, {
              borderColor: newColor,
              duration: 0.3,
              ease: 'power2.out'
            })
            
            gsap.to(cursorDotRef.value, {
              backgroundColor: newColor,
              duration: 0.3,
              ease: 'power2.out'
            })
          }
        }
      }
    } catch (error) {
      // En cas d'erreur, garder la couleur par défaut
      console.warn('Erreur lors de l\'adaptation de couleur:', error)
    }
  }

  // Créer une particule de trail
  const createParticle = (x: number, y: number) => {
    const particle = document.createElement('div')
    particle.className = 'cursor-particle'
    particle.style.cssText = `
      position: fixed;
      top: ${y}px;
      left: ${x}px;
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, var(--color-primary, #007bff) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      opacity: 0.8;
      transform: translate(-50%, -50%);
    `
    
    document.body.appendChild(particle)
    particles.push(particle)
    
    // Animation de disparition
    gsap.to(particle, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => {
        particle.remove()
        const index = particles.indexOf(particle)
        if (index > -1) particles.splice(index, 1)
      }
    })
  }

  // Créer un trail lumineux
  const createTrail = () => {
    const now = Date.now()
    trailHistory.push({ x: mousePosition.value.x, y: mousePosition.value.y, timestamp: now })
    
    // Nettoyer l'historique (garder seulement les 10 dernières positions)
    while (trailHistory.length > 10) {
      trailHistory.shift()
    }
    
    // Créer des particules le long du trail
    if (trailHistory.length > 1) {
      const lastPos = trailHistory[trailHistory.length - 2]
      const currentPos = trailHistory[trailHistory.length - 1]
      
      // Calculer la distance
      const distance = Math.sqrt(
        Math.pow(currentPos.x - lastPos.x, 2) + Math.pow(currentPos.y - lastPos.y, 2)
      )
      
      // Créer des particules si le mouvement est suffisant
      if (distance > 5) {
        createParticle(lastPos.x, lastPos.y)
      }
    }
  }

  // Suivre la position de la souris
  const updateCursorPosition = (e: MouseEvent) => {
    mousePosition.value = { x: e.clientX, y: e.clientY }
    
    // Créer le trail de particules
    createTrail()
    
    // Adapter la couleur selon l'arrière-plan (avec throttling)
    if (Math.random() < 0.1) { // Seulement 10% du temps pour éviter la surcharge
      adaptCursorColor()
    }
    
    if (cursorDotRef.value) {
      // Le point suit immédiatement
      gsap.to(cursorDotRef.value, {
        x: e.clientX,
        y: e.clientY,
        duration: 0
      })
    }
    
    if (cursorRef.value) {
      // Le cercle suit avec un léger délai pour un effet fluide
      gsap.to(cursorRef.value, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
      })
    }
  }

  // Animer l'entrée du curseur
  const showCursor = () => {
    if (!cursorRef.value || !cursorDotRef.value) return
    
    isVisible.value = true
    
    gsap.to([cursorRef.value, cursorDotRef.value], {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // Animer la sortie du curseur
  const hideCursor = () => {
    if (!cursorRef.value || !cursorDotRef.value) return
    
    isVisible.value = false
    
    gsap.to([cursorRef.value, cursorDotRef.value], {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // Créer des formes morphing créatives
  const createMorphingShape = (type: string) => {
    if (!cursorRef.value) return
    
    // Supprimer les formes précédentes
    const existingShapes = cursorRef.value.querySelectorAll('.morphing-shape')
    existingShapes.forEach(shape => shape.remove())
    
    const shape = document.createElement('div')
    shape.className = 'morphing-shape'
    
    const shapeConfigs: Record<string, string> = {
      pointer: `
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 12px solid var(--color-primary, #007bff);
        border-radius: 2px;
        transform: translate(-50%, -50%) rotate(-45deg);
      `,
      text: `
        width: 2px;
        height: 20px;
        background: var(--color-primary, #007bff);
        border-radius: 1px;
        transform: translate(-50%, -50%);
        animation: blink 1s infinite;
      `,
      grab: `
        width: 16px;
        height: 16px;
        background: transparent;
        border: 2px solid var(--color-primary, #007bff);
        border-radius: 4px;
        transform: translate(-50%, -50%) rotate(45deg);
      `,
      loading: `
        width: 12px;
        height: 12px;
        background: conic-gradient(from 0deg, transparent, var(--color-primary, #007bff));
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: spin 1s linear infinite;
      `
    }
    
    shape.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      pointer-events: none;
      z-index: 1;
      ${shapeConfigs[type] || ''}
    `
    
    cursorRef.value.appendChild(shape)
    
    // Animation d'apparition
    gsap.fromTo(shape, 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
    )
  }

  // Changer le type de curseur
  const setCursorType = (type: typeof cursorType.value) => {
    cursorType.value = type
    
    if (!cursorRef.value || !cursorDotRef.value) return
    
    // Créer la forme morphing appropriée
    createMorphingShape(type)
    
    const animations: Record<string, any> = {
      default: {
        cursor: { scale: 1, borderWidth: '2px', borderRadius: '50%' },
        dot: { scale: 1 }
      },
      pointer: {
        cursor: { scale: 1.3, borderWidth: '1px', borderRadius: '50%' },
        dot: { scale: 0.3 }
      },
      text: {
        cursor: { scale: 1.1, borderWidth: '1px', borderRadius: '50%' },
        dot: { scale: 0 }
      },
      grab: {
        cursor: { scale: 1.2, borderWidth: '2px', borderRadius: '20%' },
        dot: { scale: 0.8 }
      },
      grabbing: {
        cursor: { scale: 0.9, borderWidth: '3px', borderRadius: '20%' },
        dot: { scale: 1.2 }
      },
      loading: {
        cursor: { scale: 1.4, borderWidth: '1px', borderRadius: '50%' },
        dot: { scale: 0 }
      }
    }
    
    const config = animations[type] || animations.default
    
    gsap.to(cursorRef.value, {
      ...config.cursor,
      duration: 0.4,
      ease: 'power2.out',
      repeat: type === 'loading' ? -1 : 0
    })
    
    gsap.to(cursorDotRef.value, {
      ...config.dot,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // Créer un champ magnétique avancé avec déformation élastique
  const createMagneticField = (element: HTMLElement) => {
    if (!cursorRef.value || !cursorDotRef.value) return
    
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Calculer la distance et la force magnétique
    const distance = Math.sqrt(
      Math.pow(mousePosition.value.x - centerX, 2) + 
      Math.pow(mousePosition.value.y - centerY, 2)
    )
    
    const maxDistance = 100 // Distance maximale d'influence
    const magneticForce = Math.max(0, 1 - distance / maxDistance)
    
    if (magneticForce > 0) {
      // Calculer la position magnétique
      const magneticX = mousePosition.value.x + (centerX - mousePosition.value.x) * magneticForce * 0.3
      const magneticY = mousePosition.value.y + (centerY - mousePosition.value.y) * magneticForce * 0.3
      
      // Déformation élastique du curseur
      const deformation = magneticForce * 0.5
      
      gsap.to(cursorRef.value, {
        x: magneticX,
        y: magneticY,
        scaleX: 1 + deformation,
        scaleY: 1 - deformation * 0.5,
        rotation: magneticForce * 10,
        duration: 0.2,
        ease: 'power2.out'
      })
      
      gsap.to(cursorDotRef.value, {
        x: magneticX,
        y: magneticY,
        scale: 1 + magneticForce * 0.3,
        duration: 0.15,
        ease: 'power2.out'
      })
      
      // Créer des particules magnétiques
      if (Math.random() < magneticForce * 0.3) {
        createMagneticParticle(magneticX, magneticY, centerX, centerY)
      }
    }
  }
  
  // Créer des particules magnétiques
  const createMagneticParticle = (startX: number, startY: number, targetX: number, targetY: number) => {
    const particle = document.createElement('div')
    particle.className = 'magnetic-particle'
    particle.style.cssText = `
      position: fixed;
      top: ${startY}px;
      left: ${startX}px;
      width: 2px;
      height: 2px;
      background: radial-gradient(circle, ${currentColor.value} 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9997;
      opacity: 0.6;
      transform: translate(-50%, -50%);
    `
    
    document.body.appendChild(particle)
    
    // Animation vers la cible
    gsap.to(particle, {
      x: targetX,
      y: targetY,
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => particle.remove()
    })
  }

  // Effet de hover
  const onHoverStart = (element: HTMLElement) => {
    isHovering.value = true
    
    // Déterminer le type de curseur basé sur l'élément
    if (element.tagName === 'A' || element.tagName === 'BUTTON' || element.onclick) {
      setCursorType('pointer')
    } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.contentEditable === 'true') {
      setCursorType('text')
    } else if (element.draggable) {
      setCursorType('grab')
    }
    
    // Activer le champ magnétique avancé
    createMagneticField(element)
  }

  const onHoverEnd = () => {
    isHovering.value = false
    setCursorType('default')
    
    // Reprendre le suivi normal de la souris
    if (cursorRef.value) {
      gsap.to(cursorRef.value, {
        x: mousePosition.value.x,
        y: mousePosition.value.y,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }

  // Effet de click
  const onClickEffect = () => {
    if (!cursorRef.value || !cursorDotRef.value) return
    
    // Animation de click avec scale
    gsap.to(cursorRef.value, {
      scale: 0.8,
      duration: 0.1,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    })
    
    gsap.to(cursorDotRef.value, {
      scale: 1.5,
      duration: 0.1,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    })
    
    // Créer un effet de ripple
    const ripple = document.createElement('div')
    ripple.style.cssText = `
      position: fixed;
      top: ${mousePosition.value.y}px;
      left: ${mousePosition.value.x}px;
      width: 20px;
      height: 20px;
      border: 2px solid var(--color-primary, #007bff);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      opacity: 0.8;
    `
    
    document.body.appendChild(ripple)
    
    gsap.to(ripple, {
      scale: 3,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    })
  }

  // Configurer les event listeners
  const setupEventListeners = () => {
    // Mouvement de la souris
    handleMouseMove = (e: MouseEvent) => {
      updateCursorPosition(e)
      if (!isVisible.value) {
        showCursor()
      }
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', hideCursor)
    document.addEventListener('click', onClickEffect)
    
    // Hover sur les éléments interactifs
    const interactiveElements = 'a, button, input, textarea, [onclick], [draggable="true"], .interactive'
    
    const handleMouseEnter = (e: Event) => {
      onHoverStart(e.target as HTMLElement)
    }
    
    const handleMouseLeave = () => {
      onHoverEnd()
    }
    
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement
      if (target.matches(interactiveElements)) {
        handleMouseEnter(e)
      }
    })
    
    document.addEventListener('mouseout', (e) => {
      const target = e.target as HTMLElement
      if (target.matches(interactiveElements)) {
        handleMouseLeave()
      }
    })
    
    // Gestion du drag
    document.addEventListener('dragstart', () => setCursorType('grabbing'))
    document.addEventListener('dragend', () => setCursorType('default'))
  }

  // Nettoyer les event listeners
  const cleanup = () => {
    if (handleMouseMove) {
      document.removeEventListener('mousemove', handleMouseMove)
    }
    document.removeEventListener('mouseleave', hideCursor)
    document.removeEventListener('click', onClickEffect)
    
    if (cursorTimeline) {
      cursorTimeline.kill()
    }
    
    if (followTimeline) {
      followTimeline.kill()
    }
    
    // Supprimer les éléments du DOM
    cursorRef.value?.remove()
    cursorDotRef.value?.remove()
    
    // Supprimer tous les curseurs personnalisés existants
    document.querySelectorAll('.custom-cursor, .custom-cursor-dot').forEach(el => el.remove())
    
    // Supprimer les styles personnalisés
    const customStyle = document.getElementById('custom-cursor-styles')
    if (customStyle) customStyle.remove()
    
    // Restaurer le curseur par défaut
    document.body.style.cursor = 'auto'
  }

  // Initialiser le curseur
  const initCursor = () => {
    // Vérifier si l'utilisateur préfère les animations réduites
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    
    // Vérifier si c'est un appareil tactile
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return
    
    // Supprimer les styles existants s'ils existent
    const existingStyle = document.getElementById('custom-cursor-styles')
    if (existingStyle) existingStyle.remove()
    
    createCursorElements()
    setupEventListeners()
    
    // Masquer le curseur par défaut
    document.body.style.cursor = 'none'
    
    // Ajouter les styles CSS globaux
    const style = document.createElement('style')
    style.id = 'custom-cursor-styles'
    style.textContent = `
      * {
        cursor: none !important;
      }
      
      .custom-cursor {
        backdrop-filter: blur(1px);
        box-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
        transition: box-shadow 0.3s ease;
      }
      
      .custom-cursor:hover {
        box-shadow: 0 0 30px rgba(0, 123, 255, 0.5);
      }
      
      .custom-cursor-dot {
        backdrop-filter: blur(1px);
        box-shadow: 0 0 10px rgba(0, 123, 255, 0.6);
      }
      
      .cursor-particle {
        box-shadow: 0 0 8px rgba(0, 123, 255, 0.8);
      }
      
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
      
      @keyframes spin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
      
      @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); }
      }
    `
    document.head.appendChild(style)
  }

  // Désactiver le curseur personnalisé
  const disableCursor = () => {
    document.body.style.cursor = 'auto'
    cleanup()
  }

  onMounted(() => {
    nextTick(() => {
      initCursor()
    })
  })

  onUnmounted(() => {
    disableCursor()
  })

  return {
    // État
    isVisible,
    isHovering,
    cursorType,
    mousePosition,
    
    // Méthodes
    setCursorType,
    showCursor,
    hideCursor,
    onClickEffect,
    initCursor,
    disableCursor
  }
}

/**
 * Directive Vue pour marquer les éléments comme interactifs avec le curseur
 */
export const vCursorInteractive = {
  mounted(el: HTMLElement, binding: any) {
    el.classList.add('interactive')
    
    if (binding.value?.type) {
      el.setAttribute('data-cursor-type', binding.value.type)
    }
  },
  
  unmounted(el: HTMLElement) {
    el.classList.remove('interactive')
    el.removeAttribute('data-cursor-type')
  }
}