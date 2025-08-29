<template>
  <div class="animated-stats" ref="statsContainer">
    <div class="stats-grid">
      <div class="stat-item" v-for="stat in stats" :key="stat.id">
        <div class="stat-number" :class="{ 'animate': isVisible }">
          {{ animatedValues[stat.id] }}{{ stat.suffix }}
        </div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

interface Stat {
  id: string
  value: number
  suffix: string
  label: string
  duration: number
}

const statsContainer = ref<HTMLElement>()
const isVisible = ref(false)

const stats: Stat[] = [
  {
    id: 'experience',
    value: 3,
    suffix: '+',
    label: 'Années d\'expérience',
    duration: 2000
  },
  {
    id: 'projects',
    value: 7,
    suffix: '+',
    label: 'Projets réalisés',
    duration: 1800
  },
  {
    id: 'hours',
    value: 10000,
    suffix: '+',
    label: 'Heures de code',
    duration: 2500
  }
]

const animatedValues = reactive<Record<string, number>>({
  experience: 0,
  projects: 0,
  hours: 0
})

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

function animateValue(stat: Stat) {
  const startTime = Date.now()
  const startValue = 0
  const endValue = stat.value
  
  function update() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / stat.duration, 1)
    const easedProgress = easeOutQuart(progress)
    
    animatedValues[stat.id] = Math.floor(startValue + (endValue - startValue) * easedProgress)
    
    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      animatedValues[stat.id] = endValue
    }
  }
  
  requestAnimationFrame(update)
}

function startAnimations() {
  if (isVisible.value) return
  
  isVisible.value = true
  stats.forEach((stat, index) => {
    setTimeout(() => {
      animateValue(stat)
    }, index * 200) // Décalage pour un effet en cascade
  })
}

function handleScroll() {
  if (!statsContainer.value || isVisible.value) return
  
  const rect = statsContainer.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  
  // Déclencher l'animation quand l'élément est visible à 70%
  if (rect.top < windowHeight * 0.7 && rect.bottom > 0) {
    startAnimations()
  }
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  // Utiliser Intersection Observer pour une meilleure performance
  if ('IntersectionObserver' in window && statsContainer.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            startAnimations()
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    )
    
    observer.observe(statsContainer.value)
  } else {
    // Fallback pour les navigateurs plus anciens
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Vérifier immédiatement
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  } else {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.animated-stats {
  padding: 4rem 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin: 2rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.stat-item {
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.stat-item.animate,
.animate .stat-item {
  opacity: 1;
  transform: translateY(0);
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #DD305C, #FF4081, #E91E63);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(221, 48, 92, 0.5);
  margin-bottom: 0.5rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.02em;
  position: relative;
}

.stat-number::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #DD305C, #FF4081);
  opacity: 0;
  border-radius: 10px;
  filter: blur(20px);
  z-index: -1;
  transition: opacity 0.3s ease;
}

.stat-number:hover::after {
  opacity: 0.2;
}

.stat-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.5rem;
}

/* Animation en cascade */
.animate .stat-item:nth-child(1) {
  transition-delay: 0s;
}

.animate .stat-item:nth-child(2) {
  transition-delay: 0.2s;
}

.animate .stat-item:nth-child(3) {
  transition-delay: 0.4s;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .animated-stats {
    padding: 2rem 0;
    margin: 1rem;
  }
}

@media (max-width: 480px) {
  .stat-number {
    font-size: 2rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
  }
}
</style>