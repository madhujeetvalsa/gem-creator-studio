import { useItemInteraction } from "@/hooks/useItemInteraction";
import type { CanvasItem as CanvasItemType } from "@/types/jewelry";

interface CanvasItemProps {
  item: CanvasItemType;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (uid: string, x: number, y: number) => void;
  onSizeChange: (uid: string, width: number, height: number) => void;
  onRotationChange: (uid: string, rotation: number) => void;
  onRemove: (uid: string) => void;
}

export function CanvasItem({
  item,
  isSelected,
  onSelect,
  onPositionChange,
  onSizeChange,
  onRotationChange,
  onRemove,
}: CanvasItemProps) {
  const { isResizing, handleDragStart, handleResizeStart, handleRotateStart } =
    useItemInteraction({ item, onSelect, onPositionChange, onSizeChange, onRotationChange });

  const handleVis = isSelected
    ? "opacity-100"
    : "opacity-0 group-hover:opacity-100";

  return (
    <div
      onPointerDown={handleDragStart}
      className={`group absolute ${isResizing ? "cursor-nwse-resize" : "cursor-grab active:cursor-grabbing"}`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation}deg)`,
        transformOrigin: "center center",
        touchAction: "none",
        outline: isSelected ? "2px solid rgba(214,74,134,0.6)" : "none",
        outlineOffset: 2,
        borderRadius: 6,
      }}
    >
      <div className="relative w-full h-full">
        <img
          src={item.src}
          alt={item.name}
          className="h-full w-full object-contain drop-shadow-lg"
          draggable={false}
        />

        {/* Remove — top-right */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onRemove(item.uid); }}
          className={`absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md transition-opacity ${handleVis}`}
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Rotate — top-center */}
        <div
          onPointerDown={handleRotateStart}
          className={`absolute -top-7 left-1/2 -translate-x-1/2 flex h-6 w-6 cursor-crosshair items-center justify-center rounded-full bg-primary shadow-md transition-opacity ${handleVis}`}
          style={{ touchAction: "none" }}
        >
          <svg className="h-3.5 w-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>

        {/* Resize — bottom-right */}
        <div
          onPointerDown={handleResizeStart}
          className={`absolute -bottom-2 -right-2 h-5 w-5 cursor-nwse-resize rounded-sm bg-primary shadow-md transition-opacity ${handleVis}`}
          style={{ touchAction: "none" }}
        />
      </div>
    </div>
  );
}
