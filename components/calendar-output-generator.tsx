"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  FileText,
  ImageIcon,
  Printer,
  Share2,
  CheckCircle,
} from "lucide-react";
import {
  generateCalendarPDF,
  downloadBlob,
  getOptimalPDFSettings,
  type PDFOptions,
  type CalendarPDFData,
} from "@/lib/pdf-generator";

interface CalendarOutputGeneratorProps {
  calendarData: CalendarPDFData;
  onComplete?: () => void;
}

export function CalendarOutputGenerator({
  calendarData,
  onComplete,
}: CalendarOutputGeneratorProps) {
  const [pdfOptions, setPdfOptions] = useState<PDFOptions>(
    getOptimalPDFSettings(calendarData.template)
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedFiles, setGeneratedFiles] = useState<
    { type: string; blob: Blob; filename: string }[]
  >([]);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      console.log(calendarData);

      const pdfBlob = await generateCalendarPDF(calendarData, pdfOptions);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      const filename = `${calendarData.userDetails.name.replace(
        /\s+/g,
        "_"
      )}_Calendar_${calendarData.year}.pdf`;

      setGeneratedFiles([
        {
          type: "PDF",
          blob: pdfBlob,
          filename,
        },
      ]);
    } catch (error) {
      console.error(
        "PDF generation failed:",
        error,
        error instanceof Error ? error.message : ""
      );
      throw error; // rethrow to allow further handling
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (file: { blob: Blob; filename: string }) => {
    downloadBlob(file.blob, file.filename);
  };

  const updatePdfOption = <K extends keyof PDFOptions>(
    key: K,
    value: PDFOptions[K]
  ) => {
    setPdfOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Generation Options */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Output Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Paper Format</Label>
                <Select
                  value={pdfOptions.format}
                  onValueChange={(value: any) =>
                    updatePdfOption("format", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                    <SelectItem value="Letter">Letter (8.5 × 11 in)</SelectItem>
                    <SelectItem value="A3">A3 (297 × 420 mm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Orientation</Label>
                <Select
                  value={pdfOptions.orientation}
                  onValueChange={(value: any) =>
                    updatePdfOption("orientation", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quality</Label>
                <Select
                  value={pdfOptions.quality}
                  onValueChange={(value: any) =>
                    updatePdfOption("quality", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      Standard (Smaller file)
                    </SelectItem>
                    <SelectItem value="high">
                      High Quality (Larger file)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-images"
                  checked={pdfOptions.includeImages}
                  onCheckedChange={(checked) =>
                    updatePdfOption("includeImages", !!checked)
                  }
                />
                <Label htmlFor="include-images">Include uploaded images</Label>
              </div>

              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold mb-2">Calendar Summary</h4>
                <div className="space-y-1 text-sm">
                  <div>
                    Year: <Badge variant="outline">{calendarData.year}</Badge>
                  </div>
                  <div>
                    Template:{" "}
                    <Badge variant="outline">{calendarData.template}</Badge>
                  </div>
                  <div>
                    Images:{" "}
                    <Badge variant="outline">
                      {Object.keys(calendarData.images).length} months
                    </Badge>
                  </div>
                  <div>
                    Holiday Categories:{" "}
                    <Badge variant="outline">
                      {calendarData.enabledHolidayCategories.length}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle>Generating Your Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={generationProgress} className="w-full" />
              <div className="text-center text-sm text-muted-foreground">
                {generationProgress < 30 && "Processing calendar data..."}
                {generationProgress >= 30 &&
                  generationProgress < 60 &&
                  "Rendering calendar pages..."}
                {generationProgress >= 60 &&
                  generationProgress < 90 &&
                  "Adding images and events..."}
                {generationProgress >= 90 &&
                  generationProgress < 100 &&
                  "Finalizing PDF..."}
                {generationProgress === 100 &&
                  "Calendar generated successfully!"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Files */}
      {generatedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Your Calendar is Ready!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-red-600" />
                    <div>
                      <div className="font-semibold">{file.filename}</div>
                      <div className="text-sm text-muted-foreground">
                        {file.type} •{" "}
                        {(file.blob.size / 1024 / 1024).toFixed(1)} MB
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Calendar
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Calendar
                </Button>
                <Button variant="outline" size="sm">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Export as Images
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      {generatedFiles.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Ready to Generate Your Calendar?
                </h3>
                <p className="text-muted-foreground">
                  Your personalized calendar will be generated as a high-quality
                  PDF with all your photos and important dates.
                </p>
              </div>
              <Button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <FileText className="w-5 h-5 mr-2" />
                {isGenerating ? "Generating..." : "Generate Calendar PDF"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Actions */}
      {generatedFiles.length > 0 && onComplete && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Button onClick={onComplete} variant="outline">
                Create Another Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
