import { FillPattern } from '../components/canvas/DrawingToolbar';
import { Line } from 'react-konva';
import React from 'react';

interface Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  stroke: string;
  fill?: string;
  fillPattern?: FillPattern;
  patternColor?: string;
}

// Desen oluşturma fonksiyonları
export const createPattern = (pattern: FillPattern, color: string, size: number = 20) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = size;
  canvas.height = size;

  // Arka planı temizle
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, size, size);

  // Desen rengini ayarla
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  switch (pattern) {
    case 'solid':
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, size, size);
      break;

    case 'horizontal':
      for (let y = 0; y < size; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
      }
      break;

    case 'vertical':
      for (let x = 0; x < size; x += 4) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
      }
      break;

    case 'diagonalLeft':
      for (let i = -size; i < size * 2; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
        ctx.stroke();
      }
      break;

    case 'diagonalRight':
      for (let i = -size; i < size * 2; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, size);
        ctx.lineTo(i + size, 0);
        ctx.stroke();
      }
      break;

    case 'cross':
      // Yatay çizgiler
      for (let y = 0; y < size; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
      }
      // Dikey çizgiler
      for (let x = 0; x < size; x += 4) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
      }
      break;

    case 'checkered':
      for (let y = 0; y < size; y += 8) {
        for (let x = 0; x < size; x += 8) {
          if ((Math.floor(x / 8) + Math.floor(y / 8)) % 2 === 0) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 8, 8);
          }
        }
      }
      break;
  }

  return canvas;
};

// Desen oluşturma ve uygulama fonksiyonu
export const applyPattern = (pattern: FillPattern, color: string, size: number = 20) => {
  const patternCanvas = createPattern(pattern, color, size);
  if (!patternCanvas) return null;

  const patternImage = new Image();
  patternImage.src = patternCanvas.toDataURL();

  return patternImage;
};

// Şekil için desen çizgilerini oluşturan fonksiyon
export const createPatternLines = (
  shape: Shape,
  pattern: FillPattern,
  index: number
): React.ReactNode[] => {
  const patternLines: React.ReactNode[] = [];

  // Yatay çizgili desen
  if (pattern === 'horizontal') {
    const lines = Array.from({ length: Math.floor(shape.height / 10) }).map((_, i) => (
      <Line
        key={`pattern-horizontal-${index}-${i}`}
        points={[
          shape.x,
          shape.y + i * 10,
          shape.x + shape.width,
          shape.y + i * 10,
        ]}
        stroke={shape.patternColor || shape.stroke}
        strokeWidth={1}
      />
    ));
    patternLines.push(...lines);
  }

  // Dikey çizgili desen
  if (pattern === 'vertical') {
    const lines = Array.from({ length: Math.floor(shape.width / 10) }).map((_, i) => (
      <Line
        key={`pattern-vertical-${index}-${i}`}
        points={[
          shape.x + i * 10,
          shape.y,
          shape.x + i * 10,
          shape.y + shape.height,
        ]}
        stroke={shape.patternColor || shape.stroke}
        strokeWidth={1}
      />
    ));
    patternLines.push(...lines);
  }

  // Sağa yatık çapraz desen
  if (pattern === 'diagonalRight') {
    const lines = Array.from({ length: Math.floor((shape.width + shape.height) / 10) }).map((_, i) => (
      <Line
        key={`pattern-diagRight-${index}-${i}`}
        points={[
          shape.x + i * 10,
          shape.y,
          shape.x - shape.height + i * 10,
          shape.y + shape.height,
        ]}
        stroke={shape.patternColor || shape.stroke}
        strokeWidth={1}
      />
    ));
    patternLines.push(...lines);
  }

  // Sola yatık çapraz desen
  if (pattern === 'diagonalLeft') {
    const lines = Array.from({ length: Math.floor((shape.width + shape.height) / 10) }).map((_, i) => (
      <Line
        key={`pattern-diagLeft-${index}-${i}`}
        points={[
          shape.x + i * 10,
          shape.y + shape.height,
          shape.x - shape.height + i * 10,
          shape.y,
        ]}
        stroke={shape.patternColor || shape.stroke}
        strokeWidth={1}
      />
    ));
    patternLines.push(...lines);
  }

  // Çapraz kareli desen (X desen)
  if (pattern === 'cross') {
    const rightLines = Array.from({ length: Math.floor((shape.width + shape.height) / 10) }).map((_, i) => (
      <Line
        key={`pattern-cross-diagRight-${index}-${i}`}
        points={[
          shape.x + i * 10,
          shape.y,
          shape.x - shape.height + i * 10,
          shape.y + shape.height,
        ]}
        stroke={shape.patternColor || shape.stroke}
        strokeWidth={1}
      />
    ));
    const leftLines = Array.from({ length: Math.floor((shape.width + shape.height) / 10) }).map((_, i) => (
      <Line
        key={`pattern-cross-diagLeft-${index}-${i}`}
        points={[
          shape.x + i * 10,
          shape.y + shape.height,
          shape.x - shape.height + i * 10,
          shape.y,
        ]}
        stroke={shape.patternColor || shape.stroke}
        strokeWidth={1}
      />
    ));
    patternLines.push(...rightLines, ...leftLines);
  }

  // Kareli desen
  if (pattern === 'checkered') {
    const horizontalLines = Array.from({ length: Math.floor(shape.height / 10) }).map((_, row) => (
      <Line
        key={`pattern-checkered-h-${index}-${row}`}
        points={[
          shape.x,
          shape.y + row * 10,
          shape.x + shape.width,
          shape.y + row * 10,
        ]}
        stroke={shape.patternColor || shape.stroke}
        strokeWidth={1}
      />
    ));
    const verticalLines = Array.from({ length: Math.floor(shape.width / 10) }).map((_, col) => (
      <Line
        key={`pattern-checkered-v-${index}-${col}`}
        points={[
          shape.x + col * 10,
          shape.y,
          shape.x + col * 10,
          shape.y + shape.height,
        ]}
        stroke={shape.patternColor || shape.stroke}
        strokeWidth={1}
      />
    ));
    patternLines.push(...horizontalLines, ...verticalLines);
  }

  return patternLines;
};

// Daire için desen çizgilerini oluşturan fonksiyon
export const createCirclePatternLines = (
  shape: Shape,
  pattern: FillPattern,
  index: number
): React.ReactNode[] => {
  const patternLines: React.ReactNode[] = [];

  if (!shape.radius) {
    return patternLines;
  }

  const r = shape.radius;
  const cx = shape.x;
  const cy = shape.y;

  // Yatay çizgili desen
  if (pattern === 'horizontal') {
    for (let y = cy - r; y <= cy + r; y += 10) {
      patternLines.push(
        <Line
          key={`circle-horizontal-${index}-${y}`}
          points={[cx - r, y, cx + r, y]}
          stroke={shape.patternColor || shape.stroke}
          strokeWidth={1}
        />
      );
    }
  }

  // Dikey çizgili desen
  if (pattern === 'vertical') {
    for (let x = cx - r; x <= cx + r; x += 10) {
      patternLines.push(
        <Line
          key={`circle-vertical-${index}-${x}`}
          points={[x, cy - r, x, cy + r]}
          stroke={shape.patternColor || shape.stroke}
          strokeWidth={1}
        />
      );
    }
  }

  // Sağa yatık çapraz desen
  if (pattern === 'diagonalRight') {
    for (let i = -r; i <= r * 2; i += 10) {
      patternLines.push(
        <Line
          key={`circle-diagRight-${index}-${i}`}
          points={[cx + i, cy - r, cx + i + r, cy + r]}
          stroke={shape.patternColor || shape.stroke}
          strokeWidth={1}
        />
      );
    }
  }

  // Sola yatık çapraz desen
  if (pattern === 'diagonalLeft') {
    for (let i = -r; i <= r * 2; i += 10) {
      patternLines.push(
        <Line
          key={`circle-diagLeft-${index}-${i}`}
          points={[cx + i, cy - r, cx + i - r, cy + r]}
          stroke={shape.patternColor || shape.stroke}
          strokeWidth={1}
        />
      );
    }
  }

  // Çapraz kareli desen (X desen)
  if (pattern === 'cross') {
    for (let j = -r * 2; j <= r * 2; j += 10) {
      patternLines.push(
        <Line
          key={`circle-cross-diagRight-${index}-${j}`}
          points={[cx + j, cy - r, cx + j + r, cy + r]}
          stroke={shape.patternColor || shape.stroke}
          strokeWidth={1}
        />
      );
    }
    for (let j = -r * 2; j <= r * 2; j += 10) {
      patternLines.push(
        <Line
          key={`circle-cross-diagLeft-${index}-${j}`}
          points={[cx + j, cy - r, cx + j - r, cy + r]}
          stroke={shape.patternColor || shape.stroke}
          strokeWidth={1}
        />
      );
    }
  }

  // Kareli desen
  if (pattern === 'checkered') {
    for (let y = cy - r; y <= cy + r; y += 10) {
      patternLines.push(
        <Line
          key={`circle-checkered-h-${index}-${y}`}
          points={[cx - r, y, cx + r, y]}
          stroke={shape.patternColor || shape.stroke}
          strokeWidth={1}
        />
      );
    }
    for (let x = cx - r; x <= cx + r; x += 10) {
      patternLines.push(
        <Line
          key={`circle-checkered-v-${index}-${x}`}
          points={[x, cy - r, x, cy + r]}
          stroke={shape.patternColor || shape.stroke}
          strokeWidth={1}
        />
      );
    }
  }

  return patternLines;
}; 