// components/canvas/DrawingToolbar.tsx
import React, { useState } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  IconButton,
  Typography,
  Tooltip,
  Popover,
} from "@mui/material";
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ByzNurseBackButton from "../ByzNurseBackButton";

export type ToolType = "text" | "pen" | "line" | "square" | "circle" | "rectangle";
export type LineStyle = "solid" | "dashed" | "dotted";
export type FillPattern = "solid" | "horizontal" | "vertical" | "diagonalRight" | "diagonalLeft" | "cross" | "checkered";

interface DrawingToolbarProps {
  currentTool: ToolType;
  onChangeTool: (tool: ToolType) => void;
  onChangeStrokeColor: (color: string) => void;
  onChangeFillColor: (color: string) => void;
  onChangeLineStyle: (style: LineStyle) => void;
  onChangeLineWidth: (width: number) => void;
  onChangePattern: (pattern: FillPattern) => void;
  onUndo: () => void;
  lineStyle: LineStyle;
  lineWidth: number;
  fillPattern: FillPattern;
}

const colors = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
  "#FFFF00", "#FF00FF", "#00FFFF", "#808080", "#800000",
  "#808000", "#008000", "#800080", "#008080", "#000080"
];

const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  currentTool,
  onChangeTool,
  onChangeStrokeColor,
  onChangeFillColor,
  onChangeLineStyle,
  onChangeLineWidth,
  onChangePattern,
  onUndo,
  lineStyle,
  lineWidth,
  fillPattern,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showStrokeColors, setShowStrokeColors] = useState(true);

  const handleClickStrokePalette = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setShowStrokeColors(true);
  };

  const handleCloseStrokePalette = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <ToggleButtonGroup
          value={currentTool}
          exclusive
          onChange={(e, tool) => tool && onChangeTool(tool)}
          sx={{ display: 'flex', gap: 1, border: '1px solid #90caf9', borderRadius: 1, p: 0.25, m: 0.5 }}
        >
          <ToggleButton value="text" sx={{ minWidth: 36, height: 36, border: 'none' }}>A</ToggleButton>
          <ToggleButton value="pen" sx={{ minWidth: 36, height: 36, border: 'none' }}>✎</ToggleButton>
          <ToggleButton value="line" sx={{ minWidth: 36, height: 36, border: 'none' }}>/</ToggleButton>
          <ToggleButton value="square" sx={{ minWidth: 36, height: 36, border: 'none' }}>▣</ToggleButton>
          <ToggleButton value="circle" sx={{ minWidth: 36, height: 36, border: 'none' }}>◯</ToggleButton>
          <ToggleButton value="rectangle" sx={{ minWidth: 36, height: 36, border: 'none' }}>▭</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Divider orientation="vertical" flexItem />

      <Box display="flex" alignItems="center" gap={2}>
        <ToggleButtonGroup
          value={lineStyle}
          exclusive
          onChange={(e, style) => style && onChangeLineStyle(style)}
          sx={{ display: 'flex', gap: 1, border: '1px solid #90caf9', borderRadius: 1, p: 0.25, m: 0.5 }}
        >
          <ToggleButton value="solid" sx={{ minWidth: 36, height: 36, border: 'none' }}>─</ToggleButton>
          <ToggleButton value="dashed" sx={{ minWidth: 36, height: 36, border: 'none' }}>- -</ToggleButton>
          <ToggleButton value="dotted" sx={{ minWidth: 36, height: 36, border: 'none' }}>···</ToggleButton>
        </ToggleButtonGroup>
        {(currentTool === 'pen' || currentTool === 'line' || currentTool === 'text') && (
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={() => onChangeLineWidth(Math.max(1, lineWidth - 1))}>-</IconButton>
            <Typography>{lineWidth}</Typography>
            <IconButton onClick={() => onChangeLineWidth(Math.min(50, lineWidth + 1))}>+</IconButton>
          </Box>
        )}
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ borderRadius: 1, border: '1px solid #90caf9', p: 0.25, m: 0.1 }}>
            <Tooltip title="Çizgi Rengi">
              <ToggleButton
                value="stroke-colors"
                onClick={handleClickStrokePalette}
                sx={{ minWidth: 36, height: 36 }}
              >
                🎨
              </ToggleButton>
            </Tooltip>
          </Box>
          <Popover
            open={showStrokeColors && Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleCloseStrokePalette}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', padding: 1, maxWidth: 120 }}>
              {colors.map((color) => (
                <Box
                  key={color}
                  onClick={() => {
                    onChangeStrokeColor(color);
                    handleCloseStrokePalette();
                  }}
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: color,
                    border: '1px solid #000',
                    cursor: 'pointer',
                    m: 0.5,
                  }}
                />
              ))}
            </Box>
          </Popover>
        </Box>
      </Box>

      <Divider orientation="vertical" flexItem />

      <Box sx={{ borderRadius: 1, border: '1px solid #90caf9', p: 0.25, m: 0.1 }}>
        <Tooltip title="İç Renk">
          <ToggleButton
            value="fill-colors"
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              setShowStrokeColors(false);
            }}
            sx={{ minWidth: 36, height: 36 }}
          >
            <FormatColorFillIcon />
          </ToggleButton>
        </Tooltip>
      </Box>
      <Popover
        open={!showStrokeColors && Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseStrokePalette}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', padding: 1, maxWidth: 120 }}>
          {colors.map((color) => (
            <Box
              key={color}
              onClick={() => {
                onChangeFillColor(color);
                handleCloseStrokePalette();
              }}
              sx={{
                width: 20,
                height: 20,
                bgcolor: color,
                border: '1px solid #000',
                cursor: 'pointer',
                m: 0.5,
              }}
            />
          ))}
        </Box>
      </Popover>

      <Box display="flex" alignItems="center" gap={1}>
        <ToggleButtonGroup
          value={fillPattern}
          exclusive
          onChange={(e, p) => p && onChangePattern(p)}
          sx={{ display: 'flex', gap: 1, border: '1px solid #90caf9', borderRadius: 1, p: 0.25, m: 0.5 }}
        >
          <ToggleButton value="solid" sx={{ minWidth: 36, height: 36, border: 'none' }}>D</ToggleButton>
          <ToggleButton value="horizontal" sx={{ minWidth: 36, height: 36, border: 'none' }}>▬</ToggleButton>
          <ToggleButton value="vertical" sx={{ minWidth: 36, height: 36, border: 'none' }}>▮</ToggleButton>
          <ToggleButton value="diagonalRight" sx={{ minWidth: 36, height: 36, border: 'none' }}>\</ToggleButton>
          <ToggleButton value="diagonalLeft" sx={{ minWidth: 36, height: 36, border: 'none' }}>／</ToggleButton>
          <ToggleButton value="cross" sx={{ minWidth: 36, height: 36, border: 'none' }}>井</ToggleButton>
          <ToggleButton value="checkered" sx={{ minWidth: 36, height: 36, border: 'none' }}>▦</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ByzNurseBackButton onClick={onUndo}>geri</ByzNurseBackButton>
    </Box>
  );
};

export default DrawingToolbar;