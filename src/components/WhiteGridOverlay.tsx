import React, { useMemo } from 'react';

interface WhiteGridOverlayProps {
  className?: string;
  shadow?: boolean;
}

/**
 * WhiteGridOverlay renders the exact prominent white grid structure seen in the visual reference.
 * It uses an SVG path with fillRule="evenodd" to punch out 64 rounded apertures (one for each 8x8 cell).
 * The empty cell apertures are 100% transparent so the underlying photo remains crystal clear,
 * while the solid white gridlines, corner fillets, and delicate drop-shadow create crisp, beautiful separation.
 */
export const WhiteGridOverlay: React.FC<WhiteGridOverlayProps> = ({
  className = '',
  shadow = true,
}) => {
  const svgPath = useMemo(() => {
    // Coordinate space: 1000 x 1000
    // 8x8 grid: each slot is 125 units (1000 / 8)
    const slot = 125;
    // Line width between cells = 2 * halfGap
    const halfGap = 1.25;
    const cellW = slot - 2 * halfGap;
    const rx = 8.5; // Smooth rounded corner fillets
    const ry = 8.5;

    // Outer boundary of the grid with outer corner radius
    const outerR = 18;
    const outerPath = `M ${outerR} 0 ` +
      `H ${1000 - outerR} ` +
      `A ${outerR} ${outerR} 0 0 1 1000 ${outerR} ` +
      `V ${1000 - outerR} ` +
      `A ${outerR} ${outerR} 0 0 1 ${1000 - outerR} 1000 ` +
      `H ${outerR} ` +
      `A ${outerR} ${outerR} 0 0 1 0 ${1000 - outerR} ` +
      `V ${outerR} ` +
      `A ${outerR} ${outerR} 0 0 1 ${outerR} 0 Z`;

    const apertures: string[] = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const x = c * slot + halfGap;
        const y = r * slot + halfGap;

        // Rounded rectangle aperture path
        const d = `M ${x + rx} ${y} ` +
          `H ${x + cellW - rx} ` +
          `A ${rx} ${ry} 0 0 1 ${x + cellW} ${y + ry} ` +
          `V ${y + cellW - ry} ` +
          `A ${rx} ${ry} 0 0 1 ${x + cellW - rx} ${y + cellW} ` +
          `H ${x + rx} ` +
          `A ${rx} ${ry} 0 0 1 ${x} ${y + cellW - ry} ` +
          `V ${y + ry} ` +
          `A ${rx} ${ry} 0 0 1 ${x + rx} ${y} Z`;

        apertures.push(d);
      }
    }

    return `${outerPath} ${apertures.join(' ')}`;
  }, []);

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: shadow ? 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.22))' : undefined,
      }}
    >
      <path
        d={svgPath}
        fill="#FFFFFF"
        fillRule="evenodd"
      />
    </svg>
  );
};
