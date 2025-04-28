"use server"

import { z } from "zod"
import { Resend } from "resend"
import { EmailTemplate } from "@/components/email-template"

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  requestCallback: z.boolean().optional(),
})

export type ContactFormData = z.infer<typeof schema>

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: ContactFormData) {
  try {
    // Sende die E-Mail
    const { data, error } = await resend.emails.send({
      from: "Kontaktformular <kontakt@adanmedia.de>", // Ändere dies zu deiner verifizierten Domain
      to: "kontakt@adanmedia.de", // Ändere dies zu deiner E-Mail-Adresse
      subject: "Neue Kontaktanfrage",
      react: EmailTemplate({ formData: formData }),
      reply_to: formData.email,
    })

    if (error) {
      console.error(error)
      return { success: false, error: "Es gab ein Problem beim Senden der E-Mail." }
    }

    return { success: true, data: data, message: "E-Mail erfolgreich gesendet!" }
  } catch (error) {
    console.error("Fehler beim Senden der E-Mail:", error)
    return { success: false, error: "Es gab ein Problem beim Senden der E-Mail." }
  }
}
