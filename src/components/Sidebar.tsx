import { SidebarProps } from "../interfaces/sidebar.interface";

export default function Sidebar({
  onAddRect,
  onAddCircle,
  onAddTriangle,
  selected,
  fillColor,
  strokeColor,
  strokeWidth,
  widthVal,
  heightVal,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
  setWidthVal,
  setHeightVal,
  borderStyle,
  setBorderStyle,
  onApply,
}: SidebarProps) {
  return (
    <aside className="w-72 p-6 bg-gradient-to-b from-white/60 via-slate-50 to-white/40 shadow-xl rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Shapes</h2>
        <span className="text-sm text-slate-500">Quick add</span>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={onAddRect}
          className="flex-1 py-2 px-3 bg-slate-900 text-white rounded-md hover:opacity-90 transition">
          Rectangle
        </button>
        <button
          onClick={onAddCircle}
          className="py-2 px-3 bg-indigo-600 text-white rounded-md hover:opacity-90 transition">
          Circle
        </button>
        <button
          onClick={onAddTriangle}
          className="py-2 px-3 bg-amber-500 text-white rounded-md hover:opacity-90 transition">
          Triangle
        </button>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Properties</h3>

        <label className="block text-xs text-slate-600">Fill</label>
        <input
          type="color"
          value={fillColor}
          onChange={(e) => setFillColor(e.target.value)}
          className="w-full h-10 rounded-md border p-1 mb-3"
        />

        <label className="block text-xs text-slate-600">Stroke</label>
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
          className="w-full h-10 rounded-md border p-1 mb-3"
        />

        <label className="block text-xs text-slate-600">Stroke Width</label>
        <input
          type="range"
          min={0}
          max={20}
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="w-full mb-3"
        />
        <div className="flex gap-2 items-center mb-3">
          <input
            type="number"
            value={widthVal}
            onChange={(e) => setWidthVal(Number(e.target.value))}
            className="w-1/2 rounded-md border p-2"
          />
          <input
            type="number"
            value={heightVal}
            onChange={(e) => setHeightVal(Number(e.target.value))}
            className="w-1/2 rounded-md border p-2"
          />
        </div>

        <button
          onClick={onApply}
          disabled={!selected}
          className={`w-full py-2 rounded-md text-white transition ${
            selected
              ? "bg-sky-600 hover:bg-sky-700"
              : "bg-slate-300 text-slate-600"
          }`}>
          Apply to selected
        </button>

        <label className="block text-xs text-slate-600 mt-4">
          Border Style
        </label>
        <select
          value={borderStyle}
          onChange={(e) => setBorderStyle(e.target.value)}
          className="w-full rounded-md border p-2 mt-2">
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
          <option value="none">None</option>
        </select>
      </div>

      <div className="mt-6 text-xs text-slate-500">
        Tip: Select a shape on the canvas to edit its properties.
      </div>
    </aside>
  );
}
