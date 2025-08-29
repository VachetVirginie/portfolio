<template>
  <nav 
    ref="navRef" 
    class="navigation liquid-navigation" 
    :class="{ 'navigation--scrolled': isScrolled, 'navigation--hidden': isHidden }"
  >
    <div class="navigation__container">
      <!-- Logo -->
      <router-link to="/" class="navigation__logo">
        <span class="navigation__logo-text">VV</span>
      </router-link>

      <!-- Menu Burger -->
      <button 
        class="burger-menu"
        :class="{ 'burger-menu--active': isMobileMenuOpen }"
        @click="toggleMobileMenu"
        aria-label="Toggle menu"
      >
        <span class="burger-menu__line"></span>
        <span class="burger-menu__line"></span>
        <span class="burger-menu__line"></span>
      </button>
    </div>

    <!-- Menu overlay -->
    <div 
      class="menu-overlay" 
      :class="{ 'menu-overlay--active': isMobileMenuOpen }"
      @click="toggleMobileMenu"
    ></div>

    <!-- Menu principal -->
    <div class="menu-panel" :class="{ 'menu-panel--active': isMobileMenuOpen }">
      <div class="menu-panel__content">
        <nav class="menu-nav">
          <ul class="menu-nav__list">
            <li class="menu-nav__item">
              <a 
                href="#about" 
                class="menu-nav__link" 
                :class="{ active: activeItem === 'about' }"
                data-nav-id="about"
                @click="handleLiquidNavClick('about', $event)"
              >
                <span class="menu-nav__number">01</span>
                <span class="menu-nav__text">About</span>
              </a>
            </li>
            <li class="menu-nav__item">
              <a 
                href="#experience" 
                class="menu-nav__link" 
                :class="{ active: activeItem === 'experience' }"
                data-nav-id="experience"
                @click="handleLiquidNavClick('experience', $event)"
              >
                <span class="menu-nav__number">02</span>
                <span class="menu-nav__text">Experience</span>
              </a>
            </li>
            <li class="menu-nav__item">
              <a 
                href="#contact" 
                class="menu-nav__link" 
                :class="{ active: activeItem === 'contact' }"
                data-nav-id="contact"
                @click="handleLiquidNavClick('contact', $event)"
              >
                <span class="menu-nav__number">03</span>
                <span class="menu-nav__text">Contact</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- Actions dans le menu -->
        <div class="menu-actions">
          <a 
            href="/resume.pdf" 
            target="_blank" 
            class="menu-actions__resume"
          >
            Download Resume
          </a>
        </div>

        <!-- Informations de contact -->
        <div class="menu-contact">
          <p class="menu-contact__email">contact@vachetvirginie.fr</p>
          <p class="menu-contact__location">Lyon, France</p>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useScroll } from '@/composables/useScroll'
import { useLiquidNavigation } from '@/composables/useLiquidNavigation'

const navRef = ref<HTMLElement | null>(null)
const isScrolled = ref(false)
const isHidden = ref(false)
const isMobileMenuOpen = ref(false)
const lastScrollY = ref(0)

const { scrollToSection } = useScroll()

// Navigation liquide
const { activeItem, handleNavClick } = useLiquidNavigation(navRef, {
  items: [
    { id: 'hero', label: 'Accueil', href: '#hero' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'experience', label: 'Experience', href: '#experience' },
    { id: 'contact', label: 'Contact', href: '#contact' }
  ],
  blobColor: '#00ff88',
  glowEffect: true,
  rippleEffect: true
})

// Gérer le scroll pour l'effet de navigation
const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  // Navigation scrollée
  isScrolled.value = currentScrollY > 50
  
  // Cacher/montrer la navigation
  if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
    isHidden.value = true
  } else {
    isHidden.value = false
  }
  
  lastScrollY.value = currentScrollY
}

// Toggle menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  
  // Empêcher le scroll quand le menu est ouvert
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Fermer le menu mobile lors du clic sur un lien
const scrollToSectionAndClose = (sectionId: string) => {
  scrollToSection(sectionId)
  if (isMobileMenuOpen.value) {
    toggleMobileMenu()
  }
}

// Gérer le clic avec navigation liquide
const handleLiquidNavClick = (itemId: string, event: MouseEvent) => {
  event.preventDefault()
  handleNavClick(itemId, event)
  scrollToSection(itemId)
  if (isMobileMenuOpen.value) {
    toggleMobileMenu()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Navigation principale */
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.navigation--scrolled {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.navigation--hidden {
  transform: translateY(-100%);
}

.navigation__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

@media (min-width: 1200px) {
  .navigation__container {
    padding: 0 2rem;
  }
  
  .burger-menu {
    margin-right: 0;
    margin-left: auto;
  }
}

/* Logo */
.navigation__logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: all 0.3s ease;
  z-index: 1001;
  position: relative;
}

.navigation__logo:hover {
  transform: scale(1.05);
}

.navigation__logo-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.02em;
}

/* Menu Burger */
.burger-menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
  position: relative;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin-left: auto;
}

.burger-menu:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.burger-menu__line {
  width: 24px;
  height: 2px;
  background-color: var(--color-text-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 3px 0;
  border-radius: 2px;
}

.burger-menu--active .burger-menu__line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
  background-color: var(--color-primary);
}

.burger-menu--active .burger-menu__line:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.burger-menu--active .burger-menu__line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
  background-color: var(--color-primary);
}

/* Menu Overlay */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999;
}

.menu-overlay--active {
  opacity: 1;
  visibility: visible;
}

/* Menu Panel */
.menu-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow-y: auto;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.1);
}

.menu-panel--active {
  transform: translateX(0);
}

.menu-panel__content {
  padding: 120px 3rem 3rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Menu Navigation */
.menu-nav__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-nav__item {
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateX(30px);
  animation: slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.menu-panel--active .menu-nav__item:nth-child(1) { animation-delay: 0.1s; }
.menu-panel--active .menu-nav__item:nth-child(2) { animation-delay: 0.2s; }
.menu-panel--active .menu-nav__item:nth-child(3) { animation-delay: 0.3s; }

.menu-nav__link {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: var(--color-text-primary);
  text-decoration: none;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.menu-nav__link:hover {
  color: var(--color-primary);
  transform: translateX(10px);
}

.menu-nav__number {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  opacity: 0.7;
  min-width: 2rem;
}

.menu-nav__text {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

/* Menu Actions */
.menu-actions {
  margin: 3rem 0;
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: 0.4s;
}

.menu-actions__resume {
  display: inline-flex;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(var(--color-primary-rgb), 0.3);
}

.menu-actions__resume:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(var(--color-primary-rgb), 0.4);
}

/* Menu Contact */
.menu-contact {
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: 0.5s;
}

.menu-contact__email,
.menu-contact__location {
  margin: 0.5rem 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.menu-contact__email {
  color: var(--color-primary);
}

/* Animations */
@keyframes slideInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .navigation__container {
    padding: 0 1rem;
    height: 70px;
  }
  
  .menu-panel {
    width: 100vw;
  }
  
  .menu-panel__content {
    padding: 100px 2rem 2rem;
  }
  
  .menu-nav__text {
    font-size: 1.25rem;
  }
}

@media (max-width: 360px) {
  .menu-panel__content {
    padding: 90px 1.5rem 1.5rem;
  }
}
</style>