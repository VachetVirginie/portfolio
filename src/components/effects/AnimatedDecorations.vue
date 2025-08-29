<template>
  <div 
    class="animated-decorations" 
    ref="decorationsRef"
    :style="optimizedStyles"
    :data-intensity="adaptiveIntensity"
  >
    <!-- Geometric shapes -->
    <div class="geometric-shapes">
      <!-- Floating triangles -->
      <svg class="shape shape-triangle shape-triangle-1" viewBox="0 0 100 100">
        <polygon 
          points="50,10 90,80 10,80" 
          fill="url(#triangle-gradient-1)"
          opacity="0.6"
        />
        <defs>
          <linearGradient id="triangle-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(221, 48, 92, 0.3)" />
            <stop offset="100%" stop-color="rgba(255, 64, 129, 0.1)" />
          </linearGradient>
        </defs>
      </svg>

      <svg class="shape shape-triangle shape-triangle-2" viewBox="0 0 100 100">
        <polygon 
          points="50,10 90,80 10,80" 
          fill="url(#triangle-gradient-2)"
          opacity="0.4"
        />
        <defs>
          <linearGradient id="triangle-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stop-color="rgba(221, 48, 92, 0.1)" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Floating circles -->
      <svg class="shape shape-circle shape-circle-1" viewBox="0 0 100 100">
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke="url(#circle-gradient-1)"
          stroke-width="2"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="circle-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(221, 48, 92, 0.6)" />
            <stop offset="100%" stop-color="rgba(255, 64, 129, 0.2)" />
          </linearGradient>
        </defs>
      </svg>

      <svg class="shape shape-circle shape-circle-2" viewBox="0 0 100 100">
        <circle 
          cx="50" 
          cy="50" 
          r="30" 
          fill="url(#circle-gradient-2)"
          opacity="0.3"
        />
        <defs>
          <radialGradient id="circle-gradient-2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.3)" />
            <stop offset="100%" stop-color="rgba(221, 48, 92, 0.1)" />
          </radialGradient>
        </defs>
      </svg>

      <!-- Hexagon -->
      <svg class="shape shape-hexagon" viewBox="0 0 100 100">
        <polygon 
          points="50,5 85,25 85,65 50,85 15,65 15,25" 
          fill="none" 
          stroke="url(#hexagon-gradient)"
          stroke-width="1.5"
          opacity="0.4"
        />
        <defs>
          <linearGradient id="hexagon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.4)" />
            <stop offset="50%" stop-color="rgba(221, 48, 92, 0.3)" />
            <stop offset="100%" stop-color="rgba(255, 64, 129, 0.2)" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Gradient orbs -->
    <div class="gradient-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="orb orb-4"></div>
    </div>

    <!-- Animated lines -->
    <div class="animated-lines">
      <svg class="line line-1" viewBox="0 0 200 2">
        <line 
          x1="0" 
          y1="1" 
          x2="200" 
          y2="1" 
          stroke="url(#line-gradient)"
          stroke-width="1"
          opacity="0.6"
        />
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(221, 48, 92, 0)" />
            <stop offset="50%" stop-color="rgba(221, 48, 92, 0.8)" />
            <stop offset="100%" stop-color="rgba(221, 48, 92, 0)" />
          </linearGradient>
        </defs>
      </svg>

      <svg class="line line-2" viewBox="0 0 150 2">
        <line 
          x1="0" 
          y1="1" 
          x2="150" 
          y2="1" 
          stroke="url(#line-gradient-2)"
          stroke-width="1"
          opacity="0.4"
        />
        <defs>
          <linearGradient id="line-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0)" />
            <stop offset="50%" stop-color="rgba(255, 255, 255, 0.6)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Floating dots -->
    <div class="floating-dots">
      <div class="dot dot-1"></div>
      <div class="dot dot-2"></div>
      <div class="dot dot-3"></div>
      <div class="dot dot-4"></div>
      <div class="dot dot-5"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSVGAnimations } from '@/composables/useSVGAnimations'

interface Props {
  intensity?: 'low' | 'medium' | 'high'
  variant?: 'hero' | 'section' | 'minimal'
}

const props = withDefaults(defineProps<Props>(), {
  intensity: 'medium',
  variant: 'hero'
})

const decorationsRef = ref<HTMLElement>()
const { 
  prefersReducedMotion, 
  getOptimizedAnimationStyles, 
  getAdaptiveAnimationConfig,
  createIntersectionObserver 
} = useSVGAnimations()

const animationConfig = getAdaptiveAnimationConfig()
const optimizedStyles = computed(() => getOptimizedAnimationStyles())

// Adapter l'intensité selon les performances
const adaptiveIntensity = computed(() => {
  if (prefersReducedMotion.value) return 'low'
  
  const baseIntensity = props.intensity
  const performance = animationConfig.enableComplexAnimations ? 'high' : 'medium'
  
  if (performance === 'high') return baseIntensity
  return baseIntensity === 'high' ? 'medium' : baseIntensity
})

onMounted(() => {
  if (decorationsRef.value) {
    createIntersectionObserver(decorationsRef.value, 0.1)
  }
})
</script>

<style scoped>
.animated-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

/* Geometric shapes */
.geometric-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  opacity: 0.6;
}

.shape-triangle-1 {
  width: 60px;
  height: 60px;
  top: 15%;
  right: 10%;
  animation: float-rotate 8s ease-in-out infinite;
}

.shape-triangle-2 {
  width: 40px;
  height: 40px;
  top: 60%;
  left: 5%;
  animation: float-rotate 10s ease-in-out infinite reverse;
  animation-delay: -2s;
}

.shape-circle-1 {
  width: 80px;
  height: 80px;
  top: 25%;
  left: 15%;
  animation: pulse-float 6s ease-in-out infinite;
}

.shape-circle-2 {
  width: 50px;
  height: 50px;
  bottom: 20%;
  right: 20%;
  animation: pulse-float 7s ease-in-out infinite;
  animation-delay: -3s;
}

.shape-hexagon {
  width: 70px;
  height: 70px;
  top: 45%;
  right: 25%;
  animation: rotate-slow 12s linear infinite;
}

/* Gradient orbs */
.gradient-orbs {
  position: absolute;
  width: 100%;
  height: 100%;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  animation: orb-float 8s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(221, 48, 92, 0.4) 0%, rgba(221, 48, 92, 0) 70%);
  top: 10%;
  left: -5%;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 64, 129, 0.3) 0%, rgba(255, 64, 129, 0) 70%);
  bottom: 15%;
  right: -5%;
  animation-delay: -2s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -4s;
}

.orb-4 {
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(183, 28, 28, 0.3) 0%, rgba(183, 28, 28, 0) 70%);
  top: 70%;
  left: 20%;
  animation-delay: -6s;
}

/* Animated lines */
.animated-lines {
  position: absolute;
  width: 100%;
  height: 100%;
}

.line {
  position: absolute;
  opacity: 0.6;
}

.line-1 {
  width: 200px;
  height: 2px;
  top: 30%;
  left: 20%;
  animation: line-slide 4s ease-in-out infinite;
}

.line-2 {
  width: 150px;
  height: 2px;
  bottom: 40%;
  right: 15%;
  animation: line-slide 5s ease-in-out infinite;
  animation-delay: -2s;
}

/* Floating dots */
.floating-dots {
  position: absolute;
  width: 100%;
  height: 100%;
}

.dot {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(221, 48, 92, 0.6);
  animation: dot-float 6s ease-in-out infinite;
}

.dot-1 {
  top: 20%;
  left: 30%;
  animation-delay: 0s;
}

.dot-2 {
  top: 40%;
  right: 30%;
  animation-delay: -1s;
  background: rgba(255, 64, 129, 0.6);
}

.dot-3 {
  bottom: 30%;
  left: 40%;
  animation-delay: -2s;
  background: rgba(255, 255, 255, 0.4);
}

.dot-4 {
  top: 60%;
  left: 60%;
  animation-delay: -3s;
  background: rgba(183, 28, 28, 0.5);
}

.dot-5 {
  bottom: 50%;
  right: 40%;
  animation-delay: -4s;
  background: rgba(221, 48, 92, 0.4);
}

/* Keyframe animations */
@keyframes float-rotate {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes pulse-float {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-15px) scale(1.1);
    opacity: 0.8;
  }
}

@keyframes rotate-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes orb-float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-10px) translateX(10px);
  }
  66% {
    transform: translateY(5px) translateX(-5px);
  }
}

@keyframes line-slide {
  0%, 100% {
    transform: translateX(0px);
    opacity: 0.6;
  }
  50% {
    transform: translateX(20px);
    opacity: 0.8;
  }
}

@keyframes dot-float {
  0%, 100% {
    transform: translateY(0px);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Variant styles */
.animated-decorations[data-variant="minimal"] .shape,
.animated-decorations[data-variant="minimal"] .orb,
.animated-decorations[data-variant="minimal"] .dot {
  opacity: 0.3;
}

.animated-decorations[data-variant="section"] {
  height: 200px;
}

.animated-decorations[data-variant="section"] .orb {
  filter: blur(20px);
}

/* Intensity variations */
.animated-decorations[data-intensity="low"] .shape,
.animated-decorations[data-intensity="low"] .orb,
.animated-decorations[data-intensity="low"] .dot {
  opacity: 0.2;
  animation-duration: 12s;
}

.animated-decorations[data-intensity="high"] .shape,
.animated-decorations[data-intensity="high"] .orb,
.animated-decorations[data-intensity="high"] .dot {
  opacity: 0.8;
  animation-duration: 4s;
}

/* Responsive design */
@media (max-width: 768px) {
  .shape-triangle-1,
  .shape-triangle-2 {
    width: 40px;
    height: 40px;
  }
  
  .shape-circle-1 {
    width: 60px;
    height: 60px;
  }
  
  .shape-circle-2 {
    width: 40px;
    height: 40px;
  }
  
  .shape-hexagon {
    width: 50px;
    height: 50px;
  }
  
  .orb-1,
  .orb-2 {
    width: 120px;
    height: 120px;
  }
  
  .orb-3,
  .orb-4 {
    width: 80px;
    height: 80px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .shape,
  .orb,
  .line,
  .dot {
    animation: none !important;
  }
}
</style>