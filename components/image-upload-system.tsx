"use client";

import type React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Edit3 } from "lucide-react";
import { ImageEditor } from "@/components/image-editor";

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  month: string;
  edited?: boolean;
}

interface ImageUploadSystemProps {
  currentStep: number;
  onImagesChange?: (images: { [month: string]: string }) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ImageUploadSystem({
  currentStep,
  onImagesChange,
}: ImageUploadSystemProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [editingImage, setEditingImage] = useState<UploadedImage | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onImagesChangeRef = useRef(onImagesChange);
  onImagesChangeRef.current = onImagesChange;

  const prevImagesRef = useRef<string>("");

  useEffect(() => {
    if (onImagesChangeRef.current) {
      const imagesObject: { [month: string]: string } = {};
      uploadedImages.forEach((image) => {
        imagesObject[image.month] = image.url;
      });

      // Only call callback if the actual image data has changed
      const currentImagesString = JSON.stringify(imagesObject);
      if (currentImagesString !== prevImagesRef.current) {
        prevImagesRef.current = currentImagesString;
        onImagesChangeRef.current(imagesObject);
      }
    }
  }, [uploadedImages]);

  const handleFileSelect = useCallback(
    (files: FileList) => {
      const newImages: UploadedImage[] = [];

      Array.from(files).forEach((file, index) => {
        if (
          file.type.startsWith("image/") &&
          uploadedImages.length + newImages.length < 12
        ) {
          const id = `img-${Date.now()}-${index}`;
          const url = URL.createObjectURL(file);
          const monthIndex = (uploadedImages.length + newImages.length) % 12;

          newImages.push({
            id,
            file,
            url,
            month: MONTHS[monthIndex],
            edited: false,
          });
        }
      });

      setUploadedImages((prev) => [...prev, ...newImages]);
    },
    [uploadedImages.length]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      if (e.dataTransfer.files) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeImage = (id: string) => {
    setUploadedImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      // Reassign months to remaining images
      return filtered.map((img, index) => ({
        ...img,
        month: MONTHS[index % 12],
      }));
    });
  };

  const reassignMonth = (id: string, newMonth: string) => {
    setUploadedImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, month: newMonth } : img))
    );
  };

  const handleImageEdit = (image: UploadedImage) => {
    setEditingImage(image);
  };

  const handleEditComplete = (editedImageUrl: string) => {
    if (editingImage) {
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === editingImage.id
            ? { ...img, url: editedImageUrl, edited: true }
            : img
        )
      );
      setEditingImage(null);
    }
  };

  // Step 3: Upload Interface
  if (currentStep === 2) {
    return (
      <div className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : uploadedImages.length >= 12
              ? "border-muted bg-muted/20"
              : "border-border hover:border-primary/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {uploadedImages.length >= 12
              ? "All Photos Uploaded!"
              : "Upload Your 12 Photos"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {uploadedImages.length >= 12
              ? "You've uploaded all 12 photos. Proceed to the next step to edit them."
              : `Drag and drop images here, or click to select files. ${
                  12 - uploadedImages.length
                } photos remaining.`}
          </p>

          {uploadedImages.length < 12 && (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadedImages.length >= 12}
            >
              Choose Files
            </Button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          />
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {uploadedImages.length} of 12 photos uploaded
          </span>
          <div className="w-48 bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(uploadedImages.length / 12) * 100}%` }}
            />
          </div>
        </div>

        {/* Uploaded Images Grid */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`Upload ${image.id}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  <Badge className="absolute bottom-2 left-2 text-xs">
                    {image.month}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center">
          Supported formats: JPG, PNG, WEBP. Maximum size: 10MB per image.
        </p>
      </div>
    );
  }

  // Step 4: Edit Interface
  if (currentStep === 3) {
    return (
      <div className="space-y-6">
        {editingImage ? (
          <ImageEditor
            image={editingImage}
            onComplete={handleEditComplete}
            onCancel={() => setEditingImage(null)}
          />
        ) : (
          <>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Edit Your Photos</h3>
              <p className="text-muted-foreground">
                Click on any photo to crop, resize, or adjust it for your
                calendar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={`${image.month} photo`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleImageEdit(image)}
                        className="bg-white/90 hover:bg-white"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    {image.edited && (
                      <Badge className="absolute top-2 right-2 bg-primary">
                        Edited
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <select
                        value={image.month}
                        onChange={(e) =>
                          reassignMonth(image.id, e.target.value)
                        }
                        className="text-sm border rounded px-2 py-1 bg-background"
                      >
                        {MONTHS.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleImageEdit(image)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}
