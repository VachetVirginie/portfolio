import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

/**
 * Composable pour gérer les animations de chargement
 * Inclut skeletons, spinners et états de chargement
 */
export function useLoadingAnimations() {
  const isLoading = ref(false)
  const loadingProgress = ref(0)
  const loadingMessage = ref('')
  const loadingType = ref<'spinner' | 'skeleton' | 'progress' | 'pulse'>('spinner')

  // Animation de spinner
  const createSpinnerAnimation = (element: HTMLElement) => {
    return gsap.to(element, {
      rotation: 360,
      duration: 1,
      ease: 'none',
      repeat: -1
    })
  }

  // Animation de skeleton (shimmer effect)
  const createSkeletonAnimation = (element: HTMLElement) => {
    const shimmer = element.querySelector('.skeleton-shimmer') as HTMLElement
    if (!shimmer) return

    return gsap.fromTo(shimmer, 
      {
        x: '-100%',
        opacity: 0
      },
      {
        x: '100%',
        opacity: 1,
        duration: 1.5,
        ease: 'power2.inOut',
        repeat: -1
      }
    )
  }

  // Animation de pulse
  const createPulseAnimation = (element: HTMLElement) => {
    return gsap.to(element, {
      opacity: 0.5,
      duration: 1,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true
    })
  }

  // Animation de barre de progression
  const createProgressAnimation = (element: HTMLElement, progress: number) => {
    const progressBar = element.querySelector('.progress-bar') as HTMLElement
    if (!progressBar) return

    return gsap.to(progressBar, {
      width: `${progress}%`,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  // Démarrer le chargement
  const startLoading = (type: typeof loadingType.value = 'spinner', message = 'Chargement...') => {
    isLoading.value = true
    loadingType.value = type
    loadingMessage.value = message
    loadingProgress.value = 0
  }

  // Mettre à jour le progrès
  const updateProgress = (progress: number, message?: string) => {
    loadingProgress.value = Math.min(100, Math.max(0, progress))
    if (message) {
      loadingMessage.value = message
    }
  }

  // Terminer le chargement
  const finishLoading = () => {
    loadingProgress.value = 100
    setTimeout(() => {
      isLoading.value = false
      loadingProgress.value = 0
      loadingMessage.value = ''
    }, 500)
  }

  // Simuler un chargement progressif
  const simulateLoading = async (steps: { progress: number; message: string; delay: number }[]) => {
    startLoading('progress')
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay))
      updateProgress(step.progress, step.message)
    }
    
    finishLoading()
  }

  // Classes CSS calculées
  const loadingClasses = computed(() => ({
    'is-loading': isLoading.value,
    [`loading-${loadingType.value}`]: true
  }))

  return {
    // État
    isLoading,
    loadingProgress,
    loadingMessage,
    loadingType,
    loadingClasses,
    
    // Méthodes
    startLoading,
    updateProgress,
    finishLoading,
    simulateLoading,
    createSpinnerAnimation,
    createSkeletonAnimation,
    createPulseAnimation,
    createProgressAnimation
  }
}

/**
 * Composable pour créer des composants skeleton
 */
export function useSkeletonLoader() {
  const createSkeletonElement = (config: {
    width?: string
    height?: string
    borderRadius?: string
    className?: string
  }) => {
    const { width = '100%', height = '20px', borderRadius = '4px', className = '' } = config
    
    const skeleton = document.createElement('div')
    skeleton.className = `skeleton-loader ${className}`
    skeleton.style.cssText = `
      width: ${width};
      height: ${height};
      border-radius: ${borderRadius};
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-shimmer 1.5s infinite;
      position: relative;
      overflow: hidden;
    `
    
    return skeleton
  }

  const createTextSkeleton = (lines: number = 3, lastLineWidth: string = '60%') => {
    const container = document.createElement('div')
    container.className = 'skeleton-text'
    
    for (let i = 0; i < lines; i++) {
      const line = createSkeletonElement({
        height: '16px',
        width: i === lines - 1 ? lastLineWidth : '100%',
        className: 'skeleton-text-line'
      })
      line.style.marginBottom = '8px'
      container.appendChild(line)
    }
    
    return container
  }

  const createCardSkeleton = () => {
    const card = document.createElement('div')
    card.className = 'skeleton-card'
    card.style.cssText = `
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: white;
    `
    
    // Image skeleton
    const image = createSkeletonElement({
      width: '100%',
      height: '200px',
      borderRadius: '4px'
    })
    image.style.marginBottom = '16px'
    card.appendChild(image)
    
    // Title skeleton
    const title = createSkeletonElement({
      width: '80%',
      height: '24px'
    })
    title.style.marginBottom = '12px'
    card.appendChild(title)
    
    // Text skeleton
    const text = createTextSkeleton(3)
    card.appendChild(text)
    
    return card
  }

  return {
    createSkeletonElement,
    createTextSkeleton,
    createCardSkeleton
  }
}

/**
 * Hook pour gérer le chargement des images avec placeholder
 */
export function useImageLoader() {
  const loadedImages = ref(new Set<string>())
  const failedImages = ref(new Set<string>())
  const loadingImages = ref(new Set<string>())

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.value.has(src)) {
        const img = new Image()
        img.src = src
        resolve(img)
        return
      }

      if (failedImages.value.has(src)) {
        reject(new Error(`Image failed to load: ${src}`))
        return
      }

      loadingImages.value.add(src)
      
      const img = new Image()
      
      img.onload = () => {
        loadedImages.value.add(src)
        loadingImages.value.delete(src)
        resolve(img)
      }
      
      img.onerror = () => {
        failedImages.value.add(src)
        loadingImages.value.delete(src)
        reject(new Error(`Failed to load image: ${src}`))
      }
      
      img.src = src
    })
  }

  const preloadImages = async (urls: string[]) => {
    const promises = urls.map(url => loadImage(url).catch(() => null))
    return Promise.all(promises)
  }

  const isImageLoaded = (src: string) => loadedImages.value.has(src)
  const isImageLoading = (src: string) => loadingImages.value.has(src)
  const isImageFailed = (src: string) => failedImages.value.has(src)

  return {
    loadedImages,
    failedImages,
    loadingImages,
    loadImage,
    preloadImages,
    isImageLoaded,
    isImageLoading,
    isImageFailed
  }
}