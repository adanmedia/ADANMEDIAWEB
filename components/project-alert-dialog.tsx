"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

interface ProjectAlertDialogProps {
  projectTitle: string
  projectDescription: string
  buttonText?: string
  buttonClassName?: string
}

export function ProjectAlertDialog({
  projectTitle,
  projectDescription,
  buttonText = "PROJEKT STARTEN",
  buttonClassName = "bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]",
}: ProjectAlertDialogProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    toast({
      title: "Projekt gestartet!",
      description: `Wir haben Ihre Anfrage für "${projectTitle}" erhalten und werden uns in Kürze bei Ihnen melden.`,
    })
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 15px rgba(255, 125, 58, 0.5)",
              "0 0 20px rgba(255, 125, 58, 0.8)",
              "0 0 15px rgba(255, 125, 58, 0.5)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
          className="inline-block"
        >
          <Button className={buttonClassName}>{buttonText}</Button>
        </motion.div>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#1A1A1A] border border-[#121820]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#F0F0F0]">{projectTitle}</AlertDialogTitle>
          <AlertDialogDescription className="text-[#B0B0B0]">{projectDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[#121820] text-[#B0B0B0] hover:bg-[#121820] hover:text-[#F0F0F0]">
            ABBRECHEN
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]"
            onClick={handleConfirm}
          >
            BESTÄTIGEN
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
