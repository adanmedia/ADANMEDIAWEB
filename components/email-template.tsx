import type { ContactFormData } from "@/actions/contact"

export function EmailTemplate({ formData }: { formData: ContactFormData }) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#1A1A1A",
        color: "#F0F0F0",
        borderRadius: "8px",
        border: "1px solid #121820",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
          borderBottom: "1px solid #2A4165",
          paddingBottom: "20px",
        }}
      >
        <h1
          style={{
            color: "#FF7D3A",
            fontSize: "24px",
            margin: "0 0 10px",
          }}
        >
          Neue Kontaktanfrage
        </h1>
        <p style={{ color: "#B0B0B0", margin: "0" }}>Von deinem ADAN MEDIA Website-Kontaktformular</p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2
          style={{
            color: "#FF7D3A",
            fontSize: "18px",
            marginBottom: "15px",
          }}
        >
          Kontaktdetails:
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #2A4165",
                  width: "120px",
                  fontWeight: "bold",
                }}
              >
                Name:
              </td>
              <td
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #2A4165",
                }}
              >
                {formData.name}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #2A4165",
                  fontWeight: "bold",
                }}
              >
                E-Mail:
              </td>
              <td
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #2A4165",
                }}
              >
                <a href={`mailto:${formData.email}`} style={{ color: "#FF7D3A" }}>
                  {formData.email}
                </a>
              </td>
            </tr>
            {formData.phone && (
              <tr>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #2A4165",
                    fontWeight: "bold",
                  }}
                >
                  Telefon:
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #2A4165",
                  }}
                >
                  <a href={`tel:${formData.phone}`} style={{ color: "#FF7D3A" }}>
                    {formData.phone}
                  </a>
                </td>
              </tr>
            )}
            <tr>
              <td
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #2A4165",
                  fontWeight: "bold",
                }}
              >
                Rückruf:
              </td>
              <td
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #2A4165",
                }}
              >
                {formData.requestCallback ? "Ja, bitte zurückrufen" : "Nicht erforderlich"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2
          style={{
            color: "#FF7D3A",
            fontSize: "18px",
            marginBottom: "15px",
          }}
        >
          Nachricht:
        </h2>
        <div
          style={{
            backgroundColor: "#121820",
            padding: "15px",
            borderRadius: "6px",
            whiteSpace: "pre-wrap",
          }}
        >
          {formData.message}
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: "1px solid #2A4165",
          color: "#B0B0B0",
          fontSize: "12px",
        }}
      >
        <p>Diese E-Mail wurde automatisch vom Kontaktformular deiner Website gesendet.</p>
        <p>© {new Date().getFullYear()} ADAN MEDIA</p>
      </div>
    </div>
  )
}
