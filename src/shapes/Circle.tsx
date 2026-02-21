import * as fabric from "fabric";

export const addCircle = (canvas: fabric.Canvas | null) => {
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

export default addCircle;
