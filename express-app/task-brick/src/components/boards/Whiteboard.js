import React, { useRef, useEffect, useState } from 'react';
import { FaPencilAlt, FaEraser, FaUndo, FaRedo, FaSave, FaSquare, FaCircle, FaFont } from 'react-icons/fa';
import { IoMdColorFill } from 'react-icons/io';
import { MdYard } from 'react-icons/md';
import backgroundImageUrl from '../../assets/images/white-board.png';

export const tools = {
  PENCIL: 'pencil',
  ERASER: 'eraser',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  TEXT: 'text',
};

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [tool, setTool] = useState(tools.PENCIL);
  const [currentStep, setCurrentStep] = useState(0);
  const [startPos, setStartPos] = useState({ x: 10, y: 10 });
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      saveDrawingState();
    };
    img.src = backgroundImageUrl;
  }, []);

  const getEventPosition = (e) => {
    if (e.touches) {
      const { clientX, clientY } = e.touches[0];
      return { x: clientX, y: clientY };
    } else {
      return { x: e.offsetX, y: e.offsetY };
    }
  };

  const handleColorChange = (e) => {
    setDrawingColor(e.target.value);
  };

  
  const startDrawing = (e) => {
    const { x, y } = getEventPosition(e);
    setStartPos({ x, y }); // Save start position for shapes and text
    if ([tools.RECTANGLE, tools.CIRCLE, tools.TEXT].includes(tool)) {
      // For shape and text tools, don't draw immediately
      setIsDrawing(false);
    } else {
      // For pencil and eraser, start drawing immediately
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e) => {
    if (!isDrawing || [tools.RECTANGLE, tools.CIRCLE, tools.TEXT].includes(tool)) return;
    const { x, y } = getEventPosition(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if ([tools.RECTANGLE, tools.CIRCLE, tools.TEXT].includes(tool)) {
      const { x, y } = getEventPosition(e);
      const ctx = canvasRef.current.getContext('2d');
      ctx.fillStyle = drawingColor; // Set fill style for shapes
  
      if (tool === tools.RECTANGLE) {
        ctx.beginPath();
        ctx.rect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
        ctx.fill();
      } else if (tool === tools.CIRCLE) {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.fill();
      }
      saveDrawingState();
    } else {
      // Pencil and eraser logic to stop drawing
      setIsDrawing(false);
      const ctx = canvasRef.current.getContext('2d');
      ctx.closePath();
      saveDrawingState();
    }
  };
  
  const handleTextInputChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleSubmitText = () => {
    if (tool === tools.TEXT && textInput.trim()) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.font = `${lineWidth * 5}px Arial`; // Adjust font size based on line width
      ctx.fillStyle = drawingColor;
      ctx.fillText(textInput, startPos.x, startPos.y);
      setTextInput(''); // Clear the text input after drawing
      saveDrawingState();
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmitText();
    }
  };
  
  useEffect(() => {
    // Using the assigned ID to get the element
    const textInput = document.getElementById('text-input-field');
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSubmitText();
        e.preventDefault(); // Prevent the default action to avoid submitting a form if your input is part of one
      }
    };
  
    // Adding the event listener to the text input field
    textInput.addEventListener('keypress', handleKeyPress);
  
    // Cleanup function to remove the event listener when the component unmounts or the useEffect dependencies change
    return () => {
      textInput.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleSubmitText]); // Dependencies array to re-run the effect if handleSubmitText changes
  
  

  const saveDrawingState = () => {
    const canvasUrl = canvasRef.current.toDataURL();
    const history = drawingHistory.slice(0, currentStep + 1);
    history.push(canvasUrl);
    setDrawingHistory(history);
    setCurrentStep(history.length - 1);
  };

  const restoreDrawingState = (index) => {
    const canvasState = drawingHistory[index];
    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = canvasState;
  };

  const undo = () => {
    if (currentStep > 0) {
      restoreDrawingState(currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  };

  const redo = () => {
    if (currentStep < drawingHistory.length - 1) {
      restoreDrawingState(currentStep + 1);
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);

      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isDrawing, drawingColor, lineWidth]);

  const handleToolChange = (selectedTool) => {
    setTool(selectedTool);
    // Reset states if necessary
    setStartPos({ x: 0, y: 0 });
    if (selectedTool === tools.ERASER) {
      setDrawingColor('#FFFFFF'); // Set drawing color to white for eraser
    } else {
      setDrawingColor('#000000'); // Or keep the previous color, depending on your design
    }
    setTextInput(''); // Clear text input when changing tools
  };
  

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded shadow-lg">
      <div className="flex items-center justify-between mb-4 w-full max-w-xl">
        <button
          className={`p-2 rounded hover:bg-blue-200 ${tool === tools.PENCIL ? 'bg-blue-200' : ''}`}
          onClick={() => handleToolChange(tools.PENCIL)}
        >
          <FaPencilAlt className="text-blue-500" />
        </button>
        <button
          className={`p-2 rounded hover:bg-gray-200 ${tool === tools.ERASER ? 'bg-gray-200' : ''}`}
          onClick={() => handleToolChange(tools.ERASER)}
        >
          <FaEraser className="text-gray-500" />
        </button>
        <button className="p-2 rounded hover:bg-green-200" onClick={undo}>
          <FaUndo className="text-green-500" />
        </button>
        <button className="p-2 rounded hover:bg-red-200" onClick={redo}>
          <FaRedo className="text-red-500" />
        </button>
        <button className="p-2 rounded hover:bg-purple-200" onClick={saveDrawingState}>
          <FaSave className="text-purple-500" />
        </button>
        <div className="flex items-center space-x-2">
        <input
                type="text"
                placeholder="Enter text"
                className="border rounded p-1"
                value={textInput}
                onChange={handleTextInputChange}
                id="text-input-field" // Assigning an ID to the input field
                />
            <button 
            className="p-2 rounded hover:bg-blue-200"
            onClick={handleSubmitText}
            >Enter
            </button>
            <button
            className={`p-2 rounded hover:bg-orange-200 ${tool === tools.RECTANGLE ? 'bg-orange-200' : ''}`}
            onClick={() => handleToolChange(tools.RECTANGLE)}
            >
            <FaSquare className="text-orange-500" />
            </button>
            <button
            className={`p-2 rounded hover:bg-teal-200 ${tool === tools.CIRCLE ? 'bg-teal-200' : ''}`}
            onClick={() => handleToolChange(tools.CIRCLE)}

            >
            <FaCircle className="text-teal-500" />
            </button>

          </div>
          <button className="p-2 rounded hover:bg-blue-200" 
          onClick={() => handleToolChange(tools.TEXT)}>
            <FaFont className="text-blue-500" 
           
            />
          </button>
        <div className="flex items-center space-x-2">
          <IoMdColorFill className="text-xl text-black" />
          <input type="color" value={drawingColor} onChange={handleColorChange} disabled={tool === tools.ERASER}
          className="border rounded p-1"
          style={{ width: '50px', height: '50px' }}

          />
        </div>
        <div className="flex items-center space-x-2">
          <MdYard className="text-xl text-black" />
          <input type="range" min="1" max="10" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)}
          className="border rounded p-1"
          style={{ width: '100px', height: '50px' }}

          />
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width="1200"
        height="600"
        className="border rounded"
        style={{ maxWidth: '100%' }}
      />
    </div>
  );
};

export default Whiteboard;
