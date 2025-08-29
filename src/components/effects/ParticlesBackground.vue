<template>
  <div class="particles-container">
    <canvas ref="canvas" class="particles-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  opacityDirection: number
  color: string
}

const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let animationId: number
let mouseX = 0
let mouseY = 0

const PARTICLE_COUNT = 30
const MAX_DISTANCE = 80
const MOUSE_RADIUS = 100

const colors = [
  'rgba(221, 48, 92, 0.8)',   // Rose fluo principal
        'rgba(255, 64, 129, 0.6)',  // Rose fluo moyen
        'rgba(221, 48, 92, 0.4)',   // Rose fluo léger
        'rgba(255, 255, 255, 0.3)', // Blanc transparent
        'rgba(183, 28, 28, 0.5)'    // Rouge plus foncé
]

function createParticle(): Particle {
  return {
    x: Math.random() * (canvas.value?.width || 0),
    y: Math.random() * (canvas.value?.height || 0),
    vx: (Math.random() - 0.5) * 0.3,
    vy: Math.random() * 0.8 + 0.2,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.4 + 0.2,
    opacityDirection: Math.random() > 0.5 ? 1 : -1,
    color: colors[Math.floor(Math.random() * colors.length)]
  }
}

function initParticles() {
  particles = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle())
  }
}

function updateParticles() {
  if (!canvas.value || !ctx) return

  particles.forEach(particle => {
    // Mouvement de neige
    particle.x += particle.vx
    particle.y += particle.vy

    // Léger mouvement horizontal aléatoire
    particle.vx += (Math.random() - 0.5) * 0.01
    particle.vx *= 0.99 // Friction

    // Rebond horizontal
    if (particle.x < 0) {
      particle.x = canvas.value!.width
    }
    if (particle.x > canvas.value!.width) {
      particle.x = 0
    }

    // Réapparition en haut quand la particule sort en bas
    if (particle.y > canvas.value!.height) {
      particle.y = -10
      particle.x = Math.random() * canvas.value!.width
    }

    // Animation de l'opacité plus douce
    particle.opacity += particle.opacityDirection * 0.003
    if (particle.opacity <= 0.1 || particle.opacity >= 0.6) {
      particle.opacityDirection *= -1
    }
  })
}

function drawParticles() {
  if (!ctx || !canvas.value) return

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  // Pas de connexions pour l'effet neige

  // Dessiner les particules
  particles.forEach(particle => {
    if (!ctx) return
    ctx.globalAlpha = particle.opacity
    ctx.fillStyle = particle.color
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fill()

    // Effet de glow
    ctx.shadowColor = particle.color
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  })

  if (ctx) {
    ctx.globalAlpha = 1
  }
}

function animate() {
  updateParticles()
  drawParticles()
  animationId = requestAnimationFrame(animate)
}

function resizeCanvas() {
  if (!canvas.value) return
  
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  initParticles()
}

function handleMouseMove(event: MouseEvent) {
  mouseX = event.clientX
  mouseY = event.clientY
}

onMounted(() => {
  if (!canvas.value) return
  
  ctx = canvas.value.getContext('2d')
  if (!ctx) return

  resizeCanvas()
  animate()

  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particles-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>