"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RotateCw, Crop, ZoomIn, Save, X, Move } from "lucide-react";

interface ImageEditorProps {
  image: {
    id: string;
    file: File;
    url: string;
    month: string;
  };
  onComplete: (editedImageUrl: string) => void;
  onCancel: () => void;
}

export function ImageEditor({ image, onComplete, onCancel }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState([100]);
  const [rotation, setRotation] = useState([0]);
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({
    x: 50,
    y: 50,
    width: 300,
    height: 200,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<
    null | "tl" | "tr" | "bl" | "br"
  >(null);
  const [drawInfo, setDrawInfo] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Set canvas size
      canvas.width = 500;
      canvas.height = 400;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply transformations
      ctx.save();

      // Move to center for rotation
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Apply rotation
      ctx.rotate((rotation[0] * Math.PI) / 180);

      // Apply scale
      const scaleValue = scale[0] / 100;
      ctx.scale(scaleValue, scaleValue);

      // Apply filters
      ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`;

      // Calculate image dimensions to fit canvas
      const aspectRatio = img.width / img.height;
      let drawWidth = canvas.width * 0.8;
      let drawHeight = canvas.height * 0.8;

      if (aspectRatio > 1) {
        drawHeight = drawWidth / aspectRatio;
      } else {
        drawWidth = drawHeight * aspectRatio;
      }

      // Draw image centered
      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      setDrawInfo({
        x: -drawWidth / 2,
        y: -drawHeight / 2,
        width: drawWidth,
        height: drawHeight,
      });

      ctx.restore();

      if (cropMode) {
        // Dark overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Transparent crop hole
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
        ctx.restore();

        // Border for clarity
        ctx.strokeStyle = "#22c55e"; // green
        ctx.lineWidth = 2;
        ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
      }
    };
    img.src = image.url;
  }, [
    image.url,
    scale,
    rotation,
    brightness,
    contrast,
    cropMode,
    cropArea,
    imageLoaded,
  ]);

  useEffect(() => {
    // Load image first
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageLoaded(true);
    };
    img.src = image.url;
  }, [image.url]);

  useEffect(() => {
    if (imageLoaded) {
      drawImage();
    }
  }, [drawImage, imageLoaded]);

  const handleSize = 8; // same as your drawing size

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check corner handles first
    if (
      Math.abs(x - cropArea.x) < handleSize &&
      Math.abs(y - cropArea.y) < handleSize
    ) {
      setResizeHandle("tl");
      return;
    }
    if (
      Math.abs(x - (cropArea.x + cropArea.width)) < handleSize &&
      Math.abs(y - cropArea.y) < handleSize
    ) {
      setResizeHandle("tr");
      return;
    }
    if (
      Math.abs(x - cropArea.x) < handleSize &&
      Math.abs(y - (cropArea.y + cropArea.height)) < handleSize
    ) {
      setResizeHandle("bl");
      return;
    }
    if (
      Math.abs(x - (cropArea.x + cropArea.width)) < handleSize &&
      Math.abs(y - (cropArea.y + cropArea.height)) < handleSize
    ) {
      setResizeHandle("br");
      return;
    }

    // Otherwise, check if inside crop area → dragging
    if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      setIsDragging(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
    }
  };
  // always maintain a square aspect ratio
  function makeSquareCrop(
    x: number,
    y: number,
    size: number,
    canvas: HTMLCanvasElement
  ) {
    const maxSize = Math.min(canvas.width, canvas.height);
    const clampedSize = Math.max(50, Math.min(size, maxSize)); // min 50px, max fit
    return {
      x: Math.max(0, Math.min(x, canvas.width - clampedSize)),
      y: Math.max(0, Math.min(y, canvas.height - clampedSize)),
      width: clampedSize,
      height: clampedSize,
    };
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (resizeHandle) {
      setCropArea((prev) => {
        const canvas = canvasRef.current!;
        const size = Math.max(
          50,
          Math.min(
            resizeHandle === "br" || resizeHandle === "tr"
              ? x - prev.x
              : prev.width + (prev.x - x),
            canvas.width,
            canvas.height
          )
        );
        return makeSquareCrop(prev.x, prev.y, size, canvas);
      });
    }

    if (isDragging) {
      const newX = Math.max(
        0,
        Math.min(x - dragStart.x, canvas.width - cropArea.width)
      );
      const newY = Math.max(
        0,
        Math.min(y - dragStart.y, canvas.height - cropArea.height)
      );
      setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setResizeHandle(null);
  };

  const handleSave = () => {
    if (!canvasRef.current || !drawInfo) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Full-resolution offscreen canvas
      const offCanvas = document.createElement("canvas");
      offCanvas.width = img.width;
      offCanvas.height = img.height;
      const offCtx = offCanvas.getContext("2d");
      if (!offCtx) return;

      // Apply transforms
      offCtx.save();
      offCtx.translate(offCanvas.width / 2, offCanvas.height / 2);
      offCtx.rotate((rotation[0] * Math.PI) / 180);
      const scaleValue = scale[0] / 100;
      offCtx.scale(scaleValue, scaleValue);
      offCtx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`;

      // Draw full image
      offCtx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
      );
      offCtx.restore();

      // ---- Correct mapping ----
      const scaleX = img.width / drawInfo.width;
      const scaleY = img.height / drawInfo.height;

      const sx =
        (cropArea.x - (canvasRef.current!.width / 2 - drawInfo.width / 2)) *
        scaleX;
      const sy =
        (cropArea.y - (canvasRef.current!.height / 2 - drawInfo.height / 2)) *
        scaleY;
      const sWidth = cropArea.width * scaleX;
      const sHeight = cropArea.height * scaleY;

      // Crop at high resolution
      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = sWidth;
      cropCanvas.height = sHeight;
      const cropCtx = cropCanvas.getContext("2d");
      if (!cropCtx) return;

      cropCtx.drawImage(
        offCanvas,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        sWidth,
        sHeight
      );

      cropCanvas.toBlob(
        (blob) => {
          if (blob) {
            const editedUrl = URL.createObjectURL(blob);
            onComplete(editedUrl);
          }
        },
        "image/jpeg",
        0.95
      );
    };
    img.src = image.url;
  };

  const resetAll = () => {
    setScale([100]);
    setRotation([0]);
    setBrightness([100]);
    setContrast([100]);
    setCropMode(false);
    setCropArea({ x: 50, y: 50, width: 300, height: 200 });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Edit Photo - {image.month}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetAll}>
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Canvas Preview */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/20">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto border rounded cursor-pointer bg-transparent"
                  style={{ maxHeight: "400px" }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  variant={cropMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCropMode(!cropMode)}
                >
                  <Crop className="w-4 h-4 mr-2" />
                  {cropMode ? "Exit Crop" : "Crop"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <ZoomIn className="w-4 h-4" />
                  Scale: {scale[0]}%
                </Label>
                <Slider
                  value={scale}
                  onValueChange={setScale}
                  min={50}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  Rotation: {rotation[0]}°
                </Label>
                <Slider
                  value={rotation}
                  onValueChange={setRotation}
                  min={-180}
                  max={180}
                  step={15}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label>Brightness: {brightness[0]}%</Label>
                <Slider
                  value={brightness}
                  onValueChange={setBrightness}
                  min={50}
                  max={150}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label>Contrast: {contrast[0]}%</Label>
                <Slider
                  value={contrast}
                  onValueChange={setContrast}
                  min={50}
                  max={150}
                  step={5}
                  className="w-full"
                />
              </div>

              {cropMode && (
                <div className="p-4 border rounded-lg bg-muted/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Move className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Crop Mode Active
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click and drag the highlighted area to reposition the crop
                    selection. Use the corner handles to resize.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
