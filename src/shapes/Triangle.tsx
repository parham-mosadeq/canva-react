import * as fabric from "fabric";

export const addTriangle = (canvas: fabric.Canvas | null) => {
  if (!canvas) return;
  const triangle = new fabric.Triangle({
    left: 250,
    top: 120,
    width: 160,
    height: 120,
    fill: "#ff9800",
    stroke: "#000",
    strokeWidth: 3,
    selectable: true,
  });
  canvas.add(triangle);
  canvas.setActiveObject(triangle);
  canvas.requestRenderAll();
};

export default addTriangle;
