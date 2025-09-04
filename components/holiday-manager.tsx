"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Calendar, Plus, Trash2, Settings } from "lucide-react"
import { HOLIDAY_CATEGORIES, getAllHolidays, type CalendarEvent } from "@/lib/calendar-utils"

interface HolidayManagerProps {
  selectedYear: number
  enabledCategories: string[]
  onCategoriesChange: (categories: string[]) => void
  personalEvents: CalendarEvent[]
  onPersonalEventsChange: (events: CalendarEvent[]) => void
}

export function HolidayManager({
  selectedYear,
  enabledCategories,
  onCategoriesChange,
  personalEvents,
  onPersonalEventsChange,
}: HolidayManagerProps) {
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventDate, setNewEventDate] = useState("")
  const [newEventDescription, setNewEventDescription] = useState("")

  const handleCategoryToggle = (categoryId: string) => {
    const updated = enabledCategories.includes(categoryId)
      ? enabledCategories.filter((id) => id !== categoryId)
      : [...enabledCategories, categoryId]
    onCategoriesChange(updated)
  }

  const addPersonalEvent = () => {
    if (!newEventTitle || !newEventDate) return

    const newEvent: CalendarEvent = {
      id: `personal-${Date.now()}`,
      title: newEventTitle,
      type: "personal",
      date: new Date(newEventDate),
      recurring: true,
      color: "#059669",
      description: newEventDescription || undefined,
    }

    onPersonalEventsChange([...personalEvents, newEvent])
    setNewEventTitle("")
    setNewEventDate("")
    setNewEventDescription("")
  }

  const removePersonalEvent = (eventId: string) => {
    onPersonalEventsChange(personalEvents.filter((event) => event.id !== eventId))
  }

  const allHolidays = getAllHolidays(selectedYear)
  const enabledHolidays = allHolidays.filter(
    (holiday) => holiday.category && enabledCategories.includes(holiday.category),
  )

  return (
    <div className="space-y-6">
      {/* Holiday Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Holiday Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {HOLIDAY_CATEGORIES.map((category) => {
            const categoryHolidays = allHolidays.filter((h) => h.category === category.id)
            const isEnabled = enabledCategories.includes(category.id)

            return (
              <div key={category.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={category.id}
                  checked={isEnabled}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={category.id} className="font-semibold">
                      {category.name}
                    </Label>
                    <Badge variant="outline">{categoryHolidays.length} holidays</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  {isEnabled && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {categoryHolidays.slice(0, 5).map((holiday) => (
                        <Badge key={holiday.id} variant="secondary" className="text-xs">
                          {holiday.title}
                        </Badge>
                      ))}
                      {categoryHolidays.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{categoryHolidays.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Personal Events Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Personal Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Event */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <h4 className="font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Event
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  placeholder="e.g., Mom's Birthday"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-date">Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Description (Optional)</Label>
              <Textarea
                id="event-description"
                placeholder="Add any additional details..."
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                rows={2}
              />
            </div>
            <Button onClick={addPersonalEvent} disabled={!newEventTitle || !newEventDate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>

          <Separator />

          {/* Existing Personal Events */}
          <div className="space-y-3">
            <h4 className="font-semibold">Your Personal Events ({personalEvents.length})</h4>
            {personalEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No personal events added yet. Add some above!</p>
            ) : (
              <div className="space-y-2">
                {personalEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.date.toLocaleDateString()}
                        {event.description && ` • ${event.description}`}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePersonalEvent(event.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-600">{enabledHolidays.length}</div>
              <div className="text-sm text-muted-foreground">Public Holidays</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">{personalEvents.length}</div>
              <div className="text-sm text-muted-foreground">Personal Events</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">{enabledHolidays.length + personalEvents.length}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">{enabledCategories.length}</div>
              <div className="text-sm text-muted-foreground">Active Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
