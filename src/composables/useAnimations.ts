import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Enregistrer le plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

export function useAnimations() {
  const isLoaded = ref(false)

  // Animation d'entrée pour les éléments
  const animateIn = (element: string | Element, options = {}) => {
    const defaultOptions = {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power2.out',
      ...options
    }

    return gsap.fromTo(element, 
      { 
        y: defaultOptions.y, 
        opacity: defaultOptions.opacity 
      },
      {
        y: 0,
        opacity: 1,
        duration: defaultOptions.duration,
        ease: defaultOptions.ease
      }
    )
  }

  // Animation de révélation au scroll
  const revealOnScroll = (element: string | Element, options = {}) => {
    const defaultOptions = {
      duration: 1,
      y: 100,
      opacity: 0,
      ease: 'power2.out',
      trigger: element,
      start: 'top 80%',
      ...options
    }

    return gsap.fromTo(element,
      {
        y: defaultOptions.y,
        opacity: defaultOptions.opacity
      },
      {
        y: 0,
        opacity: 1,
        duration: defaultOptions.duration,
        ease: defaultOptions.ease,
        scrollTrigger: {
          trigger: defaultOptions.trigger,
          start: defaultOptions.start,
          toggleActions: 'play none none reverse'
        }
      }
    )
  }

  // Animation de texte lettre par lettre
  const animateText = (element: string | Element, options = {}) => {
    const defaultOptions = {
      duration: 0.05,
      stagger: 0.05,
      ease: 'power2.out',
      ...options
    }

    const tl = gsap.timeline()
    
    // Diviser le texte en spans pour chaque lettre
    const textElement = typeof element === 'string' ? document.querySelector(element) : element
    if (textElement && textElement.textContent) {
      const text = textElement.textContent
      textElement.innerHTML = text
        .split('')
        .map(char => char === ' ' ? ' ' : `<span class="char">${char}</span>`)
        .join('')

      tl.fromTo('.char', 
        { 
          y: 100, 
          opacity: 0 
        },
        {
          y: 0,
          opacity: 1,
          duration: defaultOptions.duration,
          stagger: defaultOptions.stagger,
          ease: defaultOptions.ease
        }
      )
    }

    return tl
  }

  // Animation de parallax
  const parallax = (element: string | Element, speed = 0.5) => {
    return gsap.to(element, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
  }

  // Animation de rotation continue
  const rotate = (element: string | Element, duration = 10) => {
    return gsap.to(element, {
      rotation: 360,
      duration,
      ease: 'none',
      repeat: -1
    })
  }

  // Timeline principale pour les animations de page
  const createPageTimeline = () => {
    const tl = gsap.timeline({ paused: true })
    return tl
  }

  // Nettoyage des animations
  const cleanup = () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    gsap.killTweensOf('*')
  }

  onMounted(() => {
    isLoaded.value = true
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    isLoaded,
    animateIn,
    revealOnScroll,
    animateText,
    parallax,
    rotate,
    createPageTimeline,
    cleanup,
    gsap,
    ScrollTrigger
  }
}