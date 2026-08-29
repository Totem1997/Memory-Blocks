import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, Check, Move } from 'lucide-react';

interface CropPhotoScreenProps {
  photoSrc: string;
  onCropConfirmed: (croppedDataUrl: string) => void;
  onBack: () => void;
}

export const CropPhotoScreen: React.FC<CropPhotoScreenProps> = ({
  photoSrc,
  onCropConfirmed,
  onBack,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 800, height: 800 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Load natural image dimensions
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoSrc;
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      // Center image
      setPosition({ x: 0, y: 0 });
      setScale(1);
    };
  }, [photoSrc]);

  // Pointer drag handling
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Perform crop on canvas
  const handleConfirmCrop = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const exportSize = 800; // Crisp square output
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    // Fill background with soft neutral in case of edge margin
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, exportSize, exportSize);

    // Calculate scale factor between display container and export canvas
    const ratio = exportSize / containerRect.width;

    // Calculate dimensions of image relative to container
    const isWider = naturalSize.width / naturalSize.height > 1;
    let baseDisplayWidth = containerRect.width;
    let baseDisplayHeight = containerRect.height;

    if (isWider) {
      baseDisplayWidth = (containerRect.height * naturalSize.width) / naturalSize.height;
    } else {
      baseDisplayHeight = (containerRect.width * naturalSize.height) / naturalSize.width;
    }

    const currentDisplayWidth = baseDisplayWidth * scale;
    const currentDisplayHeight = baseDisplayHeight * scale;

    const centerX = containerRect.width / 2 + position.x;
    const centerY = containerRect.height / 2 + position.y;

    const drawX = (centerX - currentDisplayWidth / 2) * ratio;
    const drawY = (centerY - currentDisplayHeight / 2) * ratio;
    const drawW = currentDisplayWidth * ratio;
    const drawH = currentDisplayHeight * ratio;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
    onCropConfirmed(croppedDataUrl);
  }, [naturalSize, position, scale, onCropConfirmed]);

  return (
    <div
      id="crop-photo-screen"
      className="flex flex-col justify-between min-h-screen px-6 py-6 max-w-md mx-auto select-none"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full">
        <button
          id="btn-crop-back"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-[#F3ECE4] text-[#6D655E] transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-xs font-semibold tracking-wider text-[#8C7A6B] uppercase font-display">
          Position Your Memory
        </span>
        <div className="w-8" />
      </div>

      {/* Center Crop Workspace */}
      <div className="my-auto flex flex-col items-center">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-[#2D2A26] font-display">
            Adjust Game Board Area
          </h2>
          <p className="text-xs text-[#6D655E] mt-1">
            Drag to reposition. This square is what will appear under your blocks.
          </p>
        </div>

        {/* Square Crop Frame with 8x8 Grid Preview */}
        <div
          ref={containerRef}
          className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden bg-neutral-900 border-2 border-[#DCD3C7] shadow-lg cursor-grab active:cursor-grabbing touch-none select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Underlying Image */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.05s ease-out',
            }}
          >
            <img
              ref={imageRef}
              src={photoSrc}
              alt="Memory crop preview"
              className="max-w-none pointer-events-none"
              style={{
                width: naturalSize.width > naturalSize.height ? 'auto' : '100%',
                height: naturalSize.width > naturalSize.height ? '100%' : 'auto',
                minWidth: '100%',
                minHeight: '100%',
                objectFit: 'cover',
              }}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Exact 8x8 Grid Preview Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-90">
            {/* Vertical lines */}
            <div className="absolute inset-0 flex justify-evenly">
              {[...Array(7)].map((_, i) => (
                <div key={`v-${i}`} className="w-[1px] h-full bg-white/20" />
              ))}
            </div>
            {/* Horizontal lines */}
            <div className="absolute inset-0 flex flex-col justify-evenly">
              {[...Array(7)].map((_, i) => (
                <div key={`h-${i}`} className="h-[1px] w-full bg-white/20" />
              ))}
            </div>
            {/* Outer boundary */}
            <div className="absolute inset-0 border border-white/20" />
          </div>

          {/* Hint badge */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/40 backdrop-blur-xs text-[10px] text-white/90 font-medium flex items-center gap-1 pointer-events-none">
            <Move className="w-3 h-3" />
            <span>Drag to center</span>
          </div>
        </div>

        {/* Zoom Slider Control */}
        <div className="w-72 sm:w-80 mt-5 px-3 py-2.5 rounded-xl bg-[#F3ECE4] flex items-center gap-3">
          <ZoomOut className="w-4 h-4 text-[#8C7A6B]" />
          <input
            id="slider-zoom"
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full accent-[#2D2A26] cursor-pointer"
          />
          <ZoomIn className="w-4 h-4 text-[#8C7A6B]" />
        </div>
      </div>

      {/* Bottom Confirmation Button (Section 8 requirement) */}
      <div className="w-full pt-4">
        <button
          id="btn-use-this-memory"
          onClick={handleConfirmCrop}
          className="w-full py-4 px-6 bg-[#2D2A26] hover:bg-[#1A1816] active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 font-display tracking-wide cursor-pointer"
        >
          <Check className="w-5 h-5 text-[#86EFAC]" />
          <span>USE THIS MEMORY</span>
        </button>
      </div>
    </div>
  );
};
