"use server"

import { Resend } from "resend"

// Definiere den Typ für die Formulardaten
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
  requestCallback?: boolean
}

// Initialisiere Resend mit dem API-Key
const resendApiKey = process.env.RESEND_API_KEY || "re_jRiGSWun_Hs8h3NXheYvw5mX7FgnBUKbX"
const resend = new Resend(resendApiKey)

// Ändere die Konstanten für die E-Mail-Adressen
const TEST_EMAIL = "julianfernandezkreis@gmail.com"
const PRODUCTION_EMAIL = "kontakt@adanmedia.de"
const ADDITIONAL_EMAIL = "julianfernandezkreis@gmail.com"

// Im Testmodus kann Resend nur E-Mails an die E-Mail-Adresse des Kontoinhabers senden
// Für die Produktion: Verifiziere eine Domain bei Resend und ändere diese E-Mail-Adresse

// Ändere die E-Mail-Versandmethode, um sowohl HTML als auch Text zu unterstützen
export async function sendContactEmail(formData: ContactFormData) {
  try {
    // Validiere die Eingabedaten manuell
    if (!formData.name || !formData.email || !formData.message) {
      console.log("Validation error: Missing required fields")
      return {
        success: false,
        error: "Bitte füllen Sie alle erforderlichen Felder aus.",
      }
    }

    console.log("Attempting to send email with data:", {
      name: formData.name,
      email: formData.email,
      hasPhone: !!formData.phone,
      messageLength: formData.message.length,
      requestCallback: formData.requestCallback,
    })

    // Erstelle einen einfachen Text-Fallback für die E-Mail
    const textContent = `
Neue Kontaktanfrage von ${formData.name}

Kontaktdetails:
Name: ${formData.name}
E-Mail: ${formData.email}
${formData.phone ? `Telefon: ${formData.phone}` : ""}
Rückruf: ${formData.requestCallback ? "Ja, bitte zurückrufen" : "Nicht erforderlich"}

Nachricht:
${formData.message}

Diese E-Mail wurde automatisch vom Kontaktformular deiner Website gesendet.
© ${new Date().getFullYear()} ADAN MEDIA
    `.trim()

    // Erstelle direktes HTML anstelle der React-Komponente
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Neue Kontaktanfrage</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #FF7D3A; }
    h2 { color: #FF7D3A; margin-top: 20px; }
    .message { background-color: #f5f5f5; padding: 15px; border-radius: 6px; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Neue Kontaktanfrage</h1>
    <p>Von deinem ADAN MEDIA Website-Kontaktformular</p>

    <div>
      <h2>Kontaktdetails:</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>E-Mail:</strong> ${formData.email}</p>
      ${formData.phone ? `<p><strong>Telefon:</strong> ${formData.phone}</p>` : ""}
      <p><strong>Rückruf:</strong> ${formData.requestCallback ? "Ja, bitte zurückrufen" : "Nicht erforderlich"}</p>
    </div>

    <div>
      <h2>Nachricht:</h2>
      <div class="message">${formData.message.replace(/\n/g, "<br>")}</div>
    </div>

    <div class="footer">
      <p>Diese E-Mail wurde automatisch vom Kontaktformular deiner Website gesendet.</p>
      <p>© ${new Date().getFullYear()} ADAN MEDIA</p>
    </div>
  </div>
</body>
</html>
    `.trim()

    // Sende die E-Mail mit direktem HTML und Text-Fallback
    const { data, error } = await resend.emails.send({
      from: "ADAN MEDIA <kontakt@adanmedia.de>",
      to: [PRODUCTION_EMAIL, ADDITIONAL_EMAIL],
      subject: `Neue Kontaktanfrage von ${formData.name}`,
      html: htmlContent,
      text: textContent,
      reply_to: formData.email,
    })

    if (error) {
      console.error("Resend API error:", error)
      return {
        success: false,
        error: "Es gab ein Problem beim Senden der E-Mail: " + (error.message || JSON.stringify(error)),
      }
    }

    // Erstelle die Bestätigungs-E-Mail für den Absender
    const confirmationHtmlContent = createConfirmationEmail(formData.name)
    const confirmationTextContent = `
Vielen Dank für deine Nachricht, ${formData.name}!

Wir haben deine Anfrage erhalten und werden uns in Kürze bei dir melden.

Deine Nachricht:
${formData.message}

Mit freundlichen Grüßen,
Dein ADAN MEDIA Team
© ${new Date().getFullYear()} ADAN MEDIA
    `.trim()

    // Sende die Bestätigungs-E-Mail an den Absender
    const { data: confirmationData, error: confirmationError } = await resend.emails.send({
      from: "ADAN MEDIA <kontakt@adanmedia.de>",
      to: [formData.email],
      subject: "Vielen Dank für deine Nachricht | ADAN MEDIA",
      html: confirmationHtmlContent,
      text: confirmationTextContent,
    })

    if (confirmationError) {
      console.error("Confirmation email error:", confirmationError)
      // Wir geben trotzdem einen Erfolg zurück, da die Hauptmail gesendet wurde
    } else {
      console.log("Confirmation email sent successfully:", confirmationData)
    }

    console.log("Email sent successfully:", data)
    return {
      success: true,
      data,
      message: "E-Mail erfolgreich gesendet!",
    }
  } catch (error: any) {
    console.error("Error sending email:", error)
    return {
      success: false,
      error: "Es gab ein unerwartetes Problem beim Senden der E-Mail: " + (error.message || JSON.stringify(error)),
    }
  }
}

// Funktion zum Erstellen der Bestätigungs-E-Mail
function createConfirmationEmail(name: string) {
  const currentYear = new Date().getFullYear()

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vielen Dank für deine Nachricht</title>
  <style>
    /* Basis-Styling */
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      background-color: #1A1A1A;
      color: #F0F0F0;
    }
    
    /* E-Mail-Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1A1A1A;
      border: 1px solid #121820;
      border-radius: 8px;
      overflow: hidden;
    }
    
    /* Header */
    .header {
      background-color: #121212;
      padding: 30px 20px;
      text-align: center;
      border-bottom: 1px solid #2A4165;
    }
    
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #F0F0F0;
      letter-spacing: 2px;
    }
    
    .logo-highlight {
      color: #FF7D3A;
    }
    
    /* Content */
    .content {
      padding: 30px 20px;
      background-color: #1A1A1A;
    }
    
    h1 {
      color: #FF7D3A;
      margin-top: 0;
      font-size: 24px;
      margin-bottom: 20px;
    }
    
    p {
      margin-bottom: 20px;
      color: #B0B0B0;
    }
    
    .highlight {
      color: #FF7D3A;
      font-weight: bold;
    }
    
    /* Rocket Animation (simuliert durch Bild) */
    .rocket-container {
      text-align: center;
      margin: 30px 0;
    }
    
    .rocket-image {
      width: 100px;
      height: auto;
    }
    
    /* Button */
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    
    .button {
      display: inline-block;
      background-color: #FF7D3A;
      color: #FFFFFF;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      border: 1px solid rgba(255, 154, 102, 0.5);
      box-shadow: 0 0 15px rgba(255, 125, 58, 0.5);
    }
    
    /* Card */
    .card {
      background-color: #121820;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      border: 1px solid rgba(42, 65, 101, 0.3);
    }
    
    .card-title {
      color: #F0F0F0;
      font-size: 18px;
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    /* Footer */
    .footer {
      background-color: #121212;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #2A4165;
    }
    
    .footer p {
      margin: 5px 0;
      font-size: 12px;
      color: #B0B0B0;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100%;
        border-radius: 0;
      }
      
      .content {
        padding: 20px 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">ADAN<span class="logo-highlight">MEDIA</span></div>
    </div>
    
    <div class="content">
      <h1>Vielen Dank für deine Nachricht, ${name}!</h1>
      
      <p>Wir haben deine Anfrage erhalten und werden uns in Kürze bei dir melden. Unser Team arbeitet mit Hochdruck daran, dir die bestmögliche Lösung anzubieten.</p>
      
      <div class="rocket-container">
  <!-- Rocket SVG directly embedded for better email compatibility -->
  <div style="text-align:center; margin:20px 0;">
    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin:0 auto;">
      <path d="M12.5 2C9 2 4 6 4 11.5C4 13 5 16 5 16L9 15C9 15 9 13 10 12C11 11 13 11 13 11L14 7C14 7 15 4 12.5 2Z" fill="#FF7D3A"/>
      <path d="M14 7L13 11C13 11 15.5 11 16.5 13C17.5 15 17 17 17 17L21 18C21 18 22 13 22 11.5C22 7 19 4 14 7Z" fill="#FF7D3A"/>
      <path d="M8 16L5 19L9 19.5L11 22L12 20L9 17L8 16Z" fill="#2A4165"/>
      <path d="M16 17L15 19L16 22L18 21.5L19 17.5L16 17Z" fill="#2A4165"/>
      <path d="M11.25 11.25L8.75 13.75M13.75 13.75L11.25 16.25" stroke="white" stroke-width="1" stroke-linecap="round"/>
    </svg>
  </div>
  <!-- Rocket ASCII Art as fallback for email clients that don't support SVG -->
  <!--
     /\\
    |==|
   /|/\\|\\
  / |  | \\
    |  |
    |  |
    \\  \\
     \\  \\
      \\  \\
       \\  \\
        \\__\\
  -->
</div>
      
      <div class="card">
        <h3 class="card-title">Was passiert als Nächstes?</h3>
        <p>Unser Team wird deine Anfrage prüfen und sich innerhalb von <span class="highlight">24 Stunden</span> bei dir melden. Falls du dringend Hilfe benötigst, kannst du uns auch direkt anrufen.</p>
      </div>
      
      <p>In der Zwischenzeit kannst du gerne unsere Website besuchen, um mehr über unsere Dienstleistungen zu erfahren.</p>
      
      <div class="button-container">
        <a href="https://adanmedia.de" class="button">WEBSITE BESUCHEN</a>
      </div>
      
      <p>Mit kreativen Grüßen,<br>
      <span class="highlight">Dein ADAN MEDIA Team</span></p>
    </div>
    
    <div class="footer">
      <p>© ${currentYear} ADAN MEDIA. Alle Rechte vorbehalten.</p>
      <p>Diese E-Mail wurde automatisch gesendet. Bitte antworte nicht auf diese E-Mail.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
