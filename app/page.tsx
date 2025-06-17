"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Zap, X, Menu } from "lucide-react"
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect, useState, useRef } from "react"
import { toast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import {
  WebdesignSection,
  PhotographySection,
  VideographySection,
  VideoEditingSection,
  SocialMediaSection,
  GraphicDesignSection,
} from "@/components/service-sections"

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
                { id: "photography", label: "FOTOGRAFIE" },
                { id: "videography", label: "VIDEOGRAFIE" },
                { id: "video-editing", label: "VIDEOSCHNITT" },
                { id: "social-media", label: "SOCIAL MEDIA" },
                { id: "graphic-design", label: "GRAFIKDESIGN" },
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

  const [webdesignRef, webdesignInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [photographyRef, photographyInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [videographyRef, videographyInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [videoEditingRef, videoEditingInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [socialMediaRef, socialMediaInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [graphicDesignRef, graphicDesignInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [contactRef, contactInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // Aktualisiere aktiven Abschnitt basierend auf Scroll-Position
  useEffect(() => {
    if (heroInView) setActiveSection("home")
    if (webdesignInView) setActiveSection("webdesign")
    if (photographyInView) setActiveSection("photography")
    if (videographyInView) setActiveSection("videography")
    if (videoEditingInView) setActiveSection("video-editing")
    if (socialMediaInView) setActiveSection("social-media")
    if (graphicDesignInView) setActiveSection("graphic-design")
    if (contactInView) setActiveSection("contact")
  }, [
    heroInView,
    webdesignInView,
    photographyInView,
    videographyInView,
    videoEditingInView,
    socialMediaInView,
    graphicDesignInView,
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

  // Update the navigation in the header
  const navigation = (
    <nav className="hidden md:flex items-center gap-6">
      <NavItem href="#home" isActive={activeSection === "home"} onClick={() => scrollToSection("home")}>
        STARTSEITE
      </NavItem>
      <NavItem href="#webdesign" isActive={activeSection === "webdesign"} onClick={() => scrollToSection("webdesign")}>
        WEBDESIGN
      </NavItem>
      <NavItem
        href="#photography"
        isActive={activeSection === "photography"}
        onClick={() => scrollToSection("photography")}
      >
        FOTOGRAFIE
      </NavItem>
      <NavItem
        href="#videography"
        isActive={activeSection === "videography"}
        onClick={() => scrollToSection("videography")}
      >
        VIDEOGRAFIE
      </NavItem>
      <NavItem
        href="#video-editing"
        isActive={activeSection === "video-editing"}
        onClick={() => scrollToSection("video-editing")}
      >
        VIDEOSCHNITT
      </NavItem>
      <NavItem
        href="#social-media"
        isActive={activeSection === "social-media"}
        onClick={() => scrollToSection("social-media")}
      >
        SOCIAL MEDIA
      </NavItem>
      <NavItem
        href="#graphic-design"
        isActive={activeSection === "graphic-design"}
        onClick={() => scrollToSection("graphic-design")}
      >
        GRAFIKDESIGN
      </NavItem>
      <NavItem href="#contact" isActive={activeSection === "contact"} onClick={() => scrollToSection("contact")}>
        KONTAKT
      </NavItem>
    </nav>
  )

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
          {navigation}

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
                      onClick={() => scrollToSection("webdesign")}
                    >
                      <Button
                        variant="outline"
                        className="border-[#121820] text-[#B0B0B0] hover:bg-[#121820] hover:text-[#F0F0F0]"
                      >
                        SERVICES ENTDECKEN
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

        {/* Service Sections */}
        <div ref={webdesignRef}>
          <WebdesignSection />
        </div>

        <div ref={photographyRef}>
          <PhotographySection />
        </div>

        <div ref={videographyRef}>
          <VideographySection />
        </div>

        <div ref={videoEditingRef}>
          <VideoEditingSection />
        </div>

        <div ref={socialMediaRef}>
          <SocialMediaSection />
        </div>

        <div ref={graphicDesignRef}>
          <GraphicDesignSection />
        </div>

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
                SERVICES
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
                    href="#photography"
                    className="text-[#B0B0B0] hover:text-[#FF7D3A] transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection("photography")
                    }}
                  >
                    Fotografie
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 10, scale: 1.05 }}>
                  <Link
                    href="#videography"
                    className="text-[#B0B0B0] hover:text-[#FF7D3A] transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection("videography")
                    }}
                  >
                    Videografie
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

      {/* Contact Modal */}
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} handleSubmit={handleSubmit} />
    </div>
  )
}
