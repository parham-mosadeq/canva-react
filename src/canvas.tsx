import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );

  const [fillColor, setFillColor] = useState("#ff0000");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#f8f9fa",
      selection: true,
    });

    fabricCanvasRef.current = canvas;

    canvas.on("selection:created", (e) => updateFromSelection(e.selected?.[0]));
    canvas.on("selection:updated", (e) => updateFromSelection(e.selected?.[0]));
    canvas.on("selection:cleared", () => setSelectedObject(null));

    canvas.on("object:modified", (e) => {
      if (e.target) updateFromSelection(e.target);
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  const updateFromSelection = (obj: fabric.Object | undefined) => {
    if (!obj) {
      setSelectedObject(null);
      return;
    }
    setSelectedObject(obj);
    setFillColor((obj.fill as string) || "#ffffff");
    setStrokeColor((obj.stroke as string) || "#000000");
    setStrokeWidth(obj.strokeWidth || 1);

    if ("width" in obj) setWidth(Math.round(obj.width! * (obj.scaleX || 1)));
    if ("height" in obj) setHeight(Math.round(obj.height! * (obj.scaleY || 1)));

    if (obj.type === "circle") {
      setWidth(Math.round((obj as fabric.Circle).getRadiusX() * 2));
      setHeight(Math.round((obj as fabric.Circle).getRadiusY() * 2));
    }
  };

  const applyChanges = () => {
    if (!selectedObject || !fabricCanvasRef.current) return;

    selectedObject.set({
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: Number(strokeWidth),
    });

    if ("set" in selectedObject) {
      if (selectedObject.type !== "circle") {
        selectedObject.set({
          scaleX: Number(width) / (selectedObject.width || 100),
          scaleY: Number(height) / (selectedObject.height || 100),
        });
      } else {
        const diameter = Number(width);
        (selectedObject as fabric.Circle).set({
          radius: diameter / 2,
        });
      }
    }

    selectedObject.setCoords();
    fabricCanvasRef.current.requestRenderAll();
  };

  const addRect = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 150,
      height: 100,
      fill: "#4caf50",
      stroke: "#000",
      strokeWidth: 3,
      selectable: true,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.requestRenderAll();
  };

  const addCircle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const circle = new fabric.Circle({
      left: 200,
      top: 150,
      radius: 60,
      fill: "#2196f3",
      stroke: "#000",
      strokeWidth: 4,
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.requestRenderAll();
  };

  return (
    <div style={{ display: "flex", gap: "1.5rem", padding: "1rem" }}>
      {/* Left: Controls */}
      <div
        style={{
          width: "280px",
          borderRight: "1px solid #ddd",
          paddingRight: "1rem",
        }}>
        <h2>Controls</h2>

        <button onClick={addRect}>Add Rectangle</button>
        <button onClick={addCircle} style={{ marginLeft: "0.5rem" }}>
          Add Circle
        </button>

        {selectedObject && (
          <div style={{ marginTop: "1.5rem" }}>
            <h3>Edit Selected Shape</h3>
            <label>Fill Color:</label>
            <br />
            <input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
            />
            <br />
            <br />
            <label>Border Color:</label>
            <br />
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
            />
            <br />
            <br />
            <label>Border Thickness:</label>
            <br />
            <input
              type="range"
              min="0"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
            />{" "}
            {strokeWidth}px
            <br />
            <br />
            <label>Width:</label>
            <br />
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
            <br />
            <br />
            <label>Height:</label>
            <br />
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
            <br />
            <br />
            <button
              onClick={applyChanges}
              style={{ background: "#0070f3", color: "white" }}>
              Apply Changes
            </button>
          </div>
        )}
      </div>

      {/* Right: Canvas */}
      <div>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
