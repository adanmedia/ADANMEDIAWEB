"use server"

import { Resend } from "resend"
import { EmailTemplate } from "@/components/email-template"

// Definiere den Typ für die Formulardaten
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
  requestCallback?: boolean
}

// Initialisiere Resend mit einer Prüfung auf den API-Key
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function sendContactEmail(formData: ContactFormData) {
  try {
    // Überprüfe, ob Resend korrekt initialisiert wurde
    if (!resend) {
      console.error("Resend API key is missing")
      return {
        success: false,
        error: "E-Mail-Dienst ist nicht konfiguriert. Bitte kontaktieren Sie den Administrator.",
      }
    }

    // Validiere die Eingabedaten manuell
    if (!formData.name || !formData.email || !formData.message) {
      return {
        success: false,
        error: "Bitte füllen Sie alle erforderlichen Felder aus.",
      }
    }

    // Sende die E-Mail
    const { data, error } = await resend.emails.send({
      from: "Kontaktformular <onboarding@resend.dev>", // Verwende zunächst die Standard-E-Mail
      to: "kontakt@adanmedia.de", // Ändere dies zu deiner E-Mail-Adresse
      subject: `Neue Kontaktanfrage von ${formData.name}`,
      react: EmailTemplate({ formData }),
      reply_to: formData.email,
    })

    if (error) {
      console.error("Resend API error:", error)
      return {
        success: false,
        error: "Es gab ein Problem beim Senden der E-Mail.",
      }
    }

    return {
      success: true,
      data,
      message: "E-Mail erfolgreich gesendet!",
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      error: "Es gab ein unerwartetes Problem beim Senden der E-Mail.",
    }
  }
}
