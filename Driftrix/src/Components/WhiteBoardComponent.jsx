import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle, Text } from "react-konva";
import {
  FaPencilAlt,
  FaTextHeight,
  FaEraser,
  FaSave,
  FaDownload,
  FaArrowsAlt,
  FaRegCircle,
  FaSquare,
  FaMinus,
  FaTrash,
} from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { IoIosColorPalette } from "react-icons/io";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";

const WhiteBoardComponent = ({ drawing }) => {
  const [elements, setElements] = useState(drawing?.elements || []);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [textInput, setTextInput] = useState("");
  const [showTextArea, setShowTextArea] = useState(false);
  const [textSize, setTextSize] = useState(12);
  const isDrawing = useRef(false);
  const stageRef = useRef();
  const containerRef = useRef();
  const [drawingName, setDrawingName] = useState(drawing?.drawingName || "");
  const [authorName, setAuthorName] = useState(drawing?.authorName || "");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (drawing) {
      setElements(drawing.elements || []);
      setDrawingName(drawing.drawingName || "");
      setAuthorName(drawing.authorName || "");
    }
  }, [drawing]);

  // Handling canvas size of the board
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && stageRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        stageRef.current.width(containerWidth);
        stageRef.current.height(window.innerHeight * 0.8);
        // redraw while editing
        stageRef.current.batchDraw();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseDown = (e) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const { x, y } = pointerPosition;
    const id = uuidv4();

    isDrawing.current = true;

    if (tool === "pen" || tool === "line") {
      setElements((prev) => [
        ...prev,
        { id, type: "line", points: [x, y], color, strokeWidth: 2 },
      ]);
    } else if (tool === "rectangle") {
      setElements((prev) => [
        ...prev,
        { id, type: "rectangle", x, y, width: 0, height: 0, color },
      ]);
    } else if (tool === "circle") {
      setElements((prev) => [
        ...prev,
        { id, type: "circle", x, y, radius: 0, color },
      ]);
    } else if (tool === "text") {
      setElements((prev) => [
        ...prev,
        {
          id,
          type: "text",
          x,
          y,
          text: textInput || "Edit me",
          color,
          size: textSize,
        },
      ]);
      setShowTextArea(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const { x, y } = pointerPosition;

    setElements((prev) => {
      const updatedElements = [...prev];
      const element = updatedElements[updatedElements.length - 1];

      if (tool === "pen") {
        element.points = element.points.concat([x, y]);
      } else if (tool === "line") {
        element.points = [element.points[0], element.points[1], x, y];
      } else if (tool === "rectangle") {
        element.width = x - element.x;
        element.height = y - element.y;
      } else if (tool === "circle") {
        element.radius = Math.sqrt(
          Math.pow(x - element.x, 2) + Math.pow(y - element.y, 2)
        );
      }

      return updatedElements;
    });
  };

  const handleTextTool = () => {
    setTool("text");
    setShowTextArea(true);
  };

  const handleTextChange = (id, newText) => {
    setElements((prev) =>
      prev.map((element) =>
        element.id === id ? { ...element, text: newText } : element
      )
    );
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleClear = () => {
    setElements([]);
  };

  const handleDownload = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = uri;
    link.click();
  };

  const handleSave = () => {
    setShowSaveModal(true);
    document.getElementById("saveDrawing").showModal();
  };

  const handleCloseModal = () => {
    setShowSaveModal(false);
    document.getElementById("saveDrawing").close();
  };

  const handleSaveToGallery = async () => {
    const drawingData = {
      drawingName,
      authorName,
      elements,
    };

    // Convert the drawing on the canvas to a base64 image
    const uri = stageRef.current.toDataURL();
    drawingData.image = uri;

    // update edited drawing in database

    if (drawing && drawing._id) {
      try {
        const response = await fetch(
          `https://draftrix-server.vercel.app/drawings/${drawing._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(drawingData),
          }
        );

        if (response.ok) {
          alert("Drawing updated successfully!");
          handleCloseModal();
          navigate("/drawings");
        } else {
          alert("Failed to update drawing.");
        }
      } catch (error) {
        console.error("Error updating drawing:", error);
      }
    } else {
      // save new drawing in database
      try {
        const response = await fetch("https://draftrix-server.vercel.app/drawings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(drawingData),
        });

        if (response.ok) {
          alert("Drawing saved successfully!");
          handleCloseModal();
          navigate("/drawings");
        } else {
          alert("Failed to save drawing.");
        }
      } catch (error) {
        console.error("Error saving drawing:", error);
      }
    }
  };

  const handleEraserClick = (id) => {
    if (tool === "eraser") {
      setElements((prevElements) => prevElements.filter((el) => el.id !== id));
    }
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleToolChange = (selectedTool) => {
    if (selectedTool === "text") {
      setShowTextArea(true);
    }
    setShowTextArea(false);
    setTool(selectedTool);
  };

  const tools = [
    {
      name: "pen",
      tooltip: "Draw",
      icon: <FaPencilAlt />,
      activeColor: "bg-blue-500",
      inactiveColor: "bg-blue-100",
    },
    {
      name: "line",
      tooltip: "Line",
      icon: <FaMinus />,
      activeColor: "bg-green-500",
      inactiveColor: "bg-green-100",
    },
    {
      name: "rectangle",
      tooltip: "Box",
      icon: <FaSquare />,
      activeColor: "bg-purple-500",
      inactiveColor: "bg-purple-100",
    },
    {
      name: "circle",
      tooltip: "Circle",
      icon: <FaRegCircle />,
      activeColor: "bg-red-500",
      inactiveColor: "bg-red-100",
    },
    {
      name: "text",
      tooltip: "Text",
      icon: <FaTextHeight />,
      activeColor: "bg-yellow-500",
      inactiveColor: "bg-yellow-100",
      onClick: handleTextTool,
    },
    {
      name: "eraser",
      tooltip: "Eraser",
      icon: <FaEraser />,
      activeColor: "bg-gray-500",
      inactiveColor: "bg-gray-100",
    },
    {
      name: "move",
      tooltip: "Move",
      icon: <FaArrowsAlt />,
      activeColor: "bg-indigo-500",
      inactiveColor: "bg-indigo-100",
    },
  ];

  const actions = [
    {
      tooltip: "Clear All",
      icon: <FaTrash />,
      onClick: handleClear,
      color: "bg-black",
    },
    {
      tooltip: "Save",
      icon: <FaSave />,
      onClick: handleSave,
      color: "bg-teal-500",
    },
    {
      tooltip: "Download",
      icon: <FaDownload />,
      onClick: handleDownload,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="bg-gray-200 px-32 pt-6 pb-10 min-h-screen">
      {/* Tools Panel */}
      <div className="flex justify-center items-center mb-4 space-x-2">
        {/* Tool buttons */}
        {tools.map((toolItem) => (
          <button
            key={toolItem.name}
            data-tooltip-id="my-tooltip"
            data-tooltip-content={toolItem.tooltip}
            data-tooltip-place="bottom"
            onClick={() =>
              toolItem.onClick
                ? toolItem.onClick()
                : handleToolChange(toolItem.name)
            }
            className={`p-2 border rounded ${
              tool === toolItem.name
                ? toolItem.activeColor + " text-white"
                : toolItem.inactiveColor
            }`}
          >
            {toolItem.icon}
          </button>
        ))}

        {/* Action buttons */}
        {actions.map((action, index) => (
          <button
            key={index}
            data-tooltip-id="my-tooltip"
            data-tooltip-content={action.tooltip}
            data-tooltip-place="bottom"
            onClick={action.onClick}
            className={`p-2 border rounded ${action.color} text-white`}
          >
            {action.icon}
          </button>
        ))}

        {/* Color picker button */}
        <div className="relative">
          <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Color"
            data-tooltip-place="bottom"
            className="border rounded"
            onClick={() => document.getElementById("colorInput").click()}
          >
            <IoIosColorPalette className="text-3xl text-red-600" />
          </button>
          <input
            id="colorInput"
            type="color"
            value={color}
            onChange={handleColorChange}
            className="absolute top-full left-0"
            style={{
              opacity: 0,
              width: "24px",
              height: "24px",
              position: "absolute",
            }}
          />
        </div>
      </div>

      {/* Text Area and Text Size Selector */}
      {showTextArea && (
        <div className="flex justify-center gap-4 items-center mb-4">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter your text"
            className="bg-gray-100 p-2 border rounded w-1/2 mb-2 text-black"
          />
          <select
            onChange={(e) => setTextSize(parseInt(e.target.value))}
            className="p-2 border rounded bg-gray-100 text-black"
          >
            <option disabled>Size</option>
            <option value={11}>11</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
            <option value={18}>18</option>
            <option value={24}>24</option>
            <option value={36}>36</option>
          </select>
        </div>
      )}

      {/* Canvas Stage */}
      <div ref={containerRef} className="relative w-full overflow-hidden">
        <Stage
          width={
            containerRef.current
              ? containerRef.current.offsetWidth
              : window.innerWidth
          }
          height={window.innerHeight * 0.8}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={stageRef}
          className="bg-white border rounded-lg"
        >
          <Layer>
            {elements.map((element) => {
              if (element.type === "line") {
                return (
                  <Line
                    key={element.id}
                    points={element.points}
                    stroke={element.color}
                    strokeWidth={element.strokeWidth}
                    draggable={tool === "move"}
                    onClick={() => handleEraserClick(element.id)}
                  />
                );
              } else if (element.type === "rectangle") {
                return (
                  <Rect
                    key={element.id}
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    stroke={element.color}
                    draggable={tool === "move"}
                    onClick={() => handleEraserClick(element.id)}
                  />
                );
              } else if (element.type === "circle") {
                return (
                  <Circle
                    key={element.id}
                    x={element.x}
                    y={element.y}
                    radius={element.radius}
                    stroke={element.color}
                    draggable={tool === "move"}
                    onClick={() => handleEraserClick(element.id)}
                  />
                );
              } else if (element.type === "text") {
                return (
                  <Text
                    key={element.id}
                    x={element.x}
                    y={element.y}
                    text={element.text}
                    fontSize={element.size}
                    fill={element.color}
                    draggable={tool === "move"}
                    onDblClick={() => {
                      const newText = prompt("Edit text:", element.text);
                      if (newText !== null) {
                        handleTextChange(element.id, newText);
                      }
                    }}
                    onClick={() => {
                      handleEraserClick(element.id);
                    }}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      </div>
      <Tooltip id="my-tooltip" />
      <dialog id="saveDrawing" className="modal">
        <div className="modal-box w-full max-w-lg bg-gray-200">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleCloseModal}
          >
            ✕
          </button>
          <div className="bg-white text-black p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Save Your Drawing</h2>
            <input
              type="text"
              value={drawingName}
              onChange={(e) => setDrawingName(e.target.value)}
              placeholder="Enter Drawing Name"
              className="p-2 border rounded w-full mb-2 bg-gray-100"
            />
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Enter Artist Name"
              className="p-2 border rounded w-full mb-4 bg-gray-100"
            />
            <div className="flex justify-center">
              <button
                onClick={handleCloseModal}
                className="mr-2 bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveToGallery}
                className="bg-teal-500 px-4 py-2 text-white rounded"
              >
                Save to Gallery
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default WhiteBoardComponent;
