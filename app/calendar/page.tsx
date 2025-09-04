"use client"
import { CalendarGenerator } from "@/components/calendar-generator"

// Mock data for demonstration
const mockUserDetails = {
  name: "John Doe",
  birthdate: "1990-05-15",
  anniversary: "2020-08-22",
  additionalDates: "2024-12-25 - Christmas\n2024-07-04 - Independence Day",
}

const mockImages = {
  January: "/winter-landscape.png",
  February: "/valentine-hearts.png",
  March: "/spring-flowers-meadow.png",
  April: "/colorful-easter-eggs.png",
  May: "/mothers-day-tulips.png",
  June: "/summer-beach-scene.png",
  July: "/vibrant-fireworks.png",
  August: "/summer-vacation.png",
  September: "/autumn-leaves-carpet.png",
  October: "/halloween-pumpkins.png",
  November: "/thanksgiving-turkey.png",
  December: "/festive-christmas-tree.png",
}

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Your Custom Calendar</h1>
          <p className="text-muted-foreground mt-2">Preview and customize your personalized calendar</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <CalendarGenerator userDetails={mockUserDetails} images={mockImages} />
      </div>
    </main>
  )
}
