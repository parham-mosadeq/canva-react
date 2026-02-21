import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import addRect from "./shapes/Rectangle";
import addCircle from "./shapes/Circle";
import addTriangle from "./shapes/Triangle";
import Sidebar from "./components/Sidebar";

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null,
  );

  const [fillColor, setFillColor] = useState("#ff0000");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [borderStyle, setBorderStyle] = useState("solid");

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

    // compute strokeDashArray from borderStyle
    let strokeDashArray: number[] | undefined = undefined;
    if (borderStyle === "dashed") strokeDashArray = [10, 6];
    else if (borderStyle === "dotted") strokeDashArray = [2, 4];
    else if (borderStyle === "none") strokeDashArray = [];

    selectedObject.set({
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: Number(strokeWidth),
      strokeDashArray: strokeDashArray,
    });

    if (selectedObject.type !== "circle") {
      selectedObject.set({
        scaleX: Number(width) / (selectedObject.width || 100),
        scaleY: Number(height) / (selectedObject.height || 100),
      });
    } else {
      const diameter = Number(width);
      (selectedObject as fabric.Circle).set({ radius: diameter / 2 });
    }

    selectedObject.setCoords();
    fabricCanvasRef.current.requestRenderAll();
  };

  return (
    <div className="flex gap-6 p-6">
      <Sidebar
        onAddRect={() => addRect(fabricCanvasRef.current)}
        onAddCircle={() => addCircle(fabricCanvasRef.current)}
        onAddTriangle={() => addTriangle(fabricCanvasRef.current)}
        selected={!!selectedObject}
        fillColor={fillColor}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        widthVal={width}
        heightVal={height}
        borderStyle={borderStyle}
        setBorderStyle={setBorderStyle}
        setFillColor={setFillColor}
        setStrokeColor={setStrokeColor}
        setStrokeWidth={setStrokeWidth}
        setWidthVal={setWidth}
        setHeightVal={setHeight}
        onApply={applyChanges}
      />

      <div className="min-w-[500px] flex-1">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
