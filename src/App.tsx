import React, { useState, Dispatch, SetStateAction } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import DrawingToolbar, { ToolType, LineStyle, FillPattern } from './components/canvas/DrawingToolbar';
import KonvaCanvas from './components/canvas/KovaCanvas';
import ByzNurseSaveButton from './components/ByzNurseSaveButton';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [tool, setTool] = useState<ToolType>("pen");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#ffffff");
  const [lineStyle, setLineStyle] = useState<LineStyle>("solid");
  const [lineWidth, setLineWidth] = useState(2);
  const [fillPattern, setFillPattern] = useState<FillPattern>("solid");
  const [undoSignal, setUndoSignal] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 2 }}>
        <DrawingToolbar
          currentTool={tool}
          onChangeTool={setTool}
          onChangeStrokeColor={setStrokeColor}
          onChangeFillColor={setFillColor}
          onChangeLineStyle={setLineStyle}
          onChangeLineWidth={setLineWidth}
          onChangePattern={setFillPattern}
          onUndo={() => setUndoSignal(true)}
          lineStyle={lineStyle}
          lineWidth={lineWidth}
          fillPattern={fillPattern}
        />
        <KonvaCanvas
          tool={tool}
          strokeColor={strokeColor}
          fillColor={fillColor}
          lineStyle={lineStyle}
          lineWidth={lineWidth}
          fillPattern={fillPattern}
          undoSignal={undoSignal}
          onUndoComplete={() => setUndoSignal(false)}
        />
        <ByzNurseSaveButton />
      </Box>
    </ThemeProvider>
  );
}

export default App;