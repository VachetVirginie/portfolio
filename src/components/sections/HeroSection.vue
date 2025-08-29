<template>
  <section ref="heroRef" class="hero">
    <!-- Background animé -->
    <div class="hero__background">
      <div class="hero__gradient"></div>
      <div class="hero__particles" ref="particlesRef"></div>
      <!-- Décorations animées -->
      <AnimatedDecorations variant="hero" intensity="medium" />
    </div>

    <div class="hero__container">
      <div class="hero__content">
        <!-- Salutation -->
        <div class="hero__greeting">
          <span class="hero__greeting-text">👋 Hola, je suis</span>
        </div>

        <!-- Nom principal -->
        <h1 class="hero__name">
          <span class="hero__firstname">VIRGINIE</span>
          <span class="hero__lastname">VACHET</span>
        </h1>

        <!-- Titre/Rôle -->
        <h2 class="hero__title">
          <span class="hero__title-text">Développeuse <span class="highlight-word">Frontend</span></span>
        </h2>

        <!-- Description -->
        <p class="hero__description">
Développeuse web frontend <span class="highlight-word">passionnée</span>, je crée des expériences numériques <span class="highlight-word">fluides</span>, <span class="highlight-word">inclusives</span> et <span class="highlight-word">durables</span>. J'allie <span class="highlight-word">technologies modernes</span>, sens du design, <span class="highlight-word">accessibilité</span> et <span class="highlight-word">éco-conception</span> pour donner vie à des interfaces à la fois <span class="highlight-word">créatives</span> et <span class="highlight-word">responsables</span>.        </p>

        <!-- Liens sociaux -->
        <div class="hero__social">
          <a 
            v-for="link in socialLinks" 
            :key="link.name"
            :href="link.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="hero__social-link"
            :aria-label="link.name"
          >
            <div class="hero__social-icon" v-html="getSocialIcon(link.icon).template"></div>
          </a>
        </div>
      </div>
      
      <!-- Statistiques animées -->
      <div class="hero-stats">
        <AnimatedStats />
      </div>

      <!-- Indicateur de scroll -->
      <div class="hero__scroll-indicator">
        <div class="hero__scroll-line"></div>
        <span class="hero__scroll-text">SCROLL</span>
        <svg class="hero__scroll-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { personalInfo } from '@/data/portfolio'
import AnimatedStats from '../ui/AnimatedStats.vue'
import AnimatedDecorations from '../effects/AnimatedDecorations.vue'

// Refs pour les éléments
const heroRef = ref<HTMLElement>()
const particlesRef = ref<HTMLElement>()

// Data
const { socialLinks } = personalInfo

// Icônes sociales (composants simples)
const getSocialIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    github: {
      template: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`
    },
    linkedin: {
      template: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
    },
    twitter: {
      template: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>`
    }
  }
  return icons[iconName] || icons.github
}

// Fonction simplifiée pour créer les particules
const initAnimations = () => {
  // Pas d'animations complexes pour éviter les erreurs
  console.log('Hero section loaded')
}

// Créer des particules animées
const createParticles = () => {
  if (!particlesRef.value) return
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div')
    particle.className = 'hero__particle'
    particle.style.left = Math.random() * 100 + '%'
    particle.style.top = Math.random() * 100 + '%'
    particle.style.animationDelay = Math.random() * 20 + 's'
    particlesRef.value.appendChild(particle)
  }
}

onMounted(() => {
  createParticles()
  // Délai pour s'assurer que tous les éléments sont montés
  setTimeout(() => {
    initAnimations()
  }, 100)
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: 80px; /* Espace pour le header fixe */
}

.hero__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.hero__gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(221, 48, 92, 0.1) 0%, transparent 70%);
}

.hero__particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.hero__particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--color-primary);
  border-radius: 50%;
  opacity: 0.3;
  animation: float 20s infinite linear;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10%, 90% {
    opacity: 0.3;
  }
  50% {
    transform: translateY(-100px) rotate(180deg);
    opacity: 0.6;
  }
}

.hero__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  width: 100%;
  position: relative;
}

@media (min-width: 1200px) {
  .hero__container {
    padding: 0 2rem;
  }
}

.hero__content {
  max-width: 600px;
}

.hero__greeting {
  margin-bottom: var(--spacing-md);
  margin-top: 12%;
}

.hero__greeting-text {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  font-weight: 500;
}

.hero__name {
  font-size: clamp(3.5rem, 12vw, 8rem);
  font-weight: 800;
  line-height: 0.85;
  margin-bottom: var(--spacing-lg);
  letter-spacing: -0.04em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-variation-settings: 'wght' 800;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.hero__firstname {
  background: linear-gradient(135deg, #dd305c 0%, #ff6b9d 50%, #ffd93d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  /* Fallback pour une meilleure visibilité */
  color: #dd305c;
  text-shadow: 0 0 30px rgba(221, 48, 92, 0.5);
}

.hero__firstname::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #dd305c 0%, #ff6b9d 50%, #ffd93d 100%);
  opacity: 0.2;
  filter: blur(20px);
  z-index: -1;
  animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    opacity: 0.2;
    transform: scale(1);
  }
  to {
    opacity: 0.4;
    transform: scale(1.02);
  }
}

.hero__lastname {
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  margin-left: 2.5rem;
  position: relative;
  /* Fallback pour une meilleure visibilité */
  color: #2d3748;
  font-weight: 700;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 20px rgba(45, 55, 72, 0.3);
}

.hero__title {
  font-size: clamp(1.75rem, 5vw, 3rem);
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.02em;
  line-height: 1.2;
  position: relative;
}

.hero__title-text {
  background: linear-gradient(90deg, var(--color-text-secondary) 0%, var(--color-text-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 400;
  font-variation-settings: 'wght' 400;
}

.hero__description {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-2xl);
  max-width: 500px;
}

.hero__social {
  display: flex;
  gap: var(--spacing-lg);
}

.hero__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  border: 1px solid var(--color-border);
}

.hero__social-link:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.hero__social-icon {
  width: 20px;
  height: 20px;
}

.hero__scroll-indicator {
  position: absolute;
  bottom: var(--spacing-2xl);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.hero__scroll-line {
  width: 1px;
  height: 60px;
  background-color: var(--color-border-light);
  transform-origin: top;
}

.hero__scroll-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  writing-mode: vertical-rl;
}

.hero__scroll-arrow {
  color: var(--color-text-muted);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-1px);
  }
}

/* Effet de surlignage progressif */
.highlight-word {
  position: relative;
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s ease;
}

.highlight-word::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60%;
  height: 8px;
  background: linear-gradient(90deg, rgba(var(--color-primary-rgb), 0.4) 0%, rgba(var(--color-primary-rgb), 0.1) 100%);
  z-index: -1;
  transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 4px;
}

.highlight-word:hover::before {
  width: 100%;
  background: linear-gradient(90deg, rgba(var(--color-primary-rgb), 0.6) 0%, rgba(var(--color-primary-rgb), 0.3) 100%);
}

.highlight-word:hover {
  color: var(--color-primary);
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .hero__container {
    padding: 0 var(--spacing-md);
  }
  
  .hero__social {
    justify-content: center;
  }
  
  .hero__scroll-indicator {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero__container {
    padding: 0 var(--spacing-sm);
  }
  
  .hero__description {
    font-size: var(--font-size-base);
  }
}
</style>