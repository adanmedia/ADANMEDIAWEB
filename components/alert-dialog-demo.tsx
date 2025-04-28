"use client"
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

export function AlertDialogDemo() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8 bg-[#1A1A1A] rounded-lg border border-[#121820]">
      <h2 className="text-2xl font-bold text-[#F0F0F0]">Alert Dialog Beispiel</h2>
      <p className="text-[#B0B0B0] text-center max-w-md">
        Alert Dialogs werden verwendet, um den Benutzer über wichtige Informationen zu benachrichtigen oder eine
        Bestätigung für kritische Aktionen einzuholen.
      </p>

      <AlertDialog>
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
            <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.  hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]">
              Dialog öffnen
            </Button>
          </motion.div>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#1A1A1A] border border-[#121820]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#F0F0F0]">Sind Sie sicher?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#B0B0B0]">
              Diese Aktion kann nicht rückgängig gemacht werden. Dies wird dauerhaft die Daten von unseren Servern
              löschen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#121820] text-[#B0B0B0] hover:bg-[#121820] hover:text-[#F0F0F0]">
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]"
              onClick={() => {
                toast({
                  title: "Aktion bestätigt",
                  description: "Die Aktion wurde erfolgreich durchgeführt.",
                })
              }}
            >
              Fortfahren
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
