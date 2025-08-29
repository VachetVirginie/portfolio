<template>
  <section id="projects" class="projects">
    <div class="projects__container">
      <!-- En-tête de section -->
      <div class="projects__header" ref="headerRef">
        <span class="projects__label">Projets</span>
        <h2 class="projects__title">Travaux Sélectionnés</h2>
        <p class="projects__subtitle">
          Une collection de projets qui mettent en valeur mes compétences et ma passion pour créer des expériences numériques exceptionnelles
        </p>
      </div>

      <!-- Filtres -->
      <div class="projects__filters" ref="filtersRef">
        <button 
          v-for="category in categories" 
          :key="category"
          class="projects__filter"
          :class="{ 'projects__filter--active': activeFilter === category }"
          @click="setActiveFilter(category)"
        >
          {{ category === 'all' ? 'Tous les Projets' : getCategoryLabel(category) }}
        </button>
      </div>

      <!-- Grille de projets -->
      <div class="projects__grid" ref="gridRef">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="projects__card"
          ref="projectCardsRef"
        >
          <!-- Image du projet -->
          <div class="projects__image">
            <div class="projects__image-placeholder">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l-3-4 2.25-3L12 14l3-4 4 5H9z"/>
              </svg>
            </div>
            <div class="projects__overlay">
              <div class="projects__actions">
                <a 
                  v-if="project.demoUrl" 
                  :href="project.demoUrl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="projects__action"
                  title="View Demo"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </a>
                <a 
                  v-if="project.githubUrl" 
                  :href="project.githubUrl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="projects__action"
                  title="View Code"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Contenu du projet -->
          <div class="projects__content">
            <div class="projects__meta">
              <span class="projects__year">{{ project.year }}</span>
              <span class="projects__category">{{ project.category }}</span>
            </div>
            
            <h3 class="projects__name">{{ project.title }}</h3>
            <p class="projects__description">{{ project.description }}</p>
            
            <!-- Technologies -->
            <div class="projects__technologies">
              <span 
                v-for="tech in project.technologies.slice(0, 4)" 
                :key="tech"
                class="projects__tech"
              >
                {{ tech }}
              </span>
              <span 
                v-if="project.technologies.length > 4"
                class="projects__tech projects__tech--more"
              >
                +{{ project.technologies.length - 4 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucun projet -->
      <div v-if="filteredProjects.length === 0" class="projects__empty">
        <p>Aucun projet trouvé pour la catégorie sélectionnée.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnimations } from '@/composables/useAnimations'
import { projects } from '@/data/portfolio'

// Refs pour les animations
const headerRef = ref<HTMLElement>()
const filtersRef = ref<HTMLElement>()
const gridRef = ref<HTMLElement>()
const projectCardsRef = ref<HTMLElement[]>([])

// État des filtres
const activeFilter = ref('all')

// Composables
const { gsap, revealOnScroll } = useAnimations()

// Catégories disponibles
const categories = computed(() => {
  const uniqueCategories = [...new Set(projects.map(p => p.category))]
  return ['all', ...uniqueCategories]
})

// Projets filtrés
const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') {
    return projects
  }
  return projects.filter(project => project.category === activeFilter.value)
})

// Traduire les catégories
const getCategoryLabel = (category: string) => {
  const translations: Record<string, string> = {
    'web': 'Web',
    'portfolio': 'Portfolio',
    'cms': 'CMS',
    'mobile': 'Mobile'
  }
  return translations[category] || category.charAt(0).toUpperCase() + category.slice(1)
}

// Changer le filtre actif
const setActiveFilter = (category: string) => {
  if (activeFilter.value === category) return
  
  activeFilter.value = category
  
  // Animation des cartes lors du changement de filtre
  if (projectCardsRef.value.length > 0) {
    gsap.fromTo(projectCardsRef.value,
      { opacity: 0, y: 30, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1
      }
    )
  }
}

// Animations au montage
onMounted(() => {
  if (headerRef.value) {
    revealOnScroll(headerRef.value)
  }
  
  if (filtersRef.value) {
    revealOnScroll(filtersRef.value)
  }

  // Animation des cartes de projets
  projectCardsRef.value.forEach((card, index) => {
    if (card) {
      gsap.fromTo(card,
        { 
          opacity: 0, 
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }
  })
})
</script>

<style scoped>
.projects {
  padding: 120px 0;
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-background) 100%);
}

.projects__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.projects__header {
  text-align: center;
  margin-bottom: 3rem;
}

.projects__label {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--color-primary-alpha);
  color: var(--color-primary);
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.projects__title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 1rem 0;
}

.projects__subtitle {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.projects__filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
}

.projects__filter {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid var(--color-border);
  border-radius: 2rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.projects__filter:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.projects__filter--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.projects__card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.projects__card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.projects__image {
  position: relative;
  height: 200px;
  background: var(--color-background);
  overflow: hidden;
}

.projects__image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
  opacity: 0.3;
}

.projects__image-placeholder svg {
  width: 3rem;
  height: 3rem;
}

.projects__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.projects__card:hover .projects__overlay {
  opacity: 1;
}

.projects__actions {
  display: flex;
  gap: 1rem;
}

.projects__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
}

.projects__action:hover {
  background: var(--color-accent);
  transform: scale(1.1);
}

.projects__action svg {
  width: 1.25rem;
  height: 1.25rem;
}

.projects__content {
  padding: 1.5rem;
}

.projects__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.projects__year {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.875rem;
}

.projects__category {
  background: var(--color-background);
  color: var(--color-text-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.projects__name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.75rem 0;
}

.projects__description {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.projects__technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.projects__tech {
  background: var(--color-primary-alpha);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.projects__tech--more {
  background: var(--color-background);
  color: var(--color-text-secondary);
}

.projects__empty {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .projects {
    padding: 80px 0;
  }
  
  .projects__title {
    font-size: 2rem;
  }
  
  .projects__grid {
    grid-template-columns: 1fr;
  }
  
  .projects__filters {
    gap: 0.5rem;
  }
  
  .projects__filter {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
</style>