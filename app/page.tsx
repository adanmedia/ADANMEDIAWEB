"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { Mail } from "lucide-react"
import { RocketContactForm } from "@/components/rocket-contact-form"

// Particle Background Component
const ParticleBackground = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
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

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const isMobile = useMobile()
  const [contactModalOpen, setContactModalOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] text-[#F0F0F0]">
      <ParticleBackground />

      {/* Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 w-full border-b border-[#121820] bg-[#1A1A1A]/90 backdrop-blur-md"
      >
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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

          {/* Contact Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={pulseAnimation}
            onClick={() => setContactModalOpen(true)}
          >
            <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]">
              <Mail className="mr-2 h-4 w-4" />
              KONTAKT
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              {isClient && (
                <motion.div
                  className="space-y-4 relative z-10"
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
                    WEBSITE IM AUFBAU
                  </motion.div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F0F0F0] leading-tight">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="inline-block"
                    >
                      Wir arbeiten an
                    </motion.span>{" "}
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="inline-block text-[#FF7D3A]"
                    >
                      etwas Neuem
                    </motion.span>
                  </h1>
                  <motion.p
                    className="text-[#B0B0B0] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    whileHover={{
                      color: "#F0F0F0",
                      scale: 1.01,
                      transition: { duration: 0.2 },
                    }}
                  >
                    Unsere Website wird derzeit überarbeitet, um Ihnen bald ein noch besseres Erlebnis zu bieten. Wir
                    verbinden moderne Technologie mit inspirierender Kreativität.
                  </motion.p>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row pt-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={pulseAnimation}
                      className="inline-block"
                      onClick={() => setContactModalOpen(true)}
                    >
                      <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]">
                        KONTAKT AUFNEHMEN
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              {isClient && (
                <motion.div
                  className="mx-auto lg:ml-auto absolute md:relative md:opacity-100 opacity-30 top-0 right-0 left-0 z-0 md:z-10"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: isMobile ? 0.3 : 1, x: 0 }}
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

        {/* Coming Soon Section */}
        <section className="py-12 md:py-20 bg-[#151515]">
          <div className="container px-4 md:px-6 relative">
            <motion.div
              className="text-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6"
                whileHover={{ scale: 1.02, textShadow: "0 0 8px rgba(255, 125, 58, 0.5)" }}
              >
                Wir starten bald durch
              </motion.h2>
              <motion.p className="text-[#B0B0B0] mb-8" whileHover={{ color: "#F0F0F0" }}>
                Unsere neue Website wird ein komplettes Spektrum an digitalen Dienstleistungen bieten, von{" "}
                <span className="font-bold text-[#FF7D3A]">Webdesign</span> über{" "}
                <span className="font-bold text-[#FF7D3A]">Social Media Marketing</span> bis hin zu{" "}
                <span className="font-bold text-[#FF7D3A]">Grafikdesign</span>
              </motion.p>

              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.div
                  className="inline-block bg-[#121820] p-6 rounded-lg border border-[#2A4165]/30"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 125, 58, 0.3)" }}
                >
                  <h3 className="text-xl font-bold text-[#F0F0F0] mb-2">Bleiben Sie auf dem Laufenden</h3>
                  <p className="text-[#B0B0B0] mb-4">Kontaktieren Sie uns, um über den Launch informiert zu werden</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={pulseAnimation}
                    className="inline-block"
                    onClick={() => setContactModalOpen(true)}
                  >
                    <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]">
                      JETZT KONTAKTIEREN
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#121820] bg-[#1A1A1A] py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              className="flex items-center gap-2 mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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

            <motion.p
              className="text-sm text-[#B0B0B0]"
              whileHover={{
                color: "#F0F0F0",
                textShadow: "0 0 5px rgba(255, 125, 58, 0.3)",
              }}
            >
              © {new Date().getFullYear()} AdanMedia. Alle Rechte vorbehalten.
            </motion.p>
          </div>
        </div>
      </footer>

      {/* Rocket Contact Form */}
      <RocketContactForm open={contactModalOpen} onOpenChange={setContactModalOpen} />
    </div>
  )
}
