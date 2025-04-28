"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Calendar } from "@/components/ui/calendar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, Check, Home, Info, Settings } from "lucide-react"

export default function UIShowcase() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showAlertDialog, setShowAlertDialog] = useState(false)

  return (
    <div className="container mx-auto py-12 space-y-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#F0F0F0] mb-2">UI Komponenten Showcase</h1>
        <p className="text-[#B0B0B0]">Übersicht der verfügbaren UI-Komponenten für Ihr Projekt</p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 bg-[#121820]">
          <TabsTrigger value="basic">Basis Komponenten</TabsTrigger>
          <TabsTrigger value="input">Eingabe Komponenten</TabsTrigger>
          <TabsTrigger value="layout">Layout Komponenten</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Badges */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Kleine Kennzeichnungen für Status und Kategorien</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </CardContent>
            </Card>

            {/* Avatars */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Avatars</CardTitle>
                <CardDescription>Benutzerbilder und Fallback-Initialen</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40&text=AM" alt="Avatar" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>MK</AvatarFallback>
                </Avatar>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Benachrichtigungen und Warnungen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>Dies ist eine Informationsmeldung für den Benutzer.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Fehler</AlertTitle>
                  <AlertDescription>Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.</AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Alert Dialog */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Alert Dialog</CardTitle>
                <CardDescription>Dialogfenster für wichtige Aktionen</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]">
                      Dialog öffnen
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#1A1A1A] border border-[#121820]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-[#F0F0F0]">Sind Sie sicher?</AlertDialogTitle>
                      <AlertDialogDescription className="text-[#B0B0B0]">
                        Diese Aktion kann nicht rückgängig gemacht werden. Dies wird dauerhaft die Daten von unseren
                        Servern löschen.
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
              </CardContent>
            </Card>

            {/* Breadcrumbs */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Breadcrumbs</CardTitle>
                <CardDescription>Navigationspfade für die Benutzerorientierung</CardDescription>
              </CardHeader>
              <CardContent>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">
                        <Home className="h-4 w-4 mr-1" />
                        Home
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Projekte</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Webdesign</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </CardContent>
            </Card>

            {/* Buttons */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Verschiedene Button-Varianten</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button size="sm">Small</Button>
                <Button size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="input" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>Texteingabefelder</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" placeholder="name@example.com" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="password">Passwort</Label>
                  <Input type="password" id="password" />
                </div>
              </CardContent>
            </Card>

            {/* Checkbox */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Checkbox</CardTitle>
                <CardDescription>Auswahlfelder für Mehrfachauswahl</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Ich akzeptiere die AGB</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" defaultChecked />
                  <Label htmlFor="newsletter">Newsletter abonnieren</Label>
                </div>
              </CardContent>
            </Card>

            {/* Radio Group */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Radio Group</CardTitle>
                <CardDescription>Auswahlfelder für Einfachauswahl</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="option-one">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">Option 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="option-two" />
                    <Label htmlFor="option-two">Option 2</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Select */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Select</CardTitle>
                <CardDescription>Dropdown-Auswahlfelder</CardDescription>
              </CardHeader>
              <CardContent>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wählen Sie eine Option" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border border-[#121820]">
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Switch */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Switch</CardTitle>
                <CardDescription>Ein-/Aus-Schalter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                  <Label htmlFor="airplane-mode">Flugmodus</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" defaultChecked />
                  <Label htmlFor="notifications">Benachrichtigungen</Label>
                </div>
              </CardContent>
            </Card>

            {/* Slider */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Slider</CardTitle>
                <CardDescription>Schieberegler für Wertauswahl</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="volume">Lautstärke</Label>
                    <Slider defaultValue={[50]} max={100} step={1} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="range">Preisbereich</Label>
                    <Slider defaultValue={[25, 75]} max={100} step={1} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Datumsauswahl für Formulare und Planung</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border border-[#121820]"
                />
              </CardContent>
            </Card>

            {/* Carousel */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Carousel</CardTitle>
                <CardDescription>Bildergalerie mit Navigation</CardDescription>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full max-w-xs mx-auto">
                  <CarouselContent>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              <span className="text-3xl font-semibold">{index + 1}</span>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center gap-2 mt-4">
                    <CarouselPrevious className="static translate-y-0 translate-x-0" />
                    <CarouselNext className="static translate-y-0 translate-x-0" />
                  </div>
                </Carousel>
              </CardContent>
            </Card>

            {/* Aspect Ratio */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Aspect Ratio</CardTitle>
                <CardDescription>Behält das Seitenverhältnis von Bildern bei</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full max-w-sm">
                  <AspectRatio ratio={16 / 9} className="bg-[#121820] rounded-md overflow-hidden">
                    <img
                      src="/placeholder.svg?height=300&width=500&text=16:9+Ratio"
                      alt="Aspect ratio example"
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
              </CardContent>
            </Card>

            {/* Separator */}
            <Card className="border border-[#121820] bg-[#202020]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,125,58,0.2)]">
              <CardHeader>
                <CardTitle>Separator</CardTitle>
                <CardDescription>Trennlinien für visuelle Unterteilung</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium leading-none">Horizontaler Separator</h4>
                    <p className="text-sm text-muted-foreground">Trennt Inhalte horizontal</p>
                    <Separator className="my-4" />
                    <div className="flex h-5 items-center space-x-4 text-sm">
                      <div>Profil</div>
                      <Separator orientation="vertical" />
                      <div>Einstellungen</div>
                      <Separator orientation="vertical" />
                      <div>Logout</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-8">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
          <Button
            className="bg-[#FF7D3A] hover:bg-[#FF9A66] text-white border border-[#FF9A66]/50 shadow-[0_0_15px_rgba(255,125,58,0.5)]"
            onClick={() => {
              toast({
                title: "Komponenten geladen",
                description: "Alle UI-Komponenten wurden erfolgreich geladen.",
              })
            }}
          >
            <Check className="mr-2 h-4 w-4" /> ALLE KOMPONENTEN ANZEIGEN
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
