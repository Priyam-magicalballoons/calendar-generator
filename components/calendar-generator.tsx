"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Download, Eye, Settings, Palette } from "lucide-react";
import {
  generateYearCalendar,
  parsePersonalDates,
  type CalendarMonth,
  type CalendarEvent,
} from "@/lib/calendar-utils";
import { CalendarTemplate } from "@/components/calendar-templates";
import { HolidayManager } from "@/components/holiday-manager";

interface CalendarGeneratorProps {
  userDetails: {
    name: string;
    birthdate: string;
    anniversary: string;
    additionalDates: string;
  };
  images: { [month: string]: string };
}

export function CalendarGenerator({
  userDetails,
  images,
}: CalendarGeneratorProps) {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [calendarData, setCalendarData] = useState<CalendarMonth[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [previewMonth, setPreviewMonth] = useState(0);
  const [enabledHolidayCategories, setEnabledHolidayCategories] = useState([
    "us-federal",
    "us-cultural",
  ]);
  const [personalEvents, setPersonalEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const parsedPersonalEvents = parsePersonalDates(
      userDetails.birthdate,
      userDetails.anniversary,
      userDetails.additionalDates,
      selectedYear
    );

    const allPersonalEvents = [
      ...parsedPersonalEvents,
      ...personalEvents.filter(
        (event) =>
          !parsedPersonalEvents.some(
            (parsed) =>
              parsed.date === event.date && parsed.title === event.title
          )
      ),
    ];
    const calendar = generateYearCalendar(
      selectedYear,
      allPersonalEvents,
      images,
      enabledHolidayCategories
    );
    setCalendarData(calendar);
  }, [selectedYear, userDetails, images, enabledHolidayCategories]); // removed personalEvents from dependency array to prevent infinite loop

  const handleYearChange = (year: string) => {
    setSelectedYear(Number.parseInt(year));
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  if (calendarData.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Generating your calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs defaultValue="preview" className="w-full">
        {/* <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="preview" className="text-xs sm:text-sm">
            Calendar Preview
          </TabsTrigger>
          <TabsTrigger value="holidays" className="text-xs sm:text-sm">
            Holidays & Events
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">
            Settings
          </TabsTrigger>
        </TabsList> */}

        <TabsContent value="preview" className="space-y-4 sm:space-y-6">
          {/* Calendar Controls */}
          <Card className="hidden lg:flex">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                Calendar Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Calendar Year</Label>
                    <Select
                      value={selectedYear.toString()}
                      onValueChange={handleYearChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {generateYearOptions().map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preview">Preview Month</Label>
                    <Select
                      value={previewMonth.toString()}
                      onValueChange={(value) =>
                        setPreviewMonth(Number.parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {calendarData.map((month, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {month.monthName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* <div className="space-y-2 hidden lg:flex">
                  <Label className="flex items-center gap-2 text-sm sm:text-base">
                    <Palette className="w-4 h-4" />
                    Template Style
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {["classic", "modern", "minimal", "elegant", "pharma"].map(
                      (template) => (
                        <button
                          key={template}
                          onClick={() => handleTemplateChange(template)}
                          className={`text-left transition-all ${
                            selectedTemplate === template
                              ? "ring-2 ring-primary ring-offset-2"
                              : "hover:ring-1 hover:ring-gray-300"
                          }`}
                        >
                          <TemplatePreview template={template} />
                        </button>
                      )
                    )}
                  </div>
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Calendar Preview */}
          <Card className="hidden lg:flex">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-lg sm:text-xl">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  Calendar Preview - {
                    calendarData[previewMonth]?.monthName
                  }{" "}
                  {selectedYear}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {calendarData[previewMonth] && (
                <div className="max-w-full mx-auto">
                  <CalendarTemplate
                    month={calendarData[previewMonth]}
                    year={selectedYear}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calendar Overview */}
          <Card className="hidden lg:flex">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Year Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
                {calendarData.map((month, index) => (
                  <div
                    key={index}
                    className={`
                      p-3 border rounded-lg cursor-pointer transition-colors
                      ${
                        previewMonth === index
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }
                    `}
                    onClick={() => setPreviewMonth(index)}
                  >
                    <div className="text-sm font-semibold mb-2">
                      {month.monthName}
                    </div>
                    {month.image && (
                      <div className="aspect-video rounded overflow-hidden mb-2">
                        <img
                          src={
                            month.image || "/placeholder.svg?height=60&width=80"
                          }
                          alt={`${month.monthName} thumbnail`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {
                        month.dates.filter(
                          (d) => d.isCurrentMonth && d.events.length > 0
                        ).length
                      }{" "}
                      events
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holidays">
          <HolidayManager
            selectedYear={selectedYear}
            enabledCategories={enabledHolidayCategories}
            onCategoriesChange={setEnabledHolidayCategories}
            personalEvents={personalEvents}
            onPersonalEventsChange={setPersonalEvents}
          />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Additional calendar settings will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
