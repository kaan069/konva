// components/canvas/KonvaCanvas.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Group } from 'react-konva';
import { ToolType, LineStyle, FillPattern } from './DrawingToolbar';
import { applyPattern, createPatternLines, createCirclePatternLines } from '../../utils/patternUtils';
import { KonvaEventObject } from 'konva/lib/Node';

interface KonvaCanvasProps {
  tool: ToolType;
  strokeColor: string;
  fillColor: string;
  lineStyle: LineStyle;
  lineWidth: number;
  fillPattern: FillPattern;
  undoSignal: boolean;
  onUndoComplete: () => void;
}

interface Shape {
  id: string;
  type: 'pen' | 'line' | 'rectangle' | 'circle' | 'square' | 'text';
  points: number[];
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  stroke: string;
  fill: string;
  fillPattern?: FillPattern;
  patternColor?: string;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  isDragging?: boolean;
  lineStyle: LineStyle;
  lineWidth: number;
}

const KonvaCanvas: React.FC<KonvaCanvasProps> = ({
  tool,
  strokeColor,
  fillColor,
  lineStyle,
  lineWidth,
  fillPattern,
  undoSignal,
  onUndoComplete,
}) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [elements, setElements] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPoints, setCurrentPoints] = useState<number[]>([]);
  const [tempLine, setTempLine] = useState<Shape | null>(null);
  const [patternImages, setPatternImages] = useState<{ [key: string]: HTMLImageElement }>({});
  const stageRef = useRef<any>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolType>(tool);
  const [selectedLineStyle, setSelectedLineStyle] = useState<LineStyle>(lineStyle);
  const [selectedFillPattern, setSelectedFillPattern] = useState<FillPattern>(fillPattern);

  useEffect(() => {
    if (undoSignal) {
      setShapes(shapes.slice(0, -1));
      setElements(elements.slice(0, -1));
      onUndoComplete();
    }
  }, [undoSignal]);

  useEffect(() => {
    const newPatternImages: { [key: string]: HTMLImageElement } = {};
    const patterns: FillPattern[] = ['solid', 'horizontal', 'vertical', 'diagonalLeft', 'diagonalRight', 'cross', 'checkered'];
    
    patterns.forEach(pattern => {
      const image = applyPattern(pattern, fillColor);
      if (image) {
        newPatternImages[pattern] = image;
      }
    });

    setPatternImages(prevImages => ({
      ...prevImages,
      ...newPatternImages
    }));
  }, [fillColor]);

  useEffect(() => {
    setSelectedTool(tool);
    setSelectedLineStyle(lineStyle);
    setSelectedFillPattern(fillPattern);
  }, [tool, lineStyle, fillPattern]);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setIsDrawing(true);
    setStartPos({ x: pos.x, y: pos.y });

    const newShape: Shape = {
      id: Date.now().toString(),
      type: selectedTool,
      points: selectedTool === 'line' ? [pos.x, pos.y, pos.x, pos.y] : [pos.x, pos.y],
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      stroke: strokeColor,
      fill: fillColor,
      lineStyle: selectedLineStyle,
      lineWidth: lineWidth,
    };

    setCurrentShape(newShape);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !currentShape) return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (currentShape.type === 'pen') {
      const updatedShape = {
        ...currentShape,
        points: [...currentShape.points, pos.x, pos.y],
      };
      setCurrentShape(updatedShape);
    } else if (currentShape.type === 'line') {
      const updatedShape = {
        ...currentShape,
        points: [currentShape.x, currentShape.y, pos.x, pos.y],
      };
      setCurrentShape(updatedShape);
    } else {
      const updatedShape = {
        ...currentShape,
        width: Math.abs(pos.x - currentShape.x),
        height: Math.abs(pos.y - currentShape.y),
        radius: currentShape.type === 'circle' ? Math.sqrt(Math.pow(pos.x - currentShape.x, 2) + Math.pow(pos.y - currentShape.y, 2)) : undefined,
      };
      setCurrentShape(updatedShape);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentShape) return;

    const newShape: Shape = {
      ...currentShape,
      fillPattern: selectedFillPattern,
      patternColor: fillColor,
    };

    setShapes([...shapes, newShape]);
    setCurrentShape(null);
  };

  const getDashArray = (style: LineStyle) => {
    switch (style) {
      case 'dashed': return [10, 5];
      case 'dotted': return [2, 2];
      default: return [];
    }
  };

  return (
    <Stage
      width={window.innerWidth - 40}
      height={window.innerHeight - 200}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={stageRef}
      style={{ border: '1px solid #ccc' }}
    >
      <Layer>
        {shapes.map((shape, i) => {
          if (shape.type === 'line' || shape.type === 'pen') {
            return (
              <Line
                key={i}
                points={shape.points}
                stroke={shape.stroke}
                strokeWidth={shape.lineWidth || lineWidth}
                dash={getDashArray(shape.lineStyle || lineStyle)}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            );
          } else if (shape.type === 'rectangle' || shape.type === 'square') {
            return (
              <Group key={shape.id}>
                <Rect
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  stroke={shape.stroke}
                  fill={shape.fillPattern === 'solid' ? shape.fill : 'transparent'}
                  lineStyle={shape.lineStyle}
                  lineWidth={shape.lineWidth}
                />
                {shape.fillPattern && shape.fillPattern !== 'solid' && 
                  createPatternLines(shape, shape.fillPattern, i)}
              </Group>
            );
          } else if (shape.type === 'circle') {
            return (
              <Group key={shape.id}>
                <Circle
                  x={shape.x}
                  y={shape.y}
                  radius={shape.radius}
                  stroke={shape.stroke}
                  fill={shape.fillPattern === 'solid' ? shape.fill : 'transparent'}
                  lineStyle={shape.lineStyle}
                  lineWidth={shape.lineWidth}
                />
                {shape.fillPattern && shape.fillPattern !== 'solid' && 
                  createCirclePatternLines(shape, shape.fillPattern, i)}
              </Group>
            );
          } else if (shape.type === 'text') {
            return (
              <Text
                key={i}
                x={shape.x}
                y={shape.y}
                text={shape.text}
                fill={shape.stroke}
                fontSize={16}
              />
            );
          }
          return null;
        })}
        {currentShape && (
          <>
            {currentShape.type === 'line' || currentShape.type === 'pen' ? (
              <Line
                points={currentShape.points}
                stroke={currentShape.stroke}
                strokeWidth={currentShape.lineWidth}
                dash={getDashArray(currentShape.lineStyle)}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            ) : currentShape.type === 'rectangle' || currentShape.type === 'square' ? (
              <Group>
                <Rect
                  x={currentShape.x}
                  y={currentShape.y}
                  width={currentShape.width}
                  height={currentShape.height}
                  stroke={currentShape.stroke}
                  fill={currentShape.fillPattern === 'solid' ? currentShape.fill : 'transparent'}
                  lineStyle={currentShape.lineStyle}
                  lineWidth={currentShape.lineWidth}
                />
                {currentShape.fillPattern && currentShape.fillPattern !== 'solid' && 
                  createPatternLines(currentShape, currentShape.fillPattern, -1)}
              </Group>
            ) : currentShape.type === 'circle' ? (
              <Group>
                <Circle
                  x={currentShape.x}
                  y={currentShape.y}
                  radius={currentShape.radius}
                  stroke={currentShape.stroke}
                  fill={currentShape.fillPattern === 'solid' ? currentShape.fill : 'transparent'}
                  lineStyle={currentShape.lineStyle}
                  lineWidth={currentShape.lineWidth}
                />
                {currentShape.fillPattern && currentShape.fillPattern !== 'solid' && 
                  createCirclePatternLines(currentShape, currentShape.fillPattern, -1)}
              </Group>
            ) : null}
          </>
        )}
      </Layer>
    </Stage>
  );
};

export default KonvaCanvas;