"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, User, Heart, Gift, CalendarIcon } from "lucide-react";
import { ImageUploadSystem } from "@/components/image-upload-system";
import { CalendarGenerator } from "@/components/calendar-generator";
import { CalendarOutputGenerator } from "@/components/calendar-output-generator";
import { toast } from "sonner";
import { useToast } from "./ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { generateYearCalendar, parsePersonalDates } from "@/lib/calendar-utils";

interface UserDetails {
  name: string;
  age: string;
  gender: string;
  birthdate: string;
  anniversary: string;
  email: string;
  additionalDates: string;
}

export function UserDetailsForm() {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    age: "",
    gender: "",
    birthdate: "",
    anniversary: "",
    email: "",
    additionalDates: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<{
    [month: string]: string;
  }>({});
  const totalSteps = 4;

  const handleInputChange = (field: keyof UserDetails, value: string) => {
    setUserDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (
      (currentStep === 1 && !userDetails.name) ||
      !userDetails.anniversary ||
      !userDetails.birthdate
    ) {
      toast("Form Incomplete", {
        description: "kindly fill all the details",
        style: {
          backgroundColor: "#86EFAC",
          fontStyle: "serif",
          letterSpacing: 0.5,
        },
        duration: 1500,
        position: "top-center",
      });
      // return;
    }

    if (currentStep === 2 && !uploadedImages.December) {
      toast("Form Incomplete", {
        description: "kindly upload 12 images to proceed",
        style: {
          backgroundColor: "#86EFAC",
          fontStyle: "serif",
          letterSpacing: 0.5,
        },
        duration: 2000,
        position: "top-center",
      });
      // return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImagesChange = (images: { [month: string]: string }) => {
    setUploadedImages(images);
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setUserDetails({
      name: "",
      age: "",
      gender: "",
      birthdate: "",
      anniversary: "",
      email: "",
      additionalDates: "",
    });
    setUploadedImages({});
  };

  function parseDateString(dateString: string): Date | undefined {
    if (!dateString) return undefined;
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // Local midnight, no UTC shift
  }

  const personalEvents = parsePersonalDates(
    userDetails.birthdate,
    userDetails.anniversary,
    userDetails.additionalDates,
    2026
  );

  const monthsData = generateYearCalendar(
    2026,
    personalEvents,
    uploadedImages,
    ["us-federal", "us-cultural"]
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4 ">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 text-xs sm:text-sm ${
                step <= currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
          />
        </div>
        <div className="hidden sm:flex justify-between text-xs text-muted-foreground mt-2">
          <span>Personal Info</span>
          {/* <span>Important Dates</span> */}
          <span>Upload Photos</span>
          <span>Customize Calendar</span>
          <span>Generate & Download</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            {currentStep === 1 && <User className="w-5 h-5" />}
            {/* {currentStep === 2 && <Heart className="w-5 h-5" />} */}
            {currentStep === 2 && <Upload className="w-5 h-5" />}
            {currentStep === 3 && <CalendarIcon className="w-5 h-5" />}
            {currentStep === 4 && <Gift className="w-5 h-5" />}
            {currentStep === 1 && "Personal Information"}
            {/* {currentStep === 2 && "Important Dates"} */}
            {currentStep === 2 && "Upload & Edit Photos"}
            {currentStep === 3 && "Customize Your Calendar"}
            {currentStep === 4 && "Generate Your Calendar"}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {currentStep === 1 &&
              "Tell us about yourself to personalize your calendar"}
            {/* {currentStep === 2 &&
              "Add birthdays, anniversaries, and other special dates"} */}
            {currentStep === 2 &&
              "Upload 12 photos and edit them for each month"}
            {currentStep === 3 && "Preview and customize your calendar design"}
            {currentStep === 4 &&
              "Generate and download your personalized calendar"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={userDetails.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="bg-white border-black-2"
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={userDetails.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                  />
                </div> */}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
                {/* <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={userDetails.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div> */}
              </div>
            </div>
          )}
          {/* Step 2: Important Dates */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-medical-blue" />
                    Date of Birth
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-medical-blue/20 hover:bg-green-300",
                          !userDetails.birthdate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {userDetails.birthdate
                          ? userDetails.birthdate
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseDateString(userDetails.birthdate)}
                        onSelect={(date) =>
                          handleInputChange(
                            "birthdate",
                            date
                              ? `${date.getFullYear()}-${String(
                                  date.getMonth() + 1
                                ).padStart(2, "0")}-${String(
                                  date.getDate()
                                ).padStart(2, "0")}`
                              : ""
                          )
                        }
                        initialFocus
                        className="pointer-events-auto min-h-80 h-80 max-h-80"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-medical-blue" />
                    Anniversary Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal hover:bg-green-300",
                          !userDetails.anniversary && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {userDetails.anniversary
                          ? userDetails.anniversary
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseDateString(userDetails.anniversary)}
                        onSelect={(date) =>
                          handleInputChange(
                            "anniversary",
                            date
                              ? `${date.getFullYear()}-${String(
                                  date.getMonth() + 1
                                ).padStart(2, "0")}-${String(
                                  date.getDate()
                                ).padStart(2, "0")}`
                              : ""
                          )
                        }
                        initialFocus
                        className="pointer-events-auto min-h-80 h-80 max-h-80"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="additionalDates">
                  Additional Important Dates
                </Label>
                <Textarea
                  id="additionalDates"
                  placeholder="Add other important dates (e.g., family birthdays, special occasions). Format: Date - Description"
                  rows={4}
                  value={userDetails.additionalDates}
                  onChange={(e) =>
                    handleInputChange("additionalDates", e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Example: 2024-12-25 - Christmas, 2024-07-04 - Independence Day
                </p>
              </div> */}
            </div>
          )}
          {/* Step 3 & 4: Image Upload and Editing System */}
          {(currentStep === 2 || currentStep === 3) && (
            <ImageUploadSystem
              currentStep={currentStep}
              onImagesChange={handleImagesChange}
            />
          )}
          {/* Step 5: Calendar Customization and Generation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <CalendarGenerator
                userDetails={userDetails}
                images={uploadedImages}
              />
              <CalendarOutputGenerator
                calendarData={{
                  userDetails,
                  year: 2026,
                  months: monthsData,
                  images: uploadedImages,
                  template: "classic",
                  enabledHolidayCategories: ["us-federal", "us-cultural"],
                }}
                onComplete={handleStartOver}
              />
            </div>
          )}
          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="w-full sm:w-auto bg-transparent"
              >
                Previous
              </Button>

              <Button
                hidden={currentStep === 4}
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                {currentStep === 4 ? "Generate Calendar" : "Next Step"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
