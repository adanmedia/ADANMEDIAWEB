import type { ContactFormData } from "@/actions/contact"

export function EmailTemplate({ formData }: { formData: ContactFormData }) {
  return (
    <div>
      <h1>Neue Kontaktanfrage</h1>
      <p>Von deinem ADAN MEDIA Website-Kontaktformular</p>

      <div>
        <h2>Kontaktdetails:</h2>
        <p>
          <strong>Name:</strong> {formData.name}
        </p>
        <p>
          <strong>E-Mail:</strong> {formData.email}
        </p>
        {formData.phone && (
          <p>
            <strong>Telefon:</strong> {formData.phone}
          </p>
        )}
        <p>
          <strong>Rückruf:</strong> {formData.requestCallback ? "Ja, bitte zurückrufen" : "Nicht erforderlich"}
        </p>
      </div>

      <div>
        <h2>Nachricht:</h2>
        <p>{formData.message}</p>
      </div>

      <div>
        <p>Diese E-Mail wurde automatisch vom Kontaktformular deiner Website gesendet.</p>
        <p>© {new Date().getFullYear()} ADAN MEDIA</p>
      </div>
    </div>
  )
}
