<template>
  <div class="animated-tech-icon" :class="`animated-tech-icon--${variant}`">
    <!-- Vue.js Icon -->
    <svg 
      v-if="icon === 'vue'"
      class="tech-icon"
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        class="icon-path icon-path--primary"
        d="M2 3h3.5L12 15l6.5-12H22L12 21 2 3z" 
        fill="url(#vue-gradient)"
      />
      <path 
        class="icon-path icon-path--secondary"
        d="M6 3l6 10.5L18 3h-2.5L12 7.5 8.5 3H6z" 
        fill="url(#vue-gradient-2)"
      />
      <defs>
        <linearGradient id="vue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#41b883" />
          <stop offset="100%" stop-color="#35495e" />
        </linearGradient>
        <linearGradient id="vue-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#35495e" />
          <stop offset="100%" stop-color="#41b883" />
        </linearGradient>
      </defs>
    </svg>

    <!-- React Icon -->
    <svg 
      v-else-if="icon === 'react'"
      class="tech-icon"
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g class="react-orbits">
        <ellipse class="orbit orbit-1" cx="12" cy="12" rx="8" ry="3" stroke="url(#react-gradient)" stroke-width="1.5" fill="none" />
        <ellipse class="orbit orbit-2" cx="12" cy="12" rx="8" ry="3" stroke="url(#react-gradient)" stroke-width="1.5" fill="none" transform="rotate(60 12 12)" />
        <ellipse class="orbit orbit-3" cx="12" cy="12" rx="8" ry="3" stroke="url(#react-gradient)" stroke-width="1.5" fill="none" transform="rotate(120 12 12)" />
      </g>
      <circle class="nucleus" cx="12" cy="12" r="2" fill="url(#react-gradient)" />
      <defs>
        <linearGradient id="react-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#61dafb" />
          <stop offset="100%" stop-color="#21759b" />
        </linearGradient>
      </defs>
    </svg>

    <!-- TypeScript Icon -->
    <svg 
      v-else-if="icon === 'typescript'"
      class="tech-icon"
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect class="ts-bg" x="2" y="2" width="20" height="20" rx="2" fill="url(#ts-gradient)" />
      <path class="ts-text" d="M12 8v8m-4-4h8M8 8h8" stroke="white" stroke-width="2" stroke-linecap="round" />
      <text class="ts-letter" x="12" y="16" text-anchor="middle" fill="white" font-family="monospace" font-size="8" font-weight="bold">TS</text>
      <defs>
        <linearGradient id="ts-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3178c6" />
          <stop offset="100%" stop-color="#235a97" />
        </linearGradient>
      </defs>
    </svg>

    <!-- JavaScript Icon -->
    <svg 
      v-else-if="icon === 'javascript'"
      class="tech-icon"
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect class="js-bg" x="2" y="2" width="20" height="20" rx="2" fill="url(#js-gradient)" />
      <text class="js-letter" x="12" y="16" text-anchor="middle" fill="#000" font-family="monospace" font-size="10" font-weight="bold">JS</text>
      <defs>
        <linearGradient id="js-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f7df1e" />
          <stop offset="100%" stop-color="#e6c200" />
        </linearGradient>
      </defs>
    </svg>

    <!-- CSS Icon -->
    <svg 
      v-else-if="icon === 'css'"
      class="tech-icon"
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path class="css-shape" d="M3 2l1.5 18L12 22l7.5-2L21 2H3z" fill="url(#css-gradient)" />
      <path class="css-inner" d="M12 4v16l5.5-1.5L18.5 4H12z" fill="url(#css-gradient-2)" />
      <defs>
        <linearGradient id="css-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1572b6" />
          <stop offset="100%" stop-color="#33a9dc" />
        </linearGradient>
        <linearGradient id="css-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#33a9dc" />
          <stop offset="100%" stop-color="#1572b6" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Floating particles -->
    <div class="floating-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: 'vue' | 'react' | 'typescript' | 'javascript' | 'css'
  variant?: 'default' | 'large' | 'small'
  animated?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  animated: true
})
</script>

<style scoped>
.animated-tech-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.animated-tech-icon--small {
  width: 40px;
  height: 40px;
}

.animated-tech-icon--large {
  width: 80px;
  height: 80px;
}

.tech-icon {
  width: 32px;
  height: 32px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.animated-tech-icon--small .tech-icon {
  width: 24px;
  height: 24px;
}

.animated-tech-icon--large .tech-icon {
  width: 48px;
  height: 48px;
}

/* Hover effects */
.animated-tech-icon:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(221, 48, 92, 0.1);
}

.animated-tech-icon:hover .tech-icon {
  transform: scale(1.1) rotate(5deg);
}

/* React specific animations */
.react-orbits {
  animation: react-spin 8s linear infinite;
}

.orbit {
  opacity: 0.8;
  animation: orbit-pulse 2s ease-in-out infinite alternate;
}

.orbit-2 {
  animation-delay: -0.7s;
}

.orbit-3 {
  animation-delay: -1.4s;
}

.nucleus {
  animation: nucleus-pulse 1.5s ease-in-out infinite alternate;
}

/* Vue specific animations */
.icon-path--primary {
  animation: vue-glow 3s ease-in-out infinite alternate;
}

.icon-path--secondary {
  animation: vue-glow 3s ease-in-out infinite alternate;
  animation-delay: -1.5s;
}

/* TypeScript/JavaScript animations */
.ts-bg, .js-bg {
  animation: bg-pulse 2s ease-in-out infinite alternate;
}

.ts-letter, .js-letter {
  animation: text-bounce 2s ease-in-out infinite;
}

/* CSS specific animations */
.css-shape {
  animation: css-wave 3s ease-in-out infinite;
}

/* Floating particles */
.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.animated-tech-icon:hover .floating-particles {
  opacity: 1;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(221, 48, 92, 0.6);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

.particle-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.particle-2 {
  top: 60%;
  right: 20%;
  animation-delay: -1s;
  background: rgba(255, 64, 129, 0.6);
}

.particle-3 {
  bottom: 20%;
  left: 50%;
  animation-delay: -2s;
  background: rgba(255, 255, 255, 0.4);
}

/* Keyframe animations */
@keyframes react-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes orbit-pulse {
  from { opacity: 0.4; }
  to { opacity: 0.8; }
}

@keyframes nucleus-pulse {
  from { transform: scale(1); }
  to { transform: scale(1.2); }
}

@keyframes vue-glow {
  from { filter: brightness(1); }
  to { filter: brightness(1.2) drop-shadow(0 0 5px rgba(65, 184, 131, 0.3)); }
}

@keyframes bg-pulse {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}

@keyframes text-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

@keyframes css-wave {
  0%, 100% { transform: skewX(0deg); }
  50% { transform: skewX(2deg); }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
    opacity: 1;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animated-tech-icon,
  .tech-icon,
  .react-orbits,
  .orbit,
  .nucleus,
  .icon-path,
  .ts-bg,
  .js-bg,
  .ts-letter,
  .js-letter,
  .css-shape,
  .particle {
    animation: none !important;
    transition: none !important;
  }
  
  .animated-tech-icon:hover {
    transform: none;
  }
  
  .animated-tech-icon:hover .tech-icon {
    transform: none;
  }
}
</style>