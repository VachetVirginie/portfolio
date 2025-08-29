import { ref, onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'

export function useScroll() {
  const lenis = ref<Lenis | null>(null)
  const scrollY = ref(0)
  const isScrolling = ref(false)

  // Initialiser Lenis pour le smooth scroll
  const initSmoothScroll = () => {
    lenis.value = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    })

    // Synchroniser avec les événements de scroll
    lenis.value.on('scroll', (data: any) => {
      scrollY.value = data.scroll
      isScrolling.value = Math.abs(data.velocity) > 0.1
    })

    // Fonction de mise à jour
    function raf(time: number) {
      lenis.value?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }

  // Faire défiler vers un élément
  const scrollTo = (target: string | number | HTMLElement, options = {}) => {
    if (lenis.value) {
      lenis.value.scrollTo(target, {
        duration: 1.5,
        ...options
      })
    }
  }

  // Faire défiler vers le haut
  const scrollToTop = () => {
    scrollTo(0)
  }

  // Faire défiler vers une section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      scrollTo(element, { offset: -80 })
    }
  }

  // Arrêter le scroll
  const stopScroll = () => {
    lenis.value?.stop()
  }

  // Reprendre le scroll
  const startScroll = () => {
    lenis.value?.start()
  }

  // Détruire l'instance
  const destroy = () => {
    lenis.value?.destroy()
    lenis.value = null
  }

  // Obtenir la position de scroll actuelle
  const getScrollPosition = () => {
    return scrollY.value
  }

  // Vérifier si on est en haut de la page
  const isAtTop = () => {
    return scrollY.value < 50
  }

  // Vérifier si on est en bas de la page
  const isAtBottom = () => {
    if (!lenis.value) return false
    return scrollY.value >= (document.documentElement.scrollHeight - window.innerHeight - 50)
  }

  onMounted(() => {
    initSmoothScroll()
  })

  onUnmounted(() => {
    destroy()
  })

  return {
    lenis,
    scrollY,
    isScrolling,
    scrollTo,
    scrollToTop,
    scrollToSection,
    stopScroll,
    startScroll,
    getScrollPosition,
    isAtTop,
    isAtBottom,
    destroy
  }
}