<template>
  <div 
    class="animated-project-card"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    ref="cardRef"
    :style="optimizedStyles"
  >
    <!-- Animated Background Elements -->
    <div class="card-bg-effects">
      <!-- Floating Particles -->
      <svg class="bg-particles" viewBox="0 0 200 200" v-if="showParticles">
        <circle 
          v-for="(particle, index) in particles" 
          :key="index"
          :cx="particle.x" 
          :cy="particle.y" 
          :r="particle.r"
          :fill="particle.color"
          class="particle"
          :style="{ animationDelay: `${particle.delay}s` }"
        />
      </svg>
      
      <!-- Animated Border -->
      <svg class="animated-border" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect 
          x="1" y="1" 
          width="98" height="98" 
          fill="none" 
          stroke="url(#borderGradient)" 
          stroke-width="0.5"
          class="border-rect"
        />
        <defs>
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.3" />
            <stop offset="50%" stop-color="var(--color-accent)" stop-opacity="0.6" />
            <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
      
      <!-- Corner Decorations -->
      <svg class="corner-decoration corner-decoration--tl" viewBox="0 0 20 20">
        <path 
          d="M2 2 L18 2 L18 18" 
          fill="none" 
          stroke="var(--color-accent)" 
          stroke-width="1"
          class="corner-line"
        />
      </svg>
      
      <svg class="corner-decoration corner-decoration--br" viewBox="0 0 20 20">
        <path 
          d="M18 18 L2 18 L2 2" 
          fill="none" 
          stroke="var(--color-accent)" 
          stroke-width="1"
          class="corner-line"
        />
      </svg>
    </div>
    
    <!-- Loading State Animation -->
    <div class="loading-overlay" v-if="isLoading">
      <svg class="loading-spinner" viewBox="0 0 50 50">
        <circle 
          cx="25" cy="25" r="20" 
          fill="none" 
          stroke="var(--color-primary)" 
          stroke-width="2"
          stroke-linecap="round"
          class="spinner-circle"
        />
      </svg>
    </div>
    
    <!-- Card Content Slot -->
    <div class="card-content">
      <slot></slot>
    </div>
    
    <!-- Hover Effect Overlay -->
    <div class="hover-overlay">
      <svg class="hover-icon" viewBox="0 0 24 24">
        <path 
          d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" 
          fill="var(--color-accent)"
          class="star-icon"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSVGAnimations } from '@/composables/useSVGAnimations'

interface Props {
  showParticles?: boolean
  isLoading?: boolean
  variant?: 'default' | 'featured' | 'minimal'
}

const props = withDefaults(defineProps<Props>(), {
  showParticles: true,
  isLoading: false,
  variant: 'default'
})

const cardRef = ref<HTMLElement>()
const isHovered = ref(false)

const { 
  prefersReducedMotion, 
  getOptimizedAnimationStyles, 
  getAdaptiveAnimationConfig,
  createIntersectionObserver 
} = useSVGAnimations()

const animationConfig = getAdaptiveAnimationConfig()
const optimizedStyles = computed(() => getOptimizedAnimationStyles())

// Particules flottantes optimisées
const particles = computed(() => {
  if (!props.showParticles || prefersReducedMotion.value) return []
  
  const particleCount = animationConfig.particleCount / 2 // Réduire pour les cartes
  
  return Array.from({ length: particleCount }, (_, i) => ({
    x: 20 + (i * 30) + Math.random() * 10,
    y: 20 + (i * 25) + Math.random() * 10,
    r: 1 + Math.random() * 2,
    color: i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-accent)',
    delay: i * 0.2
  }))
})

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}

onMounted(() => {
  if (cardRef.value) {
    // Intersection observer pour optimiser les performances
    createIntersectionObserver(cardRef.value, 0.1)
    
    // Animation d'entrée seulement si les animations ne sont pas réduites
    if (!prefersReducedMotion.value) {
      cardRef.value.style.opacity = '0'
      cardRef.value.style.transform = 'translateY(20px)'
      
      setTimeout(() => {
        if (cardRef.value) {
          cardRef.value.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          cardRef.value.style.opacity = '1'
          cardRef.value.style.transform = 'translateY(0)'
        }
      }, 100)
    }
  }
})
</script>

<style scoped>
.animated-project-card {
  position: relative;
  background: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.animated-project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Background Effects */
.card-bg-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.bg-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

.particle {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Animated Border */
.animated-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.animated-project-card:hover .animated-border {
  opacity: 1;
}

.border-rect {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawBorder 2s ease-in-out infinite;
}

@keyframes drawBorder {
  0% { stroke-dashoffset: 200; }
  50% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -200; }
}

/* Corner Decorations */
.corner-decoration {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.corner-decoration--tl {
  top: 8px;
  left: 8px;
}

.corner-decoration--br {
  bottom: 8px;
  right: 8px;
}

.animated-project-card:hover .corner-decoration {
  opacity: 1;
}

.corner-line {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  animation: drawCorner 1s ease-out;
}

@keyframes drawCorner {
  to { stroke-dashoffset: 0; }
}

/* Loading State */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  stroke-dasharray: 126;
  stroke-dashoffset: 126;
  animation: loading 2s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes loading {
  0% { stroke-dashoffset: 126; }
  50% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -126; }
}

/* Card Content */
.card-content {
  position: relative;
  z-index: 2;
  padding: 1.5rem;
}

/* Hover Overlay */
.hover-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 3;
}

.animated-project-card:hover .hover-overlay {
  opacity: 1;
  transform: scale(1);
}

.hover-icon {
  width: 24px;
  height: 24px;
}

.star-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-content {
    padding: 1rem;
  }
  
  .bg-particles {
    opacity: 0.3;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .animated-project-card,
  .particle,
  .border-rect,
  .corner-line,
  .loading-spinner,
  .spinner-circle,
  .star-icon {
    animation: none;
  }
  
  .animated-project-card:hover {
    transform: none;
  }
}
</style>