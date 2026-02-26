import * as fabric from "fabric";

export const addRect = (canvas: fabric.Canvas | null) => {
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

export default addRect;
