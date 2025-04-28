import type { ContactFormData } from "@/actions/contact"

export function EmailTemplate({ formData }: { formData: ContactFormData }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", color: "#333" }}>
      <h1 style={{ color: "#FF7D3A" }}>Neue Kontaktanfrage</h1>
      <p>Von deinem ADAN MEDIA Website-Kontaktformular</p>

      <div style={{ margin: "20px 0" }}>
        <h2 style={{ color: "#FF7D3A" }}>Kontaktdetails:</h2>
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

      <div style={{ margin: "20px 0" }}>
        <h2 style={{ color: "#FF7D3A" }}>Nachricht:</h2>
        <div style={{ backgroundColor: "#f5f5f5", padding: "15px", borderRadius: "6px" }}>{formData.message}</div>
      </div>

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>Diese E-Mail wurde automatisch vom Kontaktformular deiner Website gesendet.</p>
        <p>© {new Date().getFullYear()} ADAN MEDIA</p>
      </div>
    </div>
  )
}
