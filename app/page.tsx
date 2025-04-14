"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Star, Zap, ChevronDown, X, Menu } from "lucide-react"
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect, useState, useRef } from "react"
import { toast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

// Verbessere die ParticleBackground-Komponente, um die Partikel sichtbarer und interaktiver zu machen
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: {
      x: number
      y: number
      size: number
      baseSize: number
      speedX: number
      speedY: number
      color: string
      baseColor: string
      glowColor: string
    }[] = []

    // Erhöhe die Anzahl der Partikel für bessere Sichtbarkeit
    const particleCount = 120

    // Erstelle Partikel
    for (let i = 0; i < particleCount; i++) {
      // Zufällige Farbe zwischen Orange und Dunkelblau
      const colorChoice = Math.random() > 0.6
      const baseColor = colorChoice
        ? `rgba(255, 125, 58, ${Math.random() * 0.5 + 0.2})` // Orange mit höherer Deckkraft
        : `rgba(42, 65, 101, ${Math.random() * 0.5 + 0.2})` // Dunkelblau mit höherer Deckkraft

      const glowColor = colorChoice
        ? `rgba(255, 125, 58, ${Math.random() * 0.5 + 0.3})`
        : `rgba(42, 65, 101, ${Math.random() * 0.5 + 0.3})`

      const baseSize = Math.random() * 2.5 + 1 // Größere Partikel

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: baseSize,
        baseSize: baseSize,
        speedX: (Math.random() - 0.5) * 0.5, // Etwas schnellere Bewegung
        speedY: (Math.random() - 0.5) * 0.5,
        color: baseColor,
        baseColor: baseColor,
        glowColor: glowColor,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Berechne Distanz zur Maus
        if (isMouseInCanvas) {
          const dx = mousePosition.x - particle.x
          const dy = mousePosition.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Wenn Partikel in der Nähe der Maus ist
          if (distance < 200) {
            // Größerer Interaktionsradius
            // Vergrößere Partikel und ändere Farbe
            const scale = 1 - distance / 200
            particle.size = particle.baseSize + scale * 5 // Stärkere Vergrößerung
            particle.color = particle.glowColor

            // Bewege Partikel leicht von der Maus weg
            const angle = Math.atan2(dy, dx)
            particle.x -= Math.cos(angle) * 1.0 // Stärkere Abstoßung
            particle.y -= Math.sin(angle) * 1.0
          } else {
            // Normaler Zustand
            particle.size = particle.baseSize
            particle.color = particle.baseColor
          }
        }

        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Füge Glühen für alle Partikel hinzu
        ctx.shadowBlur = particle.size * 2
        ctx.shadowColor = particle.color

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const handleMouseEnter = () => {
      setIsMouseInCanvas(true)
    }

    const handleMouseLeave = () => {
      setIsMouseInCanvas(false)
    }

    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseenter", handleMouseEnter)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseenter", handleMouseEnter)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [mousePosition, isMouseInCanvas])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 opacity-60" // Erhöhte Opazität
      style={{ pointerEvents: "auto" }}
    />
  )
}

// 3D Tilt Karten-Komponente
const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="h-full"
    >
      <div style={{ transform: "translateZ(20px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  )
}

// Animierter Text mit Hover-Effekt
const AnimatedText = ({
  children,
  className = "",
  delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) => {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{
        scale: 1.05,
        color: "#FF7D3A",
        textShadow: "0 0 8px rgba(255, 125, 58, 0.5)",
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.span>
  )
}

// Interaktive Navigation
const NavItem = ({
  href,
  children,
  isActive = false,
  onClick,
}: { href: string; children: React.ReactNode; isActive?: boolean; onClick?: () => void }) => {
  return (
    <motion.div className="relative">
      <Link
        href={href}
        className={`text-sm font-medium ${isActive ? "text-[#FF7D3A]" : "text-[#B0B0B0]"} hover:text-[#FF7D3A] transition-colors`}
        onClick={onClick}
      >
        {children}
      </Link>
      <motion.div
        className="absolute bottom-[-5px] left-0 right-0 h-[2px] bg-[#FF7D3A]"
        initial={{ scaleX: isActive ? 1 : 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

// Mobile Navigation Menu
const MobileNav = ({
  isOpen,
  onClose,
  activeSection,
  scrollToSection,
}: {
  isOpen: boolean
  onClose: () => void
  activeSection: string
  scrollToSection: (sectionId: string) => void
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed right-0 top-0 h-full w-3/4 max-w-xs bg-[#0F1419] border-l border-[#121820] p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <Image src="/images/logo.png" alt="ADAN MEDIA Logo" width={24} height={24} className="h-6 w-6" />
                <span className="text-lg font-bold text-[#F0F0F0]">
                  ADAN<span className="text-[#FF7D3A]">MEDIA</span>
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-[#B0B0B0] hover:text-[#F0F0F0] hover:bg-[#121820]"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="space-y-6">
              {[
                { id: "home", label: "STARTSEITE" },
                { id: "webdesign", label: "WEBDESIGN" },
                { id: "social-media", label: "SOCIAL MEDIA" },
                { id: "grafikdesign", label: "GRAFIKDESIGN" },
                { id: "portfolio", label: "PROJEKTE" },
                { id: "testimonials", label: "REFERENZEN" },
                { id: "contact", label: "KONTAKT" },
              ].map((item) => (
                <motion.div key={item.id} className="block" whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={`#${item.id}`}
                    className={`text-lg font-medium ${
                      activeSection === item.id ? "text-[#FF7D3A]" : "text-[#B0B0B0]"
                    } hover:text-[#FF7D3A] transition-colors`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(item.id)
                      onClose()
                    }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="absolute bottom-8 left-0 right-0 px-6">
              <Button
                className="w-full bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]"
                onClick={onClose}
              >
                SCHLIESSEN
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Modal Komponente
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-[#0F1419] border border-[#121820] rounded-lg shadow-lg max-w-md w-full p-6"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#F0F0F0]">{title}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-[#B0B0B0] hover:text-[#F0F0F0] hover:bg-[#121820]"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Projekt-Detail-Modal
const ProjectDetailModal = ({
  isOpen,
  onClose,
  project,
}: {
  isOpen: boolean
  onClose: () => void
  project: { id: number; title: string; description: string; image: string }
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project.title}>
      <div className="space-y-4">
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-48 object-cover rounded-md border border-[#121820]"
        />
        <p className="text-[#B0B0B0]">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs bg-[#121820] text-[#FF7D3A] px-2 py-1 rounded-full">Webdesign</span>
          <span className="text-xs bg-[#121820] text-[#FF7D3A] px-2 py-1 rounded-full">Entwicklung</span>
          <span className="text-xs bg-[#121820] text-[#FF7D3A] px-2 py-1 rounded-full">UI/UX</span>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]"
            onClick={onClose}
          >
            SCHLIESSEN
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// Kontakt-Modal
const ContactModal = ({
  isOpen,
  onClose,
  handleSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  handleSubmit: (e: React.FormEvent) => void
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kontakt aufnehmen">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="modal-email" className="text-sm font-medium text-[#F0F0F0]">
            E-Mail
          </label>
          <input
            id="modal-email"
            type="email"
            className="flex h-10 w-full rounded-md border border-[#121820] bg-[#121212] px-3 py-2 text-sm text-[#F0F0F0] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#B0B0B0]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7D3A] focus-visible:ring-offset-2"
            placeholder="max.mustermann@beispiel.de"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="modal-message" className="text-sm font-medium text-[#F0F0F0]">
            Nachricht
          </label>
          <textarea
            id="modal-message"
            className="flex min-h-[120px] w-full rounded-md border border-[#121820] bg-[#121212] px-3 py-2 text-sm text-[#F0F0F0] ring-offset-background placeholder:text-[#B0B0B0]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7D3A] focus-visible:ring-offset-2"
            placeholder="Wie können wir Ihnen helfen?"
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="border-[#121820] text-[#B0B0B0] hover:bg-[#121820] hover:text-[#F0F0F0]"
            onClick={onClose}
          >
            ABBRECHEN
          </Button>
          <Button
            className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]"
            type="submit"
          >
            SENDEN
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [scrollY, setScrollY] = useState(0)
  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Particle effect for icons
  const createParticles = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const rect = container.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Create 10 particles
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement("div")
      const size = Math.random() * 6 + 2

      // Random position around the center
      const x = centerX + (Math.random() - 0.5) * 10
      const y = centerY + (Math.random() - 0.5) * 10

      // Random direction
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 60 + 30
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed

      // Style the particle
      particle.style.position = "absolute"
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.borderRadius = "50%"
      particle.style.backgroundColor = "#FF7D3A"
      particle.style.boxShadow = "0 0 8px rgba(255, 125, 58, 0.8)"
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`
      particle.style.pointerEvents = "none"
      particle.style.zIndex = "50"

      container.appendChild(particle)

      // Animate the particle
      const startTime = Date.now()
      const duration = Math.random() * 600 + 400

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = elapsed / duration

        if (progress < 1) {
          const currentX = x + vx * progress
          const currentY = y + vy * progress
          const opacity = 1 - progress

          particle.style.left = `${currentX}px`
          particle.style.top = `${currentY}px`
          particle.style.opacity = opacity.toString()

          requestAnimationFrame(animate)
        } else {
          container.removeChild(particle)
        }
      }

      requestAnimationFrame(animate)
    }
  }

  // Modals
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<{
    id: number
    title: string
    description: string
    image: string
  }>({
    id: 1,
    title: "Nexus-1",
    description:
      "Ein modernes Webportal für ein Technologieunternehmen mit Fokus auf innovative Lösungen. Das Design verbindet organische Formen mit technischen Elementen und schafft eine immersive Benutzererfahrung.",
    image: "/placeholder.svg?height=300&width=400&text=Projekt 1",
  })

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    message: "",
  })
  const [formSubmitting, setFormSubmitting] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const [heroRef, heroInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [servicesRef, servicesInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [portfolioRef, portfolioInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [contactRef, contactInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // Aktualisiere aktiven Abschnitt basierend auf Scroll-Position
  const [serviceOverviewRef, serviceOverviewInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [socialMediaRef, socialMediaInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [grafikdesignRef, grafikdesignInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  useEffect(() => {
    if (heroInView) setActiveSection("home")
    if (serviceOverviewInView) setActiveSection("services")
    if (servicesInView) setActiveSection("webdesign")
    if (socialMediaInView) setActiveSection("social-media")
    if (grafikdesignInView) setActiveSection("grafikdesign")
    if (portfolioInView) setActiveSection("portfolio")
    if (testimonialsInView) setActiveSection("testimonials")
    if (contactInView) setActiveSection("contact")
  }, [
    heroInView,
    serviceOverviewInView,
    servicesInView,
    socialMediaInView,
    grafikdesignInView,
    portfolioInView,
    testimonialsInView,
    contactInView,
  ])

  // Smooth scroll Funktion
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Offset für die Navbar
        behavior: "smooth",
      })
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setFormSubmitting(false)
      toast({
        title: "Nachricht gesendet!",
        description: "Wir werden uns in Kürze bei Ihnen melden.",
      })

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        message: "",
      })

      // Close modal if open
      setContactModalOpen(false)
    }, 1500)
  }

  // Open project detail modal
  const openProjectDetail = (project: { id: number; title: string; description: string; image: string }) => {
    setSelectedProject(project)
    setProjectModalOpen(true)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } },
  }

  const floatingAnimation = {
    y: ["-5px", "5px"],
    rotate: [-1, 1],
    transition: {
      y: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
      rotate: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  }

  // Pulsierende Animation für CTA-Buttons
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 15px rgba(255, 125, 58, 0.5)",
      "0 0 20px rgba(255, 125, 58, 0.8)",
      "0 0 15px rgba(255, 125, 58, 0.5)",
    ],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
    },
  }

  // Projektdaten
  const projects = [
    {
      id: 1,
      title: "Nexus-1",
      description:
        "Ein modernes Webportal für ein Technologieunternehmen mit Fokus auf innovative Lösungen. Das Design verbindet organische Formen mit technischen Elementen und schafft eine immersive Benutzererfahrung.",
      image: "/placeholder.svg?height=300&width=400&text=Projekt 1",
    },
    {
      id: 2,
      title: "Nexus-2",
      description:
        "Eine interaktive E-Commerce-Plattform mit innovativer Navigation und adaptiven Produktvisualisierungen. Benutzer können Produkte in einem 3D-Raum erkunden und mit ihnen interagieren.",
      image: "/placeholder.svg?height=300&width=400&text=Projekt 2",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] text-[#F0F0F0]">
      <ParticleBackground />

      {/* Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 w-full border-b border-[#121820] bg-[#1A1A1A]/90 backdrop-blur-md"
        style={{
          boxShadow: `0 5px 20px rgba(0, 0, 0, ${Math.min(0.5, scrollY / 500)})`,
        }}
      >
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection("home")}
            style={{ cursor: "pointer" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="relative"
            >
              <Image src="/images/logo.png" alt="ADAN MEDIA Logo" width={24} height={24} className="h-6 w-6" />
            </motion.div>
            <motion.span
              className="text-xl font-bold text-[#F0F0F0] tracking-wider"
              whileHover={{
                textShadow: "0 0 8px rgba(255, 125, 58, 0.7)",
              }}
            >
              ADAN
              <motion.span
                className="text-[#FF7D3A]"
                animate={{
                  textShadow: [
                    "0 0 4px rgba(255, 125, 58, 0.3)",
                    "0 0 8px rgba(255, 125, 58, 0.7)",
                    "0 0 4px rgba(255, 125, 58, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                MEDIA
              </motion.span>
            </motion.span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavItem href="#home" isActive={activeSection === "home"} onClick={() => scrollToSection("home")}>
              STARTSEITE
            </NavItem>
            <div className="relative group">
              <div className="flex items-center gap-1 cursor-pointer">
                <NavItem
                  href="#services"
                  isActive={
                    activeSection === "webdesign" ||
                    activeSection === "social-media" ||
                    activeSection === "grafikdesign"
                  }
                  onClick={() => scrollToSection("services")}
                >
                  LEISTUNGEN
                </NavItem>
                <ChevronDown className="h-4 w-4 text-[#B0B0B0] group-hover:text-[#FF7D3A] transition-colors" />
              </div>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-[#121820] ring-1 ring-black ring-opacity-5 overflow-hidden z-50 origin-top-right hidden group-hover:block">
                <div className="py-1">
                  <Link
                    href="#webdesign"
                    className="block px-4 py-2 text-sm text-[#B0B0B0] hover:bg-[#2A4165] hover:text-[#F0F0F0]"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection("webdesign")
                    }}
                  >
                    Webdesign
                  </Link>
                  <Link
                    href="#social-media"
                    className="block px-4 py-2 text-sm text-[#B0B0B0] hover:bg-[#2A4165] hover:text-[#F0F0F0]"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection("social-media")
                    }}
                  >
                    Social Media Marketing
                  </Link>
                  <Link
                    href="#grafikdesign"
                    className="block px-4 py-2 text-sm text-[#B0B0B0] hover:bg-[#2A4165] hover:text-[#F0F0F0]"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection("grafikdesign")
                    }}
                  >
                    Grafikdesign
                  </Link>
                </div>
              </div>
            </div>
            <NavItem
              href="#portfolio"
              isActive={activeSection === "portfolio"}
              onClick={() => scrollToSection("portfolio")}
            >
              PROJEKTE
            </NavItem>
            <NavItem
              href="#testimonials"
              isActive={activeSection === "testimonials"}
              onClick={() => scrollToSection("testimonials")}
            >
              REFERENZEN
            </NavItem>
            <NavItem href="#contact" isActive={activeSection === "contact"} onClick={() => scrollToSection("contact")}>
              KONTAKT
            </NavItem>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {isMobile && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-[#B0B0B0] hover:text-[#F0F0F0] hover:bg-[#121820]"
                >
                  <Menu className="h-5 w-5 text-[#FF7D3A]" />
                </Button>
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={pulseAnimation}
              onClick={() => setContactModalOpen(true)}
            >
              <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]">
                KONTAKT
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-20 md:py-28 relative overflow-hidden" ref={heroRef} id="home">
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              {isClient && (
                <motion.div
                  className="space-y-4 relative z-10"
                  initial={{ opacity: 0, x: -50 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="inline-block text-sm text-[#FF7D3A]"
                    whileHover={{
                      scale: 1.05,
                      textShadow: "0 0 15px rgba(255, 125, 58, 0.5)",
                    }}
                  >
                    ZUKUNFT DES DIGITALEN DESIGNS
                  </motion.div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F0F0F0] leading-tight">
                    <AnimatedText delay={0.1}>Wir erschaffen </AnimatedText>
                    <AnimatedText className="text-[#FF7D3A]" delay={0.2}>
                      innovative
                    </AnimatedText>
                    <AnimatedText delay={0.3}> digitale Erlebnisse</AnimatedText>
                  </h1>
                  <motion.p
                    className="text-[#B0B0B0] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    whileHover={{
                      color: "#F0F0F0",
                      scale: 1.01,
                      transition: { duration: 0.2 },
                    }}
                  >
                    Unser Team entwickelt kreative Webdesigns, die die Grenzen des Möglichen erweitern. Wir verbinden
                    moderne Technologie mit inspirierender Kreativität.
                  </motion.p>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row pt-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={pulseAnimation}
                      className="inline-block"
                    >
                      <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]">
                        PROJEKT STARTEN
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => scrollToSection("portfolio")}
                    >
                      <Button
                        variant="outline"
                        className="border-[#121820] text-[#B0B0B0] hover:bg-[#121820] hover:text-[#F0F0F0]"
                      >
                        PROJEKTE ENTDECKEN
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              {isClient && (
                <motion.div
                  className="mx-auto lg:ml-auto absolute md:relative md:opacity-100 opacity-30 top-0 right-0 left-0 z-0 md:z-10"
                  initial={{ opacity: 0, x: 50 }}
                  animate={heroInView ? { opacity: isMobile ? 0.3 : 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  {...floatingAnimation}
                >
                  <motion.div
                    className="relative"
                    whileHover={{
                      scale: 1.05,
                      rotate: 2,
                      transition: { duration: 0.3 },
                    }}
                    animate={{
                      x: [0, 10, -10, 0],
                      y: [0, -7, 7, 0],
                      rotate: [0, 1, -1, 0],
                      transition: {
                        x: {
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 8,
                          ease: "easeInOut",
                        },
                        y: {
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 6,
                          ease: "easeInOut",
                        },
                        rotate: {
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 10,
                          ease: "easeInOut",
                        },
                      },
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#FF7D3A] to-[#2A4165] opacity-30 blur-xl rounded-full"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    ></motion.div>
                    <img
                      src="/images/astronaut.png"
                      alt="Schwebender Astronaut"
                      className="relative w-full h-auto max-h-[500px] object-contain"
                    />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Leuchtender Trennstrich */}
        <div className="relative h-1 w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#FF7D3A] to-[#1A1A1A] animate-pulse"
            style={{ boxShadow: "0 0 20px rgba(255, 125, 58, 0.7)" }}
          ></div>
        </div>

        {/* Services Overview Section */}
        <section id="services" className="py-16 relative overflow-hidden bg-[#121212]" ref={serviceOverviewRef}>
          <div className="container px-4 md:px-6 relative">
            {isClient && (
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.span
                  className="text-sm text-[#FF7D3A] font-medium"
                  whileHover={{ scale: 1.05, textShadow: "0 0 15px rgba(255, 125, 58, 0.5)" }}
                >
                  UNSERE EXPERTISE
                </motion.span>
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mt-2 mb-6"
                  whileHover={{ scale: 1.02, textShadow: "0 0 8px rgba(255, 125, 58, 0.5)" }}
                >
                  Unser bewährter Prozess
                </motion.h2>
                <motion.p className="text-[#B0B0B0] max-w-2xl mx-auto" whileHover={{ color: "#F0F0F0" }}>
                  Wir bieten ein komplettes Spektrum an digitalen Dienstleistungen, von{" "}
                  <span className="font-bold text-[#FF7D3A]">Webdesign</span> über{" "}
                  <span className="font-bold text-[#FF7D3A]">Social Media Marketing</span> bis hin zu{" "}
                  <span className="font-bold text-[#FF7D3A]">Grafikdesign</span>
                </motion.p>
              </motion.div>
            )}

            {/* Process Steps */}
            {isClient && (
              <div className="relative mt-16 mb-24">
                {/* Connecting Line */}
                <div className="absolute top-[40px] left-[10%] right-[10%] h-1 bg-gradient-to-r from-[#FF7D3A]/10 via-[#FF7D3A]/50 to-[#FF7D3A]/10 transform hidden md:block"></div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-5 gap-16 md:gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
                >
                  {/* Step 1 - Webdesign */}
                  <motion.div
                    className="flex flex-col items-center relative z-10"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  >
                    <motion.div
                      className="w-24 h-24 rounded-full flex items-center justify-center relative"
                      whileHover={{ scale: 1.1 }}
                      onMouseEnter={createParticles}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full bg-[#FF7D3A]/20"
                        animate={{
                          boxShadow: ["0 0 20px 0px #FF7D3A", "0 0 30px 2px #FF7D3A", "0 0 20px 0px #FF7D3A"],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                      ></motion.div>
                      <div className="w-20 h-20 rounded-full bg-[#FF7D3A] flex items-center justify-center z-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-10 w-10 text-[#FFF]"
                        >
                          <path d="M12 19l7-7 3 3-7 7-3-3z" />
                          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                          <path d="M2 2l7.586 7.586" />
                          <circle cx="11" cy="11" r="2" />
                        </svg>
                      </div>
                    </motion.div>
                    <p className="text-center text-[#B0B0B0] mt-2">Kreative UI/UX & Visualisierung</p>
                  </motion.div>

                  {/* Step 2 - Social Media */}
                  <motion.div
                    className="flex flex-col items-center relative z-10"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                  >
                    <motion.div
                      className="w-24 h-24 rounded-full flex items-center justify-center relative"
                      whileHover={{ scale: 1.1 }}
                      onMouseEnter={createParticles}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full bg-[#FF7D3A]/20"
                        animate={{
                          boxShadow: ["0 0 20px 0px #FF7D3A", "0 0 30px 2px #FF7D3A", "0 0 20px 0px #FF7D3A"],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                      ></motion.div>
                      <div className="w-20 h-20 rounded-full bg-[#FF7D3A] flex items-center justify-center z-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-10 w-10 text-[#FFF]"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      </div>
                    </motion.div>
                    <p className="text-center text-[#B0B0B0] mt-2">Strategie &amp; Marketing</p>
                  </motion.div>

                  {/* Step 3 - Grafikdesign */}
                  <motion.div
                    className="flex flex-col items-center relative z-10"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >
                    <motion.div
                      className="w-24 h-24 rounded-full flex items-center justify-center relative"
                      whileHover={{ scale: 1.1 }}
                      onMouseEnter={createParticles}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full bg-[#FF7D3A]/20"
                        animate={{
                          boxShadow: ["0 0 20px 0px #FF7D3A", "0 0 30px 2px #FF7D3A", "0 0 20px 0px #FF7D3A"],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                      ></motion.div>
                      <div className="w-20 h-20 rounded-full bg-[#FF7D3A] flex items-center justify-center z-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-10 w-10 text-[#FFF]"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <path d="M20.4 14.5 16 10 4 20"></path>
                        </svg>
                      </div>
                    </motion.div>
                    <p className="text-center text-[#B0B0B0] mt-2">Visuelle Kommunikation</p>
                  </motion.div>

                  {/* Step 4 - Entwicklung */}
                  <motion.div
                    className="flex flex-col items-center relative z-10"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                  >
                    <motion.div
                      className="w-24 h-24 rounded-full flex items-center justify-center relative"
                      whileHover={{ scale: 1.1 }}
                      onMouseEnter={createParticles}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full bg-[#FF7D3A]/20"
                        animate={{
                          boxShadow: ["0 0 20px 0px #FF7D3A", "0 0 30px 2px #FF7D3A", "0 0 20px 0px #FF7D3A"],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                      ></motion.div>
                      <div className="w-20 h-20 rounded-full bg-[#FF7D3A] flex items-center justify-center z-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-10 w-10 text-[#FFF]"
                        >
                          <polyline points="16 18 22 12 16 6"></polyline>
                          <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                      </div>
                    </motion.div>
                    <p className="text-center text-[#B0B0B0] mt-2">Technische Umsetzung</p>
                  </motion.div>

                  {/* Step 5 - Launch */}
                  <motion.div
                    className="flex flex-col items-center relative z-10"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                  >
                    <motion.div
                      className="w-24 h-24 rounded-full flex items-center justify-center relative"
                      whileHover={{ scale: 1.1 }}
                      onMouseEnter={createParticles}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full bg-[#FF7D3A]/20"
                        animate={{
                          boxShadow: ["0 0 20px 0px #FF7D3A", "0 0 30px 2px #FF7D3A", "0 0 20px 0px #FF7D3A"],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                      ></motion.div>
                      <div className="w-20 h-20 rounded-full bg-[#FF7D3A] flex items-center justify-center z-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-10 w-10 text-[#FFF]"
                        >
                          <path d="M22 2L11 13"></path>
                          <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                        </svg>
                      </div>
                    </motion.div>
                    <p className="text-center text-[#B0B0B0] mt-2">Testing & Livegang</p>
                  </motion.div>
                </motion.div>
              </div>
            )}
          </div>
        </section>

        {/* Webdesign Section */}
        <section id="webdesign" className="py-12 md:py-20 relative overflow-hidden" ref={servicesRef}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#151515] to-[#1A1A1A] opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5"></div>
          <div className="container px-4 md:px-6 relative">
            {isClient && (
              <div className="grid gap-12 md:grid-cols-2 items-center">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="inline-block text-sm text-[#FF7D3A]"
                    whileHover={{
                      scale: 1.05,
                      textShadow: "0 0 15px rgba(255, 125, 58, 0.5)",
                    }}
                  >
                    WEBDESIGN & ENTWICKLUNG
                  </motion.div>
                  <motion.h2
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F0F0F0]"
                    whileHover={{
                      scale: 1.02,
                      textShadow: "0 0 8px rgba(255, 125, 58, 0.5)",
                    }}
                  >
                    Digitale Erlebnisse, die begeistern
                  </motion.h2>
                  <motion.p
                    className="text-[#B0B0B0] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                    whileHover={{
                      color: "#F0F0F0",
                      scale: 1.01,
                    }}
                  >
                    Wir entwickeln maßgeschneiderte Websites und Webanwendungen, die nicht nur gut aussehen, sondern
                    auch perfekt funktionieren. Unser Fokus liegt auf benutzerfreundlichem Design, technischer Exzellenz
                    und messbaren Ergebnissen.
                  </motion.p>

                  <div className="space-y-4">
                    <motion.div className="flex items-start" whileHover={{ x: 10, scale: 1.02 }}>
                      <motion.div
                        className="h-10 w-10 rounded-full bg-[#121820] flex items-center justify-center mr-4 mt-1 border border-[#FF7D3A]/30 flex-shrink-0"
                        whileHover={{
                          rotate: 360,
                          backgroundColor: "#2A4165",
                          borderColor: "#FF7D3A",
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-[#FF7D3A]"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="3" y1="9" x2="21" y2="9"></line>
                          <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                      </motion.div>
                      <div>
                        <motion.p className="font-medium text-[#F0F0F0]" whileHover={{ color: "#FF7D3A" }}>
                          Responsive Webdesign
                        </motion.p>
                        <motion.p className="text-sm text-[#B0B0B0]" whileHover={{ color: "#F0F0F0" }}>
                          Websites, die auf allen Geräten perfekt funktionieren - vom Smartphone bis zum Desktop.
                        </motion.p>
                      </div>
                    </motion.div>

                    <motion.div className="flex items-start" whileHover={{ x: 10, scale: 1.02 }}>
                      <motion.div
                        className="h-10 w-10 rounded-full bg-[#121820] flex items-center justify-center mr-4 mt-1 border border-[#FF7D3A]/30 flex-shrink-0"
                        whileHover={{
                          rotate: 360,
                          backgroundColor: "#2A4165",
                          borderColor: "#FF7D3A",
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-[#FF7D3A]"
                        >
                          <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path>
                          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </motion.div>
                      <div>
                        <motion.p className="font-medium text-[#F0F0F0]" whileHover={{ color: "#FF7D3A" }}>
                          Community Management
                        </motion.p>
                        <motion.p className="text-sm text-[#B0B0B0]" whileHover={{ color: "#F0F0F0" }}>
                          Kontinuierliche Betreuung Ihrer Social-Media-Kanäle mit schnellen Reaktionen auf Kommentare
                          und Nachrichten.
                        </motion.p>
                      </div>
                    </motion.div>

                    <motion.div className="flex items-start" whileHover={{ x: 10, scale: 1.02 }}>
                      <motion.div
                        className="h-10 w-10 rounded-full bg-[#121820] flex items-center justify-center mr-4 mt-1 border border-[#FF7D3A]/30 flex-shrink-0"
                        whileHover={{
                          rotate: 360,
                          backgroundColor: "#2A4165",
                          borderColor: "#FF7D3A",
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-[#FF7D3A]"
                        >
                          <path d="M3 3v18h18"></path>
                          <path d="m19 9-5 5-4-4-3 3"></path>
                        </svg>
                      </motion.div>
                      <div>
                        <motion.p className="font-medium text-[#F0F0F0]" whileHover={{ color: "#FF7D3A" }}>
                          Analyse & Optimierung
                        </motion.p>
                        <motion.p className="text-sm text-[#B0B0B0]" whileHover={{ color: "#F0F0F0" }}>
                          Datengestützte Entscheidungen durch regelmäßige Analyse und kontinuierliche Optimierung Ihrer
                          Kampagnen.
                        </motion.p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="pt-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={pulseAnimation}
                      className="inline-block"
                    >
                      <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]">
                        STRATEGIE ANFRAGEN
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
                <motion.div
                  className="relative hidden md:block"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div
                    className="relative rounded-lg overflow-hidden border border-[#121820]"
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 0 30px rgba(255, 125, 58, 0.3)",
                      transition: { duration: 0.3 },
                    }}
                  >
                    {/* Kreisförmiger leuchtender Schatten hinter dem Bild */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-[#FF7D3A]/30 blur-3xl"
                      animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    ></motion.div>
                    <img
                      src="/images/responsive-webdesign.png"
                      alt="Responsive Webdesign Showcase"
                      className="w-full h-auto object-cover relative z-10"
                    />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-[#121820] border-2 border-[#FF7D3A] flex items-center justify-center z-20"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 0.95, 1],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  >
                    <span className="text-[#FF7D3A] font-bold text-sm text-center">RESPONSIVE DESIGN</span>
                  </motion.div>
                </motion.div>
              </div>
            )}
          </div>
        </section>

        {/* Grafikdesign Section */}
        <section id="grafikdesign" className="py-12 md:py-20 bg-[#151515]" ref={grafikdesignRef}>
          <div className="container px-4 md:px-6 relative">
            {isClient && (
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.span
                  className="text-sm text-[#FF7D3A] font-medium"
                  whileHover={{ scale: 1.05, textShadow: "0 0 15px rgba(255, 125, 58, 0.5)" }}
                >
                  KREATIVE GESTALTUNG
                </motion.span>
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mt-2 mb-4"
                  whileHover={{ scale: 1.02, textShadow: "0 0 8px rgba(255, 125, 58, 0.5)" }}
                >
                  Grafikdesign für Social Media
                </motion.h2>
                <motion.p className="text-[#B0B0B0] max-w-2xl mx-auto" whileHover={{ color: "#F0F0F0" }}>
                  Wir gestalten visuelle Inhalte, die Aufmerksamkeit erregen und Ihre Marke perfekt repräsentieren
                </motion.p>
              </motion.div>
            )}

            {isClient && (
              <motion.div
                className="grid gap-6 md:grid-cols-3 items-start"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {[
                  {
                    title: "Post-Design",
                    description:
                      "Auffällige und teilbare Social-Media-Posts, die im Feed Ihrer Zielgruppe herausstechen",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <path d="M20.4 14.5 16 10 4 20"></path>
                      </svg>
                    ),
                    image: "/images/social-media-post.png",
                  },
                  {
                    title: "Story Design",
                    description:
                      "Interaktive und fesselnde Stories, die Ihre Follower begeistern und zum Mitmachen animieren",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    ),
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250408_1714_Innovatives%20Design-Erlebnis_remix_01jrazfcysfyjsd56tdvhwhmjf-dJjKRWTJkNDraSgrUvUimPRmGt3JxT.png",
                  },
                  {
                    title: "Branding & CI",
                    description:
                      "Durchgängige visuelle Identität für alle Ihre Social-Media-Kanäle, die Ihre Marke unverwechselbar macht",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8"
                      >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                      </svg>
                    ),
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250408_1725_Astronauten-Branding-Illustration_remix_01jrb040gefsws2mf6t1h340g6-AHWseUlJOBnhF1Q09DJxATp2Ml8qY7.png",
                  },
                ].map((service, i) => (
                  <motion.div
                    key={i}
                    className="group relative overflow-hidden"
                    variants={item}
                    whileHover={{ y: -10 }}
                  >
                    <motion.div
                      className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#FF7D3A] to-[#2A4165] opacity-20 blur-lg group-hover:opacity-70"
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    ></motion.div>
                    <div className="bg-[#121820] rounded-lg p-4 relative">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        className="w-full h-48 object-cover mb-6 rounded-md"
                      />
                      <div className="flex items-center gap-4 mb-3">
                        <motion.div
                          className="bg-[#0F1419] w-12 h-12 rounded-full flex items-center justify-center text-[#FF7D3A] flex-shrink-0"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          {service.icon}
                        </motion.div>
                        <h3 className="text-lg font-bold text-[#F0F0F0] group-hover:text-[#FF7D3A] transition-colors">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-[#B0B0B0] mb-4">{service.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {isClient && (
              <motion.div
                className="mt-16 bg-[#121820] p-8 rounded-lg border border-[#2A4165]/30"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-[#F0F0F0]">Komplettes Social Media Design-Paket</h3>
                    <p className="text-[#B0B0B0]">
                      Unser umfassendes Grafikdesign-Paket für Social Media umfasst alles, was Sie für eine konsistente
                      und professionelle Präsenz benötigen.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Profilbilder & Cover-Images",
                        "Post-Templates für verschiedene Formate",
                        "Story-Highlights & -Vorlagen",
                        "Anzeigendesigns für bezahlte Kampagnen",
                        "Infografiken & Datenvisualisierungen",
                        "Animierte GIFs & kurze Videos",
                      ].map((item, i) => (
                        <motion.li key={i} className="flex items-center" whileHover={{ x: 10, color: "#FF7D3A" }}>
                          <CheckCircle className="mr-2 h-4 w-4 text-[#FF7D3A]" />
                          <span className="text-[#F0F0F0]">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <motion.div className="pt-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]">
                        ANGEBOT ANFORDERN
                      </Button>
                    </motion.div>
                  </div>
                  <motion.div className="relative" whileHover={{ scale: 1.05, rotate: 1 }}>
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full bg-[#FF7D3A]/40 blur-xl opacity-0"
                      whileHover={{
                        width: "70%",
                        height: "70%",
                        opacity: 1,
                      }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                    <img
                      src="/images/social-media-mockup.png"
                      alt="Social Media Package"
                      className="w-full h-auto rounded-lg object-contain relative z-10"
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-12 md:py-20 relative" ref={portfolioRef}>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5"></div>
          <div className="container px-4 md:px-6 relative">
            {isClient && (
              <motion.div
                className="flex flex-col items-center justify-center space-y-4 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={portfolioInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-2">
                  <motion.div
                    className="inline-block text-sm text-[#FF7D3A]"
                    whileHover={{
                      scale: 1.05,
                      textShadow: "0 0 15px rgba(255, 125, 58, 0.5)",
                    }}
                  >
                    UNSERE PROJEKTE
                  </motion.div>
                  <motion.h2
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F0F0F0]"
                    whileHover={{
                      scale: 1.02,
                      textShadow: "0 0 8px rgba(255, 125, 58, 0.5)",
                    }}
                  >
                    Innovative Umsetzungen
                  </motion.h2>
                  <motion.p
                    className="max-w-[900px] text-[#B0B0B0] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                    whileHover={{
                      color: "#F0F0F0",
                      scale: 1.01,
                    }}
                  >
                    Entdecken Sie unsere Sammlung von Webdesign- und Entwicklungsprojekten, die neue Maßstäbe setzen.
                  </motion.p>
                </div>
              </motion.div>
            )}
            {isClient && (
              <motion.div
                className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2 mt-12"
                variants={container}
                initial="hidden"
                animate={portfolioInView ? "show" : "hidden"}
              >
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    className="group relative overflow-hidden rounded-lg"
                    variants={item}
                    whileHover={{
                      y: -10,
                      scale: 1.03,
                      transition: { duration: 0.3 },
                      zIndex: 10,
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#FF7D3A]/20 to-[#2A4165]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                      whileHover={{
                        opacity: 0.8,
                        background: "linear-gradient(to right, rgba(255, 125, 58, 0.3), rgba(42, 65, 101, 0.3))",
                      }}
                    ></motion.div>
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105 border border-[#121820]"
                      whileHover={{
                        filter: "brightness(1.2) contrast(1.1)",
                        boxShadow: "0 0 30px rgba(255, 125, 58, 0.5)",
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end z-20"
                      initial={{ y: 50, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                    >
                      <div className="p-4 text-[#F0F0F0] w-full">
                        <motion.h3 className="font-bold" whileHover={{ color: "#FF7D3A", x: 5 }}>
                          {project.title}
                        </motion.h3>
                        <motion.p className="text-sm text-[#B0B0B0]" whileHover={{ color: "#F0F0F0", x: 5 }}>
                          Webdesign & Entwicklung
                        </motion.p>
                        <motion.button
                          className="mt-2 text-xs text-[#FF7D3A] hover:text-[#FF9A66] flex items-center"
                          whileHover={{ x: 5 }}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          onClick={() => openProjectDetail(project)}
                        >
                          Projekt erkunden <ChevronDown className="h-3 w-3 ml-1 rotate-[-90deg] text-[#FF7D3A]" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            {isClient && (
              <motion.div
                className="flex justify-center mt-10"
                initial={{ opacity: 0 }}
                animate={portfolioInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    toast({
                      title: "Alle Projekte werden geladen",
                      description: "Bitte haben Sie einen Moment Geduld...",
                    })
                  }}
                >
                  <Button
                    variant="outline"
                    className="border-[#121820] text-[#B0B0B0] hover:bg-[#121820] hover:text-[#F0F0F0]"
                  >
                    ALLE PROJEKTE ENTDECKEN
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-12 md:py-20 bg-[#151515]" ref={testimonialsRef}>
          <div className="container px-4 md:px-6">
            {isClient && (
              <motion.div
                className="flex flex-col items-center justify-center space-y-4 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-2">
                  <motion.div
                    className="inline-block text-sm text-[#FF7D3A]"
                    whileHover={{
                      scale: 1.05,
                      textShadow: "0 0 15px rgba(255, 125, 58, 0.5)",
                    }}
                  >
                    KUNDENSTIMMEN
                  </motion.div>
                  <motion.h2
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F0F0F0]"
                    whileHover={{
                      scale: 1.02,
                      textShadow: "0 0 8px rgba(255, 125, 58, 0.5)",
                    }}
                  >
                    Feedback unserer Kunden
                  </motion.h2>
                  <motion.p
                    className="max-w-[900px] text-[#B0B0B0] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                    whileHover={{
                      color: "#F0F0F0",
                      scale: 1.01,
                    }}
                  >
                    Erfahren Sie, was unsere Kunden über ihre Zusammenarbeit mit uns zu berichten haben.
                  </motion.p>
                </div>
              </motion.div>
            )}
            {isClient && (
              <motion.div
                className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2 mt-12"
                variants={container}
                initial="hidden"
                animate={testimonialsInView ? "show" : "hidden"}
              >
                {[
                  {
                    name: "Sarah Müller",
                    company: "Quantum Innovations",
                    quote:
                      "Die Zusammenarbeit mit AdanMedia hat unsere digitale Präsenz auf ein neues Level gehoben. Ihr innovatives Design hat unsere Konversionsrate um 300% gesteigert.",
                  },
                  {
                    name: "Michael Chen",
                    company: "Stellar Solutions",
                    quote:
                      "Das Team von AdanMedia hat unsere Vision vom ersten Moment an verstanden. Sie haben ein digitales Portal erschaffen, das nicht nur visuell beeindruckt, sondern auch extrem schnell lädt.",
                  },
                ].map((testimonial, index) => (
                  <motion.div key={index} variants={item} whileHover={{ y: -10, transition: { duration: 0.3 } }}>
                    <TiltCard>
                      <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)] h-full">
                        <CardContent className="p-6">
                          <motion.div className="flex mb-4" whileHover={{ scale: 1.1, x: 5 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.div
                                key={star}
                                whileHover={{
                                  scale: 1.5,
                                  rotate: 360,
                                  transition: { duration: 0.5 },
                                }}
                              >
                                <Star className="h-5 w-5 fill-current text-[#FF7D3A]" />
                              </motion.div>
                            ))}
                          </motion.div>
                          <motion.p
                            className="mb-4 text-[#B0B0B0]"
                            whileHover={{
                              color: "#F0F0F0",
                              scale: 1.02,
                              textShadow: "0 0 5px rgba(255, 125, 58, 0.3)",
                            }}
                          >
                            "{testimonial.quote}"
                          </motion.p>
                          <motion.div className="flex items-center" whileHover={{ x: 5 }}>
                            <motion.div
                              className="h-10 w-10 rounded-full bg-[#121820] flex items-center justify-center mr-3 border border-[#FF7D3A]/30"
                              whileHover={{
                                scale: 1.1,
                                backgroundColor: "#2A4165",
                                borderColor: "#FF7D3A",
                              }}
                            >
                              <span className="text-[#FF7D3A] font-medium">{testimonial.name.charAt(0)}</span>
                            </motion.div>
                            <div>
                              <motion.p className="font-medium text-[#F0F0F0]" whileHover={{ color: "#FF7D3A" }}>
                                {testimonial.name}
                              </motion.p>
                              <motion.p className="text-sm text-[#B0B0B0]" whileHover={{ color: "#F0F0F0" }}>
                                {testimonial.company}
                              </motion.p>
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 md:py-20 relative" ref={contactRef}>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              {isClient && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: -50 }}
                  animate={contactInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-6 relative">
                    <motion.div
                      className="inline-block text-sm text-[#FF7D3A]"
                      whileHover={{
                        scale: 1.05,
                        textShadow: "0 0 15px rgba(255, 125, 58, 0.5)",
                      }}
                    >
                      KONTAKT
                    </motion.div>
                    <motion.img
                      src="/images/astronaut-lying.png"
                      alt="Liegender Astronaut"
                      className="w-40 h-auto md:w-56 z-0"
                      animate={floatingAnimation}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    />
                  </div>
                  <motion.h2
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F0F0F0] relative z-10 mb-4"
                    whileHover={{
                      scale: 1.02,
                      textShadow: "0 0 8px rgba(255, 125, 58, 0.5)",
                    }}
                  >
                    Bereit für Ihr Projekt?
                  </motion.h2>
                  <motion.p
                    className="text-[#B0B0B0] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                    whileHover={{
                      color: "#F0F0F0",
                      scale: 1.01,
                    }}
                  >
                    Kontaktieren Sie uns, um Ihr digitales Projekt zu besprechen. Unser Team steht bereit, Ihre Vision
                    in eine beeindruckende Realität zu transformieren.
                  </motion.p>
                  <div className="space-y-3">
                    <motion.div className="flex items-center" whileHover={{ x: 10, scale: 1.02 }}>
                      <motion.div
                        className="h-10 w-10 rounded-full bg-[#121820] flex items-center justify-center mr-3 border border-[#FF7D3A]/30"
                        whileHover={{
                          rotate: 360,
                          backgroundColor: "#2A4165",
                          borderColor: "#FF7D3A",
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Zap className="h-5 w-5 text-[#FF7D3A]" />
                      </motion.div>
                      <div>
                        <motion.p className="font-medium text-[#F0F0F0]" whileHover={{ color: "#FF7D3A" }}>
                          Schnelle Antwort
                        </motion.p>
                        <motion.p className="text-sm text-[#B0B0B0]" whileHover={{ color: "#F0F0F0" }}>
                          Wir antworten auf alle Anfragen innerhalb von 24 Stunden
                        </motion.p>
                      </div>
                    </motion.div>
                    <motion.div className="flex items-center" whileHover={{ x: 10, scale: 1.02 }}>
                      <motion.div
                        className="h-10 w-10 rounded-full bg-[#121820] flex items-center justify-center mr-3 border border-[#FF7D3A]/30"
                        whileHover={{
                          rotate: 360,
                          backgroundColor: "#2A4165",
                          borderColor: "#FF7D3A",
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <CheckCircle className="h-5 w-5 text-[#FF7D3A]" />
                      </motion.div>
                      <div>
                        <motion.p className="font-medium text-[#F0F0F0]" whileHover={{ color: "#FF7D3A" }}>
                          Kostenlose Erstberatung
                        </motion.p>
                        <motion.p className="text-sm text-[#B0B0B0]" whileHover={{ color: "#F0F0F0" }}>
                          Erhalten Sie eine kostenlose Erstberatung für Ihr Projekt
                        </motion.p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              {isClient && (
                <motion.div
                  className="mx-auto lg:ml-auto w-full max-w-md"
                  initial={{ opacity: 0, x: 50 }}
                  animate={contactInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <TiltCard>
                    <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.3)]">
                      <CardHeader>
                        <motion.div whileHover={{ color: "#FF7D3A", x: 5 }}>
                          <CardTitle className="text-[#F0F0F0]">Kontaktformular</CardTitle>
                        </motion.div>
                        <motion.div whileHover={{ color: "#F0F0F0", x: 5 }}>
                          <CardDescription className="text-[#B0B0B0]">
                            Senden Sie uns eine Nachricht und wir melden uns umgehend bei Ihnen.
                          </CardDescription>
                        </motion.div>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <motion.label
                                htmlFor="firstName"
                                className="text-sm font-medium text-[#F0F0F0]"
                                whileHover={{ color: "#FF7D3A", x: 2 }}
                              >
                                Vorname
                              </motion.label>
                              <motion.input
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-[#121820] bg-[#121212] px-3 py-2 text-sm text-[#F0F0F0] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#B0B0B0]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7D3A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Max"
                                whileHover={{
                                  borderColor: "#FF7D3A",
                                  boxShadow: "0 0 10px rgba(255, 125, 58, 0.3)",
                                }}
                                whileFocus={{
                                  borderColor: "#FF7D3A",
                                  boxShadow: "0 0 10px rgba(255, 125, 58, 0.5)",
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <motion.label
                                htmlFor="lastName"
                                className="text-sm font-medium text-[#F0F0F0]"
                                whileHover={{ color: "#FF7D3A", x: 2 }}
                              >
                                Nachname
                              </motion.label>
                              <motion.input
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-[#121820] bg-[#121212] px-3 py-2 text-sm text-[#F0F0F0] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#B0B0B0]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7D3A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Mustermann"
                                whileHover={{
                                  borderColor: "#FF7D3A",
                                  boxShadow: "0 0 10px rgba(255, 125, 58, 0.3)",
                                }}
                                whileFocus={{
                                  borderColor: "#FF7D3A",
                                  boxShadow: "0 0 10px rgba(255, 125, 58, 0.5)",
                                }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <motion.label
                              htmlFor="companyName"
                              className="text-sm font-medium text-[#F0F0F0]"
                              whileHover={{ color: "#FF7D3A", x: 2 }}
                            >
                              Unternehmen
                            </motion.label>
                            <motion.input
                              id="companyName"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              className="flex h-10 w-full rounded-md border border-[#121820] bg-[#121212] px-3 py-2 text-sm text-[#F0F0F0] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#B0B0B0]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7D3A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Musterfirma GmbH"
                              whileHover={{
                                borderColor: "#FF7D3A",
                                boxShadow: "0 0 10px rgba(255, 125, 58, 0.3)",
                              }}
                              whileFocus={{
                                borderColor: "#FF7D3A",
                                boxShadow: "0 0 10px rgba(255, 125, 58, 0.5)",
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <motion.label
                              htmlFor="email"
                              className="text-sm font-medium text-[#F0F0F0]"
                              whileHover={{ color: "#FF7D3A", x: 2 }}
                            >
                              E-Mail
                            </motion.label>
                            <motion.input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="flex h-10 w-full rounded-md border border-[#121820] bg-[#121212] px-3 py-2 text-sm text-[#F0F0F0] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#B0B0B0]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7D3A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="max.mustermann@beispiel.de"
                              whileHover={{
                                borderColor: "#FF7D3A",
                                boxShadow: "0 0 10px rgba(255, 125, 58, 0.3)",
                              }}
                              whileFocus={{
                                borderColor: "#FF7D3A",
                                boxShadow: "0 0 10px rgba(255, 125, 58, 0.5)",
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <motion.label
                              htmlFor="message"
                              className="text-sm font-medium text-[#F0F0F0]"
                              whileHover={{ color: "#FF7D3A", x: 2 }}
                            >
                              Nachricht
                            </motion.label>
                            <motion.textarea
                              id="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              className="flex min-h-[120px] w-full rounded-md border border-[#121820] bg-[#121212] px-3 py-2 text-sm text-[#F0F0F0] ring-offset-background placeholder:text-[#B0B0B0]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7D3A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Beschreiben Sie Ihr Projekt..."
                              whileHover={{
                                borderColor: "#FF7D3A",
                                boxShadow: "0 0 10px rgba(255, 125, 58, 0.3)",
                              }}
                              whileFocus={{
                                borderColor: "#FF7D3A",
                                boxShadow: "0 0 10px rgba(255, 125, 58, 0.5)",
                              }}
                            />
                          </div>
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} animate={pulseAnimation}>
                            <Button
                              className="w-full bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]"
                              type="submit"
                              disabled={formSubmitting}
                            >
                              {formSubmitting ? "WIRD GESENDET..." : "NACHRICHT SENDEN"}
                            </Button>
                          </motion.div>
                        </form>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#121820] bg-[#1A1A1A] py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("home")}
                style={{ cursor: "pointer" }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="relative"
                >
                  <Image src="/images/logo.png" alt="ADAN MEDIA Logo" width={24} height={24} className="h-6 w-6" />
                </motion.div>
                <motion.span
                  className="text-xl font-bold text-[#F0F0F0] tracking-wider"
                  whileHover={{
                    textShadow: "0 0 8px rgba(255, 125, 58, 0.7)",
                  }}
                >
                  ADAN
                  <motion.span
                    className="text-[#FF7D3A]"
                    animate={{
                      textShadow: [
                        "0 0 4px rgba(255, 125, 58, 0.3)",
                        "0 0 8px rgba(255, 125, 58, 0.7)",
                        "0 0 4px rgba(255, 125, 58, 0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    MEDIA
                  </motion.span>
                </motion.span>
              </motion.div>
            </div>
            <div>
              <motion.h3
                className="mb-4 text-sm font-medium text-[#F0F0F0]"
                whileHover={{
                  color: "#FF7D3A",
                  x: 5,
                }}
              >
                LEISTUNGEN
              </motion.h3>
              <ul className="space-y-2 text-sm">
                <motion.li whileHover={{ x: 10, scale: 1.05 }}>
                  <Link
                    href="#webdesign"
                    className="text-[#B0B0B0] hover:text-[#FF7D3A] transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection("webdesign")
                    }}
                  >
                    Webdesign
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 10, scale: 1.05 }}>
                  <Link
                    href="#social-media"
                    className="text-[#B0B0B0] hover:text-[#FF7D3A] transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection("social-media")
                    }}
                  >
                    Social Media Marketing
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 10, scale: 1.05 }}>
                  <Link
                    href="#grafikdesign"
                    className="text-[#B0B0B0] hover:text-[#FF7D3A] transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection("grafikdesign")
                    }}
                  >
                    Grafikdesign
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 10, scale: 1.05 }}>
                  <Link
                    href="#webdesign"
                    className="text-[#B0B0B0] hover:text-[#FF7D3A] transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection("webdesign")
                    }}
                  >
                    E-Commerce
                  </Link>
                </motion.li>
              </ul>
            </div>
            <div>
              <motion.h3
                className="mb-4 text-sm font-medium text-[#F0F0F0]"
                whileHover={{
                  color: "#FF7D3A",
                  x: 5,
                }}
              >
                UNTERNEHMEN
              </motion.h3>
              <ul className="space-y-2 text-sm">
                <motion.li whileHover={{ x: 10, scale: 1.05 }}>
                  <Link
                    href="#home"
                    className="text-[#B0B0B0] hover:text-[#FF7D3A] transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection("home")
                    }}
                  >
                    Über uns
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 10, scale: 1.05 }}>
                  <Link
                    href="#home"
                    className="text-[#B0B0B0] hover:text-[#FF7D3A] transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection("home")
                    }}
                  >
                    Team
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 10, scale: 1.05 }}>
                  <Link
                    href="#portfolio"
                    className="text-[#B0B0B0] hover:text-[#FF7D3A] transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection("portfolio")
                    }}
                  >
                    Projekte
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 10, scale: 1.05 }}>
                  <Link
                    href="#testimonials"
                    className="text-[#B0B0B0] hover:text-[#FF7D3A] transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection("testimonials")
                    }}
                  >
                    Referenzen
                  </Link>
                </motion.li>
              </ul>
            </div>
            <div>
              <motion.h3
                className="mb-4 text-sm font-medium text-[#F0F0F0]"
                whileHover={{
                  color: "#FF7D3A",
                  x: 5,
                }}
              >
                KONTAKT
              </motion.h3>
              <ul className="space-y-2 text-sm">
                <motion.li
                  className="text-[#B0B0B0]"
                  whileHover={{
                    color: "#F0F0F0",
                    x: 10,
                    scale: 1.05,
                  }}
                >
                  Musterstraße 123, 10115 Berlin
                </motion.li>
                <motion.li whileHover={{ x: 10, scale: 1.05 }}>
                  <Link
                    href="mailto:kontakt@adanmedia.de"
                    className="text-[#B0B0B0] hover:text-[#FF7D3A] transition-colors"
                  >
                    kontakt@adanmedia.de
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 10, scale: 1.05 }}>
                  <Link href="tel:+4930123456789" className="text-[#B0B0B0] hover:text-[#FF7D3A] transition-colors">
                    +49 (30) 123 456 789
                  </Link>
                </motion.li>
              </ul>
            </div>
          </div>
          <motion.div
            className="mt-8 border-t border-[#121820] pt-8 text-center text-sm text-[#B0B0B0]"
            whileHover={{
              color: "#F0F0F0",
              textShadow: "0 0 5px rgba(255, 125, 58, 0.3)",
            }}
          >
            <p>© {new Date().getFullYear()} AdanMedia. Alle Rechte vorbehalten.</p>
          </motion.div>
        </div>
      </footer>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        project={selectedProject}
      />

      {/* Contact Modal */}
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} handleSubmit={handleSubmit} />
    </div>
  )
}
