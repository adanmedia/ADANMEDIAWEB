"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { sendContactEmail } from "@/actions/contact"

interface RocketContactFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RocketContactForm({ open, onOpenChange }: RocketContactFormProps) {
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [isLaunching, setIsLaunching] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    requestCallback: false,
  })

  // Reset animation state when modal closes
  useEffect(() => {
    if (!open) {
      setIsLaunching(false)
    }
  }, [open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      requestCallback: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validiere Formular auf Client-Seite
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle erforderlichen Felder aus.",
        variant: "destructive",
      })
      return
    }

    setFormSubmitting(true)
    setIsLaunching(true)

    try {
      // Für Entwicklungszwecke: Simuliere erfolgreichen Versand, wenn kein API-Key vorhanden ist
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode: Simulating email send", formData)

        // Warte für Animation
        setTimeout(() => {
          setFormSubmitting(false)
          toast({
            title: "Nachricht gesendet! (Entwicklungsmodus)",
            description: "Im Produktionsmodus würde diese Nachricht per E-Mail gesendet werden.",
          })

          // Reset form
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
            requestCallback: false,
          })

          // Close modal after rocket has "launched"
          onOpenChange(false)
        }, 1000)

        return
      }

      // Sende die Formulardaten an die Server Action
      const result = await sendContactEmail(formData)
      console.log("Email send result:", result)

      if (result.success) {
        // Warte für Animation
        setTimeout(() => {
          setFormSubmitting(false)
          toast({
            title: "Nachricht gesendet!",
            description: "Wir werden uns in Kürze bei Ihnen melden.",
          })

          // Reset form
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
            requestCallback: false,
          })

          // Close modal after rocket has "launched"
          onOpenChange(false)
        }, 1000) // Match this with animation duration
      } else {
        // Bei Fehler Animation stoppen und Fehler anzeigen
        setTimeout(() => {
          setIsLaunching(false)
          setFormSubmitting(false)
          toast({
            title: "Fehler",
            description: result.error || "Beim Senden ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
            variant: "destructive",
          })
        }, 500)
      }
    } catch (error) {
      console.error("Form submission error:", error)

      // Bei Ausnahme Animation stoppen und Fehler anzeigen
      setTimeout(() => {
        setIsLaunching(false)
        setFormSubmitting(false)
        toast({
          title: "Fehler",
          description: "Beim Senden ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
          variant: "destructive",
        })
      }, 500)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !formSubmitting && !isLaunching && onOpenChange(newOpen)}>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              className="fixed inset-0 bg-black/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !formSubmitting && !isLaunching && onOpenChange(false)}
            />

            <motion.div
              className="relative bg-[#1A1A1A] border border-[#121820] rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden"
              initial={{ y: -1000, rotate: 5 }}
              animate={
                isLaunching
                  ? { y: -1000, rotate: -5, transition: { duration: 0.8, ease: "easeIn" } }
                  : { y: 0, rotate: 0 }
              }
              exit={{ y: -1000, rotate: -5, transition: { duration: 0.5 } }}
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
            >
              {/* Rocket Body */}
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-[#F0F0F0]">Kontakt aufnehmen</DialogTitle>
                  <DialogDescription className="text-[#B0B0B0]">
                    Senden Sie uns eine Nachricht und wir melden uns umgehend bei Ihnen.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#F0F0F0]">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-[#121212] border-[#121820] text-[#F0F0F0] focus-visible:ring-[#FF7D3A]"
                      placeholder="Max Mustermann"
                      required
                      disabled={formSubmitting || isLaunching}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#F0F0F0]">
                      E-Mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-[#121212] border-[#121820] text-[#F0F0F0] focus-visible:ring-[#FF7D3A]"
                      placeholder="max.mustermann@beispiel.de"
                      required
                      disabled={formSubmitting || isLaunching}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#F0F0F0]">
                      Telefonnummer (optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-[#121212] border-[#121820] text-[#F0F0F0] focus-visible:ring-[#FF7D3A]"
                      placeholder="+49 123 456789"
                      disabled={formSubmitting || isLaunching}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#F0F0F0]">
                      Nachricht
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="min-h-[120px] bg-[#121212] border-[#121820] text-[#F0F0F0] focus-visible:ring-[#FF7D3A]"
                      placeholder="Wie können wir Ihnen helfen?"
                      required
                      disabled={formSubmitting || isLaunching}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requestCallback"
                      checked={formData.requestCallback}
                      onCheckedChange={handleCheckboxChange}
                      className="data-[state=checked]:bg-[#FF7D3A] data-[state=checked]:border-[#FF7D3A]"
                      disabled={formSubmitting || isLaunching}
                    />
                    <Label htmlFor="requestCallback" className="text-[#F0F0F0] text-sm">
                      Ich möchte zurückgerufen werden
                    </Label>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={formSubmitting || isLaunching}
                      className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)] w-full"
                    >
                      {formSubmitting ? "Wird gesendet..." : isLaunching ? "Abflug!" : "Nachricht senden"}
                    </Button>
                  </DialogFooter>
                </form>
              </div>

              {/* Rocket Fins */}
              <div className="absolute -left-4 bottom-20 w-4 h-16 bg-[#2A4165] skew-y-[45deg]"></div>
              <div className="absolute -right-4 bottom-20 w-4 h-16 bg-[#2A4165] skew-y-[-45deg]"></div>

              {/* Rocket Flames */}
              <div className="relative h-16 overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  {/* Main flame */}
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-t from-[#FF7D3A] via-[#FFA500] to-[#FFFF00]"
                    style={{ borderRadius: "50% 50% 0 0" }}
                    animate={{
                      height: isLaunching ? [24, 48] : [16, 24, 20, 24],
                      width: isLaunching ? [24, 32] : [24, 28, 24, 28],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: isLaunching ? 0 : Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />

                  {/* Side flames */}
                  <motion.div
                    className="absolute bottom-0 left-[calc(50%-40px)] w-12 h-16 bg-gradient-to-t from-[#FF7D3A] via-[#FFA500] to-transparent"
                    style={{ borderRadius: "50% 50% 0 0" }}
                    animate={{
                      height: isLaunching ? [16, 32] : [12, 16, 14, 16],
                      opacity: isLaunching ? [1, 0.8] : [0.7, 0.9, 0.7, 0.9],
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: isLaunching ? 0 : Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />

                  <motion.div
                    className="absolute bottom-0 right-[calc(50%-40px)] w-12 h-16 bg-gradient-to-t from-[#FF7D3A] via-[#FFA500] to-transparent"
                    style={{ borderRadius: "50% 50% 0 0" }}
                    animate={{
                      height: isLaunching ? [16, 32] : [12, 16, 14, 16],
                      opacity: isLaunching ? [1, 0.8] : [0.7, 0.9, 0.7, 0.9],
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: isLaunching ? 0 : Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      delay: 0.1,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
