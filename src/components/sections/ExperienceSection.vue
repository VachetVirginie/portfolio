<template>
  <section id="experience" class="experience">
    <div class="experience__container">
      <!-- En-tête de section -->
      <div class="experience__header" ref="headerRef">
        <div class="experience__badge">
          <span class="experience__badge-icon">💼</span>
          <span class="experience__badge-text">Expérience</span>
        </div>
        <!-- <h2 class="experience__title">
          <span class="experience__title-main">Expérience </span>
          <span class="experience__title-accent">Professionnel</span>
        </h2> -->
        <p class="experience__title">
Parcours et projets       </p>
      </div>

      <!-- Experience Grid -->
      <div class="experience__grid" ref="gridRef">
        <AnimatedProjectCard 
          v-for="(experience, index) in experiences" 
          :key="experience.id"
          :variant="index === 0 ? 'featured' : 'default'"
          :show-particles="true"
          class="experience__card-wrapper"
        >
          <div 
            class="experience__card"
            :class="`experience__card--${index % 3}`"
            ref="experienceCardsRef"
            @mouseenter="handleCardHover(index, true)"
            @mouseleave="handleCardHover(index, false)"
          >
          <!-- Card Background Effects -->
          <div class="experience__card-bg"></div>
          <div class="experience__card-glow"></div>
          
          <!-- Card Header -->
          <div class="experience__card-header">
            <div class="experience__period">
              <span class="experience__period-icon">📅</span>
              {{ experience.period }}
            </div>
            <div class="experience__status" :class="getStatusClass(index)">
              {{ getStatusText(index) }}
            </div>
          </div>

          <!-- Card Content -->
          <div class="experience__card-content">
            <h3 class="experience__position">{{ experience.position }}</h3>
            <h4 class="experience__company">
              <span class="experience__company-icon">🏢</span>
              {{ experience.company }}
            </h4>
            <p class="experience__description">{{ experience.description }}</p>
            
            <!-- Technologies utilisées -->
            <div class="experience__technologies" v-if="experience.technologies">
              <div class="experience__tech-header">
                <span class="experience__tech-icon">🛠️</span>
                <span class="experience__tech-label">Technologies</span>
              </div>
              <div class="experience__tech-grid">
                <span 
                  v-for="(tech, techIndex) in experience.technologies" 
                  :key="tech"
                  class="experience__tech-tag"
                  :style="{ animationDelay: `${techIndex * 0.1}s` }"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- Réalisations -->
            <div class="experience__achievements" v-if="experience.achievements">
              <div class="experience__achievements-header">
                <span class="experience__achievements-icon">🎯</span>
                <span class="experience__achievements-label">Réalisations clés</span>
              </div>
              <ul class="experience__achievements-list">
                <li 
                  v-for="(achievement, achIndex) in experience.achievements" 
                  :key="achievement"
                  class="experience__achievement"
                  :style="{ animationDelay: `${achIndex * 0.15}s` }"
                >
                  <span class="experience__achievement-bullet">✨</span>
                  {{ achievement }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="experience__card-footer">
            <div class="experience__card-number">{{ String(index + 1).padStart(2, '0') }}</div>
          </div>
          </div>
        </AnimatedProjectCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAnimations } from '@/composables/useAnimations'
import { experiences } from '@/data/portfolio'
import AnimatedProjectCard from '@/components/effects/AnimatedProjectCard.vue'

// Refs pour les animations
const headerRef = ref<HTMLElement>()
const gridRef = ref<HTMLElement>()
const experienceCardsRef = ref<HTMLElement[]>([])

// Fonctions utilitaires
const getStatusClass = (index: number) => {
  if (index === 0) return 'experience__status--current'
  if (index === 1) return 'experience__status--recent'
  return 'experience__status--past'
}

const getStatusText = (index: number) => {
  if (index === 0) return 'Actuel'
  if (index === 1) return 'Récent'
  return 'Passé'
}

const handleCardHover = (index: number, isHovering: boolean) => {
  const card = experienceCardsRef.value[index]
  if (!card) return
  
  if (isHovering) {
    gsap.to(card, {
      y: -10,
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out"
    })
  } else {
    gsap.to(card, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    })
  }
}

// Composables
const { gsap, revealOnScroll } = useAnimations()

// Animations au montage
const animateExperiences = () => {
  if (headerRef.value) {
    revealOnScroll(headerRef.value)
  }

  // Animation des cartes d'expérience
  if (gridRef.value) {
    const cards = gridRef.value.querySelectorAll('.experience__card')
    
    gsap.fromTo(cards, 
      { opacity: 0, y: 50, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.8, 
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.value,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    )
  }

  // Animation des éléments individuels
  experienceCardsRef.value.forEach((card, index) => {
    if (card) {
      gsap.fromTo(card,
        { 
          opacity: 0, 
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }
  })
}

onMounted(() => {
  animateExperiences()
})
</script>

<style scoped>
.experience {
  padding: 8rem 0;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
  margin-top: 3%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(221, 48, 92, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.experience__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }
}

.experience__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.experience__header {
  text-align: center;
  margin-bottom: 5rem;
}

.experience__label {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--color-primary-alpha);
  color: var(--color-primary);
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.experience__title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 1rem 0;
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.03em;
  line-height: 1.1;
  background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-variation-settings: 'wght' 600;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  position: relative;
}

.experience__subtitle {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.experience__timeline {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
}

.experience__timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--color-primary), var(--color-accent));
  transform: translateX(-50%);
  transform-origin: top;
}

.experience__item {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 4rem;
  width: 100%;
}

.experience__item:last-child {
  margin-bottom: 0;
}

.experience__dot {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: var(--color-surface);
  border: 3px solid var(--color-primary);
  border-radius: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.experience__dot-inner {
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 50%;
}

.experience__card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.experience__card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(221, 48, 92, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.experience__card::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, rgba(221, 48, 92, 0.3), rgba(59, 130, 246, 0.3));
  border-radius: 22px;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.4s ease;
}

.experience__card:hover {
  transform: translateY(-12px) scale(1.02);
  border-color: rgba(221, 48, 92, 0.4);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4),
              0 0 40px rgba(221, 48, 92, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.experience__card:hover::before {
  opacity: 1;
}

.experience__card:hover::after {
  opacity: 1;
}

.experience__card::before {
  content: '';
  position: absolute;
  top: 50%;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  transform: translateY(-50%);
}

.experience__item:not(.experience__item--reverse) .experience__card {
  margin-right: auto;
}

.experience__item:not(.experience__item--reverse) .experience__card::before {
  right: -20px;
  border-left-color: var(--color-border);
}

.experience__item--reverse .experience__card {
  margin-left: auto;
}

.experience__item--reverse .experience__card::before {
  left: -20px;
  border-right-color: var(--color-border);
}

.experience__card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.experience__period {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.experience__period-icon {
  font-size: 1rem;
}

.experience__status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}

.experience__status--current {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.experience__status--recent {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.experience__status--past {
  background: linear-gradient(135deg, rgba(156, 163, 175, 0.2), rgba(156, 163, 175, 0.1));
  color: #9ca3af;
  border: 1px solid rgba(156, 163, 175, 0.3);
}

.experience__card-content {
  position: relative;
  z-index: 1;
}

.experience__position {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
  position: relative;
  z-index: 1;
}

.experience__company {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  background: linear-gradient(135deg, #dd305c, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  position: relative;
  z-index: 1;
}

.experience__company-icon {
  font-size: 1rem;
}

.experience__description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.experience__technologies {
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.experience__tech-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.experience__tech-icon {
  font-size: 1rem;
}

.experience__tech-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.experience__tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.experience__tech-tag {
  background: rgba(221, 48, 92, 0.15);
  color: #ff6b9d;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(221, 48, 92, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.experience__tech-tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.experience__tech-tag:hover {
  background: rgba(221, 48, 92, 0.25);
  border-color: rgba(221, 48, 92, 0.5);
  transform: translateY(-2px);
}

.experience__tech-tag:hover::before {
  left: 100%;
}

.experience__achievements {
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.experience__achievements-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.experience__achievements-icon {
  font-size: 1rem;
}

.experience__achievements-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.experience__achievements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.experience__achievement {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-size: 0.875rem;
}

.experience__achievement-bullet {
  color: #dd305c;
  font-size: 0.75rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.experience__achievement:last-child {
  margin-bottom: 0;
}

.experience__card-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}

.experience__card-number {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, rgba(221, 48, 92, 0.3), rgba(59, 130, 246, 0.3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.5;
}

.experience__card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(221, 48, 92, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  border-radius: 20px;
}

.experience__card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, rgba(221, 48, 92, 0.2), rgba(59, 130, 246, 0.2));
  border-radius: 22px;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.4s ease;
  filter: blur(10px);
}

.experience__card:hover .experience__card-bg {
  opacity: 1;
}

.experience__card:hover .experience__card-glow {
  opacity: 1;
}

@media (max-width: 768px) {
  .experience {
    padding: 4rem 0;
  }

  .experience__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }

  .experience__card {
    padding: 2rem;
  }

  .experience__card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .experience__position {
    font-size: 1.25rem;
  }

  .experience__company {
    font-size: 1rem;
  }

  .experience__tech-grid {
    gap: 0.5rem;
  }

  .experience__tech-tag {
    padding: 0.375rem 0.75rem;
    font-size: 0.6875rem;
  }

  .experience__card-number {
    font-size: 1.5rem;
  }
}
</style>