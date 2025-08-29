<template>
  <div class="section-divider" :class="`section-divider--${type}`">
    <!-- Wave divider -->
    <svg 
      v-if="type === 'wave'"
      class="divider-svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path 
        class="wave-path"
        d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
        fill="url(#wave-gradient)"
      />
      <path 
        class="wave-path wave-path--overlay"
        d="M0,80 C400,20 800,100 1200,40 L1200,120 L0,120 Z"
        fill="url(#wave-gradient-2)"
        opacity="0.6"
      />
      <defs>
        <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(221, 48, 92, 0.1)" />
          <stop offset="50%" stop-color="rgba(255, 64, 129, 0.2)" />
          <stop offset="100%" stop-color="rgba(221, 48, 92, 0.1)" />
        </linearGradient>
        <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(255, 255, 255, 0.05)" />
          <stop offset="50%" stop-color="rgba(255, 255, 255, 0.1)" />
          <stop offset="100%" stop-color="rgba(255, 255, 255, 0.05)" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Geometric lines -->
    <svg 
      v-else-if="type === 'geometric'"
      class="divider-svg"
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
    >
      <!-- Main line -->
      <line 
        class="geo-line main-line"
        x1="0" 
        y1="40" 
        x2="1200" 
        y2="40" 
        stroke="url(#geo-gradient)"
        stroke-width="2"
      />
      
      <!-- Decorative elements -->
      <g class="geo-decorations">
        <circle class="geo-dot" cx="200" cy="40" r="4" fill="url(#dot-gradient)" />
        <circle class="geo-dot" cx="600" cy="40" r="6" fill="url(#dot-gradient)" />
        <circle class="geo-dot" cx="1000" cy="40" r="4" fill="url(#dot-gradient)" />
        
        <polygon class="geo-triangle" points="400,30 420,50 380,50" fill="url(#triangle-gradient)" />
        <polygon class="geo-triangle" points="800,25 825,55 775,55" fill="url(#triangle-gradient)" />
      </g>
      
      <defs>
        <linearGradient id="geo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(221, 48, 92, 0)" />
          <stop offset="20%" stop-color="rgba(221, 48, 92, 0.6)" />
          <stop offset="50%" stop-color="rgba(255, 64, 129, 0.8)" />
          <stop offset="80%" stop-color="rgba(221, 48, 92, 0.6)" />
          <stop offset="100%" stop-color="rgba(221, 48, 92, 0)" />
        </linearGradient>
        <radialGradient id="dot-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255, 255, 255, 0.8)" />
          <stop offset="100%" stop-color="rgba(221, 48, 92, 0.6)" />
        </radialGradient>
        <linearGradient id="triangle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(255, 64, 129, 0.7)" />
          <stop offset="100%" stop-color="rgba(221, 48, 92, 0.4)" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Particles flow -->
    <svg 
      v-else-if="type === 'particles'"
      class="divider-svg"
      viewBox="0 0 1200 100"
      preserveAspectRatio="none"
    >
      <!-- Flowing particles -->
      <g class="particle-flow">
        <circle class="particle particle-1" cx="100" cy="50" r="3" fill="rgba(221, 48, 92, 0.6)" />
        <circle class="particle particle-2" cx="200" cy="30" r="2" fill="rgba(255, 64, 129, 0.5)" />
        <circle class="particle particle-3" cx="300" cy="70" r="4" fill="rgba(255, 255, 255, 0.4)" />
        <circle class="particle particle-4" cx="450" cy="40" r="2.5" fill="rgba(221, 48, 92, 0.7)" />
        <circle class="particle particle-5" cx="600" cy="60" r="3.5" fill="rgba(255, 64, 129, 0.6)" />
        <circle class="particle particle-6" cx="750" cy="35" r="2" fill="rgba(183, 28, 28, 0.5)" />
        <circle class="particle particle-7" cx="900" cy="65" r="3" fill="rgba(255, 255, 255, 0.3)" />
        <circle class="particle particle-8" cx="1050" cy="45" r="2.5" fill="rgba(221, 48, 92, 0.5)" />
      </g>
      
      <!-- Connection lines -->
      <g class="particle-connections">
        <path 
          class="connection-line"
          d="M100,50 Q200,30 300,70 T600,60 T900,65 T1050,45"
          fill="none"
          stroke="url(#connection-gradient)"
          stroke-width="1"
          opacity="0.3"
        />
      </g>
      
      <defs>
        <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(221, 48, 92, 0)" />
          <stop offset="50%" stop-color="rgba(221, 48, 92, 0.6)" />
          <stop offset="100%" stop-color="rgba(221, 48, 92, 0)" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Minimal dots -->
    <div v-else-if="type === 'dots'" class="dots-divider">
      <div class="dot-line">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
        <div class="dot dot-4"></div>
        <div class="dot dot-5"></div>
      </div>
    </div>

    <!-- Gradient line -->
    <div v-else class="gradient-line">
      <div class="line-segment segment-1"></div>
      <div class="line-segment segment-2"></div>
      <div class="line-segment segment-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'wave' | 'geometric' | 'particles' | 'dots' | 'gradient'
  height?: 'small' | 'medium' | 'large'
  animated?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'gradient',
  height: 'medium',
  animated: true
})
</script>

<style scoped>
.section-divider {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Height variations */
.section-divider--small {
  height: 40px;
}

.section-divider--medium {
  height: 80px;
}

.section-divider--large {
  height: 120px;
}

/* SVG dividers */
.divider-svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* Wave animations */
.wave-path {
  animation: wave-flow 8s ease-in-out infinite;
}

.wave-path--overlay {
  animation: wave-flow 10s ease-in-out infinite reverse;
  animation-delay: -2s;
}

/* Geometric animations */
.main-line {
  animation: line-glow 3s ease-in-out infinite alternate;
}

.geo-dot {
  animation: dot-pulse 2s ease-in-out infinite;
}

.geo-dot:nth-child(2) {
  animation-delay: -0.5s;
}

.geo-dot:nth-child(3) {
  animation-delay: -1s;
}

.geo-triangle {
  animation: triangle-rotate 4s ease-in-out infinite;
}

.geo-triangle:nth-child(5) {
  animation-delay: -2s;
}

/* Particle animations */
.particle {
  animation: particle-float 6s ease-in-out infinite;
}

.particle-1 { animation-delay: 0s; }
.particle-2 { animation-delay: -0.5s; }
.particle-3 { animation-delay: -1s; }
.particle-4 { animation-delay: -1.5s; }
.particle-5 { animation-delay: -2s; }
.particle-6 { animation-delay: -2.5s; }
.particle-7 { animation-delay: -3s; }
.particle-8 { animation-delay: -3.5s; }

.connection-line {
  animation: connection-flow 4s ease-in-out infinite;
}

/* Dots divider */
.dots-divider {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dot-line {
  display: flex;
  gap: 12px;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(221, 48, 92, 0.6);
  animation: dot-wave 2s ease-in-out infinite;
}

.dot-2 {
  animation-delay: -0.2s;
  background: rgba(255, 64, 129, 0.6);
}

.dot-3 {
  animation-delay: -0.4s;
  background: rgba(255, 255, 255, 0.4);
  width: 10px;
  height: 10px;
}

.dot-4 {
  animation-delay: -0.6s;
  background: rgba(255, 64, 129, 0.6);
}

.dot-5 {
  animation-delay: -0.8s;
  background: rgba(221, 48, 92, 0.6);
}

/* Gradient line */
.gradient-line {
  width: 100%;
  height: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.line-segment {
  height: 2px;
  border-radius: 1px;
  animation: segment-glow 3s ease-in-out infinite;
}

.segment-1 {
  width: 60px;
  background: linear-gradient(90deg, transparent, rgba(221, 48, 92, 0.6), transparent);
  animation-delay: 0s;
}

.segment-2 {
  width: 80px;
  background: linear-gradient(90deg, transparent, rgba(255, 64, 129, 0.8), transparent);
  animation-delay: -1s;
}

.segment-3 {
  width: 60px;
  background: linear-gradient(90deg, transparent, rgba(221, 48, 92, 0.6), transparent);
  animation-delay: -2s;
}

/* Keyframe animations */
@keyframes wave-flow {
  0%, 100% {
    d: path("M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z");
  }
  50% {
    d: path("M0,40 C300,0 900,120 1200,80 L1200,120 L0,120 Z");
  }
}

@keyframes line-glow {
  from {
    filter: drop-shadow(0 0 2px rgba(221, 48, 92, 0.3));
  }
  to {
    filter: drop-shadow(0 0 8px rgba(221, 48, 92, 0.6));
  }
}

@keyframes dot-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}

@keyframes triangle-rotate {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
}

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0px);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

@keyframes connection-flow {
  0% {
    stroke-dasharray: 0 1000;
  }
  50% {
    stroke-dasharray: 500 500;
  }
  100% {
    stroke-dasharray: 1000 0;
  }
}

@keyframes dot-wave {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes segment-glow {
  0%, 100% {
    opacity: 0.4;
    transform: scaleX(1);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.1);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .section-divider--small {
    height: 30px;
  }
  
  .section-divider--medium {
    height: 60px;
  }
  
  .section-divider--large {
    height: 80px;
  }
  
  .dot {
    width: 6px;
    height: 6px;
  }
  
  .dot-3 {
    width: 8px;
    height: 8px;
  }
  
  .dot-line {
    gap: 8px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .wave-path,
  .main-line,
  .geo-dot,
  .geo-triangle,
  .particle,
  .connection-line,
  .dot,
  .line-segment {
    animation: none !important;
  }
}
</style>