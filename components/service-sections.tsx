"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useInView, useAnimation, useTransform, useScroll } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Scissors, Instagram, Heart, MessageSquare, Share2, Palette } from "lucide-react"

// Helper component for parallax effect
const ParallaxImage = ({
  src,
  alt,
  className = "",
  strength = 100,
}: {
  src: string
  alt: string
  className?: string
  strength?: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, strength])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-full">
        <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-cover" loading="lazy" />
      </motion.div>
    </div>
  )
}

// Animated line component
const AnimatedLine = ({ delay = 0.2 }: { delay?: number }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start({
        width: "100%",
        transition: { duration: 0.8, delay },
      })
    }
  }, [isInView, controls, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ width: 0 }}
      animate={controls}
      className="h-px bg-gradient-to-r from-[#FF7D3A] to-transparent"
    />
  )
}

// Staggered text reveal component
const StaggeredText = ({
  text,
  className = "",
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) => {
  const words = text.split(" ")
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  }

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12 },
    },
  }

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {words.map((word, i) => (
        <motion.span key={i} className="inline-block mr-1" variants={child}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// 1. Webdesign Section
export const WebdesignSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <section id="webdesign" className="py-24 relative overflow-hidden bg-[#121212]">
      <div className="container px-4 md:px-6 relative">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Left side - Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
            }}
            className="relative"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="relative h-[500px] w-full">
                <Image
                  src="/placeholder.svg?height=800&width=600&text=Futuristic UI Mockup"
                  alt="Webdesign Interface Mockup"
                  fill
                  className="object-contain"
                  loading="lazy"
                />
              </div>
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#FF7D3A]/20 to-[#2A4165]/20 rounded-xl blur-xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </motion.div>

          {/* Right side - Text */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block text-sm text-[#FF7D3A]"
            >
              DIGITALE PRÄSENZ
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F0F0F0]"
            >
              Webdesign – Digitale Interfaces mit Weitblick
            </motion.h2>

            <StaggeredText
              text="Ihre Website ist mehr als eine Visitenkarte – sie ist das Zentrum Ihrer digitalen Kommunikation. Wir gestalten maßgeschneiderte Designs, die nicht nur gut aussehen, sondern strategisch wirken."
              className="text-[#B0B0B0] md:text-xl/relaxed"
              delay={0.4}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="pt-4"
            >
              <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]">
                DESIGN ENTDECKEN
              </Button>
            </motion.div>

            <AnimatedLine delay={0.8} />
          </div>
        </div>
      </div>
    </section>
  )
}

// 2. Photography Section
export const PhotographySection = () => {
  const imageRef = useRef(null)

  return (
    <section id="photography" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0F1419] opacity-90 z-0"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Left side - Text */}
          <div className="space-y-6 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block text-sm text-[#FF7D3A]"
            >
              VISUELLE KOMMUNIKATION
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F0F0F0]"
            >
              Werbefotografie – Bilder mit Schwerkraft
            </motion.h2>

            <StaggeredText
              text="Visuelle Wirkung beginnt mit starken Motiven. Ob Produkt, Mensch oder Raum – wir setzen Ihre Marke in Szene mit Bildern, die Emotionen erzeugen und im Gedächtnis bleiben."
              className="text-[#B0B0B0] md:text-xl/relaxed"
              delay={0.4}
            />

            {/* Mini Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-3 pt-4"
            >
              {[
                "/placeholder.svg?height=200&width=200&text=Product",
                "/placeholder.svg?height=200&width=200&text=Portrait",
                "/placeholder.svg?height=200&width=200&text=Architecture",
              ].map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-24 rounded-md overflow-hidden border border-[#121820]"
                >
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`Photography style ${i + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </motion.div>

            <AnimatedLine delay={0.8} />
          </div>

          {/* Right side - Image with Parallax */}
          <div ref={imageRef} className="relative h-[500px] order-1 md:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative h-full w-full rounded-xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <ParallaxImage
                src="/placeholder.svg?height=800&width=600&text=Atmospheric Photography"
                alt="Professional Photography"
                className="h-full w-full"
                strength={-50}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1419] via-transparent to-transparent opacity-70"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 3. Videography Section
export const VideographySection = () => {
  const videoRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1])

  return (
    <section id="videography" className="py-24 relative overflow-hidden bg-[#121212]">
      <div className="container px-4 md:px-6 relative">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Left side - Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 relative z-10"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block text-sm text-[#FF7D3A]"
            >
              BEWEGTBILD
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F0F0F0]"
            >
              Werbevideografie – Bewegtbild mit Wirkung
            </motion.h2>

            <StaggeredText
              text="Wir erzählen Ihre Geschichte mit bewegten Bildern, die hängen bleiben. Von der ersten Idee über das Storyboard bis zur finalen Produktion – Ihre Vision in flüssigem Format."
              className="text-[#B0B0B0] md:text-xl/relaxed"
              delay={0.4}
            />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="pt-4 flex justify-end"
            >
              <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)] group">
                <span>VIDEOIDEE STARTEN</span>
                <Play className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Video Mockup */}
          <div ref={videoRef} className="relative h-[400px] md:h-[500px]">
            <motion.div style={{ scale, opacity }} className="relative h-full w-full rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7D3A]/10 to-[#2A4165]/10 z-0"></div>
              <div className="relative h-full w-full">
                <Image
                  src="/placeholder.svg?height=800&width=600&text=Video Production"
                  alt="Video Production"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="h-16 w-16 rounded-full bg-[#FF7D3A]/80 flex items-center justify-center cursor-pointer"
                  >
                    <Play className="h-8 w-8 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 4. Video Editing Section
export const VideoEditingSection = () => {
  return (
    <section id="video-editing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0F1419] opacity-90 z-0"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Left side - Split Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[400px] md:h-[500px]"
          >
            <div className="grid grid-cols-2 gap-2 h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative h-full rounded-l-xl overflow-hidden"
              >
                <Image
                  src="/placeholder.svg?height=800&width=400&text=Editing Software"
                  alt="Video Editing Software"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </motion.div>
              <div className="space-y-2 h-full">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 * i }}
                    viewport={{ once: true }}
                    className="relative h-1/3 rounded-r-xl overflow-hidden"
                  >
                    <Image
                      src={`/keyframe-placeholder.png?height=200&width=200&text=Keyframe ${i}`}
                      alt={`Video Keyframe ${i}`}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Animated cutting lines */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.8 }}
              viewport={{ once: true }}
              className="absolute top-1/3 left-0 h-0.5 bg-[#FF7D3A]/70"
            />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1, delay: 1 }}
              viewport={{ once: true }}
              className="absolute top-2/3 left-0 h-0.5 bg-[#FF7D3A]/70"
            />
          </motion.div>

          {/* Right side - Text */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block text-sm text-[#FF7D3A]"
            >
              POSTPRODUKTION
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F0F0F0]"
            >
              Videoschnitt – Der Feinschliff zum Finale
            </motion.h2>

            <StaggeredText
              text="Ein guter Schnitt ist unsichtbar – aber entscheidend. Wir veredeln Ihr Rohmaterial mit Rhythmus, Dramaturgie, Color Grading und Sound, bis aus einzelnen Szenen ein stimmiger Film entsteht."
              className="text-[#B0B0B0] md:text-xl/relaxed"
              delay={0.4}
            />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center pt-4"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="h-10 w-10 rounded-full bg-[#121820] flex items-center justify-center mr-4 border border-[#FF7D3A]/30"
              >
                <Scissors className="h-5 w-5 text-[#FF7D3A]" />
              </motion.div>
              <div>
                <p className="font-medium text-[#F0F0F0]">Professioneller Schnitt</p>
                <p className="text-sm text-[#B0B0B0]">Von Rohschnitt bis zur finalen Fassung</p>
              </div>
            </motion.div>

            <AnimatedLine delay={0.8} />
          </div>
        </div>
      </div>
    </section>
  )
}

// 5. Social Media Marketing Section
export const SocialMediaSection = () => {
  return (
    <section id="social-media" className="py-24 relative overflow-hidden bg-[#0A0D12]">
      <div className="container px-4 md:px-6 relative">
        {/* Floating social media icons */}
        {[
          { icon: <Heart className="h-6 w-6 text-[#FF7D3A]" />, x: "10%", y: "20%", delay: 0 },
          { icon: <MessageSquare className="h-6 w-6 text-[#2A4165]" />, x: "80%", y: "70%", delay: 0.5 },
          { icon: <Share2 className="h-6 w-6 text-[#FF7D3A]" />, x: "70%", y: "30%", delay: 1 },
          { icon: <Instagram className="h-8 w-8 text-[#2A4165]" />, x: "20%", y: "80%", delay: 1.5 },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.7, scale: 1 }}
            transition={{ duration: 0.8, delay: item.delay }}
            viewport={{ once: true }}
            className="absolute z-0"
            style={{ left: item.x, top: item.y }}
          >
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: i * 0.5,
              }}
            >
              {item.icon}
            </motion.div>
          </motion.div>
        ))}

        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Left side - Text */}
          <div className="space-y-6 relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block text-sm text-[#FF7D3A]"
            >
              DIGITALE PRÄSENZ
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F0F0F0]"
            >
              Social Media Marketing – Markenführung im Orbit
            </motion.h2>

            <StaggeredText
              text="Wir entwickeln Content, Kampagnen und Strategien, die nicht nur Reichweite schaffen, sondern Ihre Marke nachhaltig in den Köpfen verankern. Plattformübergreifend. Zielgerichtet. Echt."
              className="text-[#B0B0B0] md:text-xl/relaxed"
              delay={0.4}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="pt-4"
            >
              <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]">
                STRATEGIE ANFRAGEN
              </Button>
            </motion.div>
          </div>

          {/* Right side - Social Media Carousel */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * i }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, zIndex: 10 }}
                    className="relative"
                  >
                    <Card className="overflow-hidden border border-[#121820] bg-[#151515] shadow-lg">
                      <div className="relative h-40">
                        <Image
                          src={`/social-post-placeholder.png?height=300&width=300&text=Social Post ${i}`}
                          alt={`Social Media Post ${i}`}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-[#F0F0F0] font-medium truncate">Social Media Campaign</p>
                        <div className="flex items-center mt-2 text-[#B0B0B0] text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          <span>{Math.floor(Math.random() * 1000)}</span>
                          <MessageSquare className="h-3 w-3 ml-2 mr-1" />
                          <span>{Math.floor(Math.random() * 100)}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 6. Graphic Design Section
export const GraphicDesignSection = () => {
  const lineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start end", "end start"],
  })

  const width = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"])

  return (
    <section id="graphic-design" className="py-24 relative overflow-hidden bg-[#121212]">
      <div className="container px-4 md:px-6 relative">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Left side - Text */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block text-sm text-[#FF7D3A]"
            >
              MARKENIDENTITÄT
            </motion.div>

            {/* Animated line-by-line text reveal */}
            <div className="space-y-2">
              {["Grafikdesign –", "Visuelle Identität", "mit Charakter"].map((line, i) => (
                <motion.h2
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 * i }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold tracking-tighter text-[#F0F0F0]"
                >
                  {line}
                </motion.h2>
              ))}
            </div>

            <StaggeredText
              text="Gutes Design kommuniziert, bevor ein Wort gesprochen wird. Wir erschaffen Markenbilder, die Wiedererkennbarkeit, Stil und Substanz verbinden."
              className="text-[#B0B0B0] md:text-xl/relaxed"
              delay={0.6}
            />

            <div ref={lineRef} className="relative h-1 w-full overflow-hidden">
              <motion.div style={{ width }} className="absolute inset-0 bg-gradient-to-r from-[#FF7D3A] to-[#2A4165]" />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="pt-4"
            >
              <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)] group">
                <span>DESIGN ANFRAGEN</span>
                <Palette className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              </Button>
            </motion.div>
          </div>

          {/* Right side - Branding Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.03, rotate: 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-[500px] rounded-xl overflow-hidden"
            >
              <Image
                src="/placeholder.svg?height=800&width=600&text=Branding Mockup"
                alt="Branding and Visual Identity"
                fill
                className="object-cover"
                loading="lazy"
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#121212] to-transparent"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-[#FF7D3A] flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div>
                    <p className="text-[#F0F0F0] font-medium">ADAN MEDIA</p>
                    <p className="text-[#B0B0B0] text-sm">Brand Identity</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating design elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-[#2A4165] flex items-center justify-center"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <div className="h-12 w-12 rounded-full bg-[#FF7D3A] flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
