"use client"

import { ProjectAlertDialog } from "@/components/project-alert-dialog"

export default function AlertDialogExample() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      <h2 className="text-2xl font-bold text-[#F0F0F0]">Alert Dialog Beispiele</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#121820] p-6 rounded-lg border border-[#2A4165]/30 flex flex-col items-center space-y-4">
          <h3 className="text-xl font-bold text-[#F0F0F0]">Webdesign Projekt</h3>
          <p className="text-[#B0B0B0] text-center">Starten Sie ein neues Webdesign-Projekt mit unserem Team</p>
          <ProjectAlertDialog
            projectTitle="Webdesign Projekt"
            projectDescription="Sind Sie bereit, ein neues Webdesign-Projekt zu starten? Unser Team wird sich umgehend mit Ihnen in Verbindung setzen, um Ihre Anforderungen zu besprechen."
          />
        </div>

        <div className="bg-[#121820] p-6 rounded-lg border border-[#2A4165]/30 flex flex-col items-center space-y-4">
          <h3 className="text-xl font-bold text-[#F0F0F0]">Social Media Kampagne</h3>
          <p className="text-[#B0B0B0] text-center">Starten Sie eine neue Social Media Kampagne für Ihr Unternehmen</p>
          <ProjectAlertDialog
            projectTitle="Social Media Kampagne"
            projectDescription="Möchten Sie eine neue Social Media Kampagne starten? Wir helfen Ihnen dabei, Ihre Zielgruppe effektiv zu erreichen und Ihre Marke zu stärken."
            buttonText="KAMPAGNE STARTEN"
          />
        </div>
      </div>
    </div>
  )
}
