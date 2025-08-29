<template>
  <section id="about" class="about">
    <div class="about__container">
      <!-- En-tête de section -->
      <div class="about__header" ref="headerRef">
        <span class="about__label">À Propos</span>
        <h2 class="about__title">Développeuse Frontend Passionnée</h2>
      </div>

      <div class="about__content">
        <!-- Présentation personnelle -->
        <div class="about__intro" ref="introRef">
          <div class="about__text">
            <p class="about__paragraph">
              Je suis une développeuse frontend passionnée avec plus de {{ yearsOfExperience }} ans d’expérience dans la création d’expériences numériques élégantes, fonctionnelles et accessibles. Spécialisée dans les technologies web modernes, j’accorde une attention particulière à l’UX, à l’accessibilité (RGAA, WCAG) et à l’éco-conception web, afin de concevoir des interfaces à la fois inclusives et durables.
            </p>
            <p class="about__paragraph">
              Mon parcours a commencé par une curiosité : comprendre comment les sites internet prenaient vie. Ce qui était une exploration est vite devenu une passion profonde pour le développement web et la création d’expériences utilisateur fluides, intuitives et responsables. J’aime écrire du code propre et maintenable, et je veille à rester en phase avec les évolutions du secteur pour toujours affiner mes pratiques.
            </p>
            <p class="about__paragraph">
              Hors du code, j’aime me ressourcer dans les pages d’un livre, retrouver l’énergie de la nature ou le calme de la plage, toujours entourée de ma famille ou de mes amis. Ce sont ces moments qui nourrissent ma créativité et m’inspirent dans mon travail.
            </p>
          </div>

          <!-- Statistiques -->
          <div class="about__stats">
            <div class="about__stat" v-for="stat in stats" :key="stat.label">
              <div class="about__stat-number" ref="statNumberRef">{{ stat.value }}</div>
              <div class="about__stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- Stack technique -->
        <div class="about__skills" ref="skillsRef">
          <div class="about__skills-header">
            <h3 class="about__skills-title">MES TECHNOLOGIES</h3>
            <div class="about__skills-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="rotating-icon">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          <div class="about__skills-grid">
            <div 
              v-for="category in skillCategories" 
              :key="category.name"
              class="about__skill-category"
            >
              <h4 class="about__category-title">{{ category.name }}</h4>
              <div class="about__skills-icons">
                <div 
                  v-for="skill in category.skills" 
                  :key="skill.name"
                  class="about__skill-icon-item"
                  :title="skill.name"
                >
                  <!-- Utiliser AnimatedTechIcon pour les technologies principales -->
                  <AnimatedTechIcon 
                    v-if="['javascript', 'typescript', 'vue', 'css'].includes(skill.icon.toLowerCase())"
                    :icon="skill.icon.toLowerCase() as 'vue' | 'react' | 'typescript' | 'javascript' | 'css'"
                    variant="small"
                  />
                  <!-- Fallback pour les autres icônes -->
                  <div v-else class="about__skill-icon" v-html="getSkillIcon(skill.icon)"></div>
                  <span class="about__skill-name">{{ skill.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAnimations } from '@/composables/useAnimations'
import { personalInfo, skills } from '@/data/portfolio'
import AnimatedTechIcon from '../icons/AnimatedTechIcon.vue'

// Refs pour les animations
const headerRef = ref<HTMLElement>()
const introRef = ref<HTMLElement>()
const skillsRef = ref<HTMLElement>()
const statNumberRef = ref<HTMLElement[]>([])

// Composables
const { gsap, revealOnScroll } = useAnimations()

// Data calculées
const yearsOfExperience = computed(() => {
  const startYear = 2020 // Année de début
  return new Date().getFullYear() - startYear
})

const stats = [
  { value: '60+', label: 'Interfaces accessibles conçues' },
  { value: '8+', label: 'Années à façonner le web' },
  { value: '15+', label: 'Moments d’échange & partages' },
  { value: '∞', label: 'Cafés et idées créatives' },
  { value: '100%', label: 'Passion' }
]

const skillCategories = [
  {
    name: 'FRONTEND',
    skills: [
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'Vue.js', icon: 'vuejs' },
      { name: 'Vite', icon: 'vite' },
      { name: 'Pinia', icon: 'pinia' },
      { name: 'Vuetify', icon: 'vuetify' },
      { name: 'PrimeVue', icon: 'primevue' },
      { name: 'Tailwind CSS', icon: 'tailwind' },
      { name: 'Sass', icon: 'sass' },
      { name: 'Bootstrap', icon: 'bootstrap' }
    ]
  },
  {
    name: 'BACKEND',
    skills: [
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'Php', icon: 'nestjs' },
      { name: 'Symfony', icon: 'symfony' },
      { name: 'ApiPlatform', icon: 'apiPlatform' }
    ]
  },
  {
    name: 'DATABASE',
    skills: [
      { name: 'MySQL', icon: 'mysql' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'GraphQl', icon: 'graphql' }
    ]
  },
  {
    name: 'TOOLS',
    skills: [
      { name: 'Git', icon: 'git' },
      { name: 'Docker', icon: 'docker' },
      { name: 'PhpStorm', icon: 'phpstorm' }
    ]
  }
]

// Icônes des compétences
const getSkillIcon = (iconName: string): string => {
  const icons: Record<string, string> = {
    javascript: '<svg viewBox="0 0 24 24" fill="#F7DF1E"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>',
    typescript: '<svg viewBox="0 0 24 24" fill="#3178C6"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>',
    vuejs: '<svg viewBox="0 0 24 24" fill="#4FC08D"><path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z"/></svg>',
    vite: '<svg viewBox="0 0 24 24" fill="#646CFF"><path d="m8.286 10.578.512-8.657a.306.306 0 0 1 .247-.282L17.377.006a.306.306 0 0 1 .353.385l-1.558 5.403a.306.306 0 0 0 .352.385l2.388-.46a.306.306 0 0 1 .332.438l-6.79 13.55-.123.19a.294.294 0 0 1-.252.14c-.177 0-.35-.152-.305-.369l1.095-5.301a.306.306 0 0 0-.388-.355L8.69 15.72a.306.306 0 0 1-.38-.42l-.024-.722Z"/><path d="m8.286 10.578.512-8.657a.306.306 0 0 1 .247-.282L17.377.006a.306.306 0 0 1 .353.385l-1.558 5.403a.306.306 0 0 0 .352.385l2.388-.46a.306.306 0 0 1 .332.438l-6.79 13.55-.123.19a.294.294 0 0 1-.252.14c-.177 0-.35-.152-.305-.369l1.095-5.301a.306.306 0 0 0-.388-.355L8.69 15.72a.306.306 0 0 1-.38-.42l-.024-.722Z" fill="#FFCF00"/></svg>',
    pinia: '<svg viewBox="0 0 24 24" fill="#FFD859"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 6c-.828 0-1.5.672-1.5 1.5v3c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5v-3c0-.828-.672-1.5-1.5-1.5zm3 0c-.828 0-1.5.672-1.5 1.5v3c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5v-3c0-.828-.672-1.5-1.5-1.5zm-3 6c-.828 0-1.5.672-1.5 1.5v1.5c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5V13.5c0-.828-.672-1.5-1.5-1.5zm3 0c-.828 0-1.5.672-1.5 1.5v1.5c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5V13.5c0-.828-.672-1.5-1.5-1.5z"/></svg>',
    vuetify: '<svg viewBox="0 0 24 24" fill="#1867C0"><path d="M7.094 0L12 9.5 16.906 0H24l-12 24L0 0h7.094z"/></svg>',
    primevue: '<svg viewBox="0 0 24 24" fill="#007AD9"><path d="M12 0L2.524 4.5v15L12 24l9.476-4.5v-15L12 0zm7.5 17.625L12 21.375l-7.5-3.75V6.375L12 2.625l7.5 3.75v11.25z"/><path d="M12 4.5L6.75 7.125v9.75L12 19.5l5.25-2.625v-9.75L12 4.5zm3.75 11.25L12 17.25l-3.75-1.5V8.25L12 6.75l3.75 1.5v7.5z"/></svg>',
    tailwind: '<svg viewBox="0 0 24 24" fill="#06B6D4"><path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/></svg>',
    sass: '<svg viewBox="0 0 24 24" fill="#CC6699"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM9.615 15.055c.157.354.146.685-.01 1.022-.037.08-.08.158-.13.234-.277.42-.73.669-1.089.669-.475 0-.772-.356-.772-.89 0-.531.297-1.169.772-1.169.206 0 .4.08.54.227z"/></svg>',
    bootstrap: '<svg viewBox="0 0 24 24" fill="#7952B3"><path d="M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572z"/><path d="M21.5 12c0 5.247-4.253 9.5-9.5 9.5S2.5 17.247 2.5 12 6.753 2.5 12 2.5s9.5 4.253 9.5 9.5z"/><path d="M11.99 13.644H9.956v3.805h2.152c1.266 0 2.009-.606 2.009-1.808 0-1.197-.743-1.997-2.127-1.997z"/></svg>',
    nodejs: '<svg viewBox="0 0 24 24" fill="#339933"><path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.570,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"/></svg>',
    nestjs: '<svg viewBox="0 0 24 24" fill="#E0234E"><path d="M14.131.047c-.173 0-.334.037-.483.087.316.21.49.49.576.806.007.043.019.074.025.117a.681.681 0 0 1 .013.112c.024.545-.143.614-.26.936-.18.415-.13.861.086 1.22a.74.74 0 0 0 .074.137c-.235-1.568 1.073-1.803 1.314-2.293.019-.043.025-.074.031-.117-.007-.019-.007-.037-.013-.056-.024-.111-.062-.21-.118-.298a.799.799 0 0 0-.137-.21c-.093-.099-.204-.173-.328-.21-.111-.037-.235-.056-.347-.056-.111 0-.235.019-.334.056zm-1.526.558a.705.705 0 0 0-.347.087c-.173.086-.31.21-.415.347a.83.83 0 0 0-.173.334c-.037.13-.037.26 0 .39.037.111.086.21.161.298.086.099.186.173.298.235.13.074.26.111.39.137.142.025.284.025.427 0 .13-.025.26-.062.378-.111a.83.83 0 0 0 .334-.235c.086-.099.149-.21.186-.334.037-.13.037-.26 0-.39a.705.705 0 0 0-.161-.298.83.83 0 0 0-.298-.235 1.348 1.348 0 0 0-.39-.137c-.142-.025-.284-.025-.427 0-.111.025-.235.062-.347.111zm8.35 2.975a.681.681 0 0 0-.298.087c-.111.062-.198.149-.26.26a.681.681 0 0 0-.087.298c0 .111.031.21.087.298.062.111.149.198.26.26a.681.681 0 0 0 .298.087.681.681 0 0 0 .298-.087c.111-.062.198-.149.26-.26a.681.681 0 0 0 .087-.298.681.681 0 0 0-.087-.298c-.062-.111-.149-.198-.26-.26a.681.681 0 0 0-.298-.087z"/></svg>',
    express: '<svg viewBox="0 0 24 24" fill="#000000"><path d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957c-2.864 1.607-6.509.018-8.2-2.779a1.014 1.014 0 01-.063-.135C.501 14.618 0 13.12.002 11.576zM1.116 10.12h10.331c.389-2.096-.814-4.135-2.928-4.638a4.877 4.877 0 00-4.538 1.231c-1.207 1.315-2.006 2.78-2.865 3.407z"/></svg>',
    mysql: '<svg viewBox="0 0 24 24" fill="#4479A1"><path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H.082c.055-5.923.121-6.609.121-6.609s.028-.851.028-.851c0-.01.121-1.85.121-1.85h1.24c.074.204 1.366 4.19 1.366 4.19s.028.097.055.097l1.32-4.287h1.29s.021.851.021.851-.01 8.389-.01 8.389l-.333-.01zm9.296-2.227c-.027-.353-.074-.684-.121-1.002.027-.353.074-.684.121-1.002v2.004zm2.963-1.002c-.027.318-.074.649-.121 1.002.027.318.074.649.121 1.002v-2.004zm-5.926 0c-.027.318-.074.649-.121 1.002.027.318.074.649.121 1.002v-2.004z"/></svg>',
    postgresql: '<svg viewBox="0 0 24 24" fill="#336791"><path d="M17.128 0C15.624-.007 14.28.138 13.107.43c-2.713.675-3.206 2.09-3.206 4.695v3.435H6.468c-3.24 0-6.07 2.438-6.07 5.93v5.604c0 3.491 2.83 5.93 6.07 5.93h11.064c3.24 0 6.07-2.439 6.07-5.93v-5.604c0-3.492-2.83-5.93-6.07-5.93h-3.433V5.125c0-1.292.332-1.845 1.845-1.845.664 0 1.845.166 1.845.166v-3.28S16.295.007 17.128 0z"/></svg>',
    mongodb: '<svg viewBox="0 0 24 24" fill="#47A248"><path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/></svg>',
    prisma: '<svg viewBox="0 0 24 24" fill="#2D3748"><path d="M21.8068 18.2848L13.5528.7565c-.207-.4382-.639-.7273-1.1286-.7541-.5023-.0293-.9523.2061-1.1908.6092L3.1886 16.9037c-.2385.4031-.2385.9061 0 1.3092l4.0477 6.8418c.2385.4031.6885.6385 1.1908.6092.4896-.0268.9216-.3159 1.1286-.7541L21.8068 18.2848z"/></svg>',
    git: '<svg viewBox="0 0 24 24" fill="#F05032"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/></svg>',
    docker: '<svg viewBox="0 0 24 24" fill="#2496ED"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.186m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/></svg>',
    phpstorm: '<svg viewBox="0 0 24 24"><defs><linearGradient id="phpstorm-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FF6B35"/><stop offset="100%" stop-color="#B345F1"/></linearGradient></defs><rect width="24" height="24" fill="url(#phpstorm-gradient)"/><path d="M2.5 2.5h6v1.5h-4.5v3h4v1.5h-4v3h4.5v1.5h-6v-10.5zm8.5 0h2.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5h-1v3h-1.5v-8zm1.5 1.5v2h1c.55 0 1-.45 1-1s-.45-1-1-1h-1zm-10 11h8v1.5h-8v-1.5zm0 2.5h6v1.5h-6v-1.5z" fill="white"/></svg>',
    symfony: '<svg viewBox="0 0 24 24" fill="#000000"><path d="M24 12c0 6.628-5.372 12-12 12S0 18.628 0 12 5.372 0 12 0s12 5.372 12 12zM6.834 16.623c-.653 0-1.186-.533-1.186-1.186 0-.653.533-1.186 1.186-1.186.653 0 1.186.533 1.186 1.186 0 .653-.533 1.186-1.186 1.186zm3.542-2.372c-.653 0-1.186-.533-1.186-1.186 0-.653.533-1.186 1.186-1.186.653 0 1.186.533 1.186 1.186 0 .653-.533 1.186-1.186 1.186zm3.542 0c-.653 0-1.186-.533-1.186-1.186 0-.653.533-1.186 1.186-1.186.653 0 1.186.533 1.186 1.186 0 .653-.533 1.186-1.186 1.186zm3.542 2.372c-.653 0-1.186-.533-1.186-1.186 0-.653.533-1.186 1.186-1.186.653 0 1.186.533 1.186 1.186 0 .653-.533 1.186-1.186 1.186z"/></svg>',
    apiPlatform: '<svg viewBox="0 0 24 24" fill="#38A9DC"><path d="M12 0L2.524 4.5v15L12 24l9.476-4.5v-15L12 0zm7.5 17.625L12 21.375l-7.5-3.75V6.375L12 2.625l7.5 3.75v11.25z"/><path d="M12 4.5L6.75 7.125v9.75L12 19.5l5.25-2.625v-9.75L12 4.5zm3.75 11.25L12 17.25l-3.75-1.5V8.25L12 6.75l3.75 1.5v7.5z"/></svg>',
    graphql: '<svg viewBox="0 0 24 24" fill="#E10098"><path d="M14.051 2.751l4.935 2.85c.816-.859 2.173-.859 2.989 0l.849 1.699c.816.859.816 2.25 0 3.109l-4.935 2.85c.816.859.816 2.25 0 3.109l-4.935 2.85c-.816.859-2.173.859-2.989 0l-.849-1.699c-.816-.859-.816-2.25 0-3.109l4.935-2.85c-.816-.859-.816-2.25 0-3.109l4.935-2.85c.816-.859.816-2.25 0-3.109L14.051 2.751z"/></svg>'
  }
  
  return icons[iconName] || '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>'
}

// Animations au montage
onMounted(() => {
  if (headerRef.value) {
    revealOnScroll(headerRef.value)
  }
  if (introRef.value) {
    revealOnScroll(introRef.value)
  }
  if (skillsRef.value) {
    revealOnScroll(skillsRef.value)
  }
})
</script>

<style scoped>
.about {
  padding: 120px 0;
  background: linear-gradient(135deg, var(--color-background) 0%, var(--color-surface) 100%);
}

.about__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about__header {
  text-align: center;
  margin-bottom: 4rem;
}

.about__label {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--color-primary-alpha);
  color: var(--color-primary);
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.about__title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
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

.about__content {
  display: grid;
  gap: 4rem;
}

.about__intro {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: start;
}

.about__text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-text-secondary);
}

.about__paragraph {
  margin-bottom: 1.5rem;
}

.about__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.about__stat {
  text-align: center;
  padding: 1.5rem;
  background: var(--color-surface);
  border-radius: 1rem;
  border: 1px solid var(--color-border);
}

.about__stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.about__stat-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.about__skills-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.about__skills-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.about__skills-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(90deg, var(--color-text-primary) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-variation-settings: 'wght' 600;
}

.about__skills-icon {
  color: var(--color-primary);
}

.rotating-icon {
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.about__skills-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  align-items: start;
}

.about__skill-category {
  display: contents;
}

.about__category-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin: 0;
  text-align: left;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.7;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  justify-self: center;
  align-self: start;
  padding-top: 2rem;
}

.about__skills-icons {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 3rem;
}

.about__skill-icon-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.about__skill-icon-item:hover {
  transform: translateY(-2px);
}

.about__skill-icon {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
}

.about__skill-icon svg {
  width: 100%;
  height: 100%;
}

.about__skill-name {
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: 0.9rem;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .about {
    padding: 80px 0;
  }
  
  .about__title {
    font-size: 2rem;
  }
  
  .about__intro {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .about__stats {
    grid-template-columns: 1fr;
  }
  
  .about__skills-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .about__category-title {
    writing-mode: initial;
    text-orientation: initial;
    transform: none;
    justify-self: start;
    align-self: center;
    padding-top: 0;
    margin-bottom: 1rem;
  }
}
</style>