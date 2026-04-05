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
  onToggleLock: (uid: string) => void;
}

export function CanvasItem({
  item,
  isSelected,
  onSelect,
  onPositionChange,
  onSizeChange,
  onRotationChange,
  onRemove,
  onToggleLock,
}: CanvasItemProps) {
  const { isResizing, handleDragStart, handleResizeStart, handleRotateStart } =
    useItemInteraction({ item, onSelect, onPositionChange, onSizeChange, onRotationChange });

  const handleVis = isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100";

  return (
    <div
      onPointerDown={handleDragStart}
      className={`group absolute ${item.locked ? "cursor-not-allowed" : isResizing ? "cursor-nwse-resize" : "cursor-grab active:cursor-grabbing"}`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation}deg)`,
        transformOrigin: "center center",
        touchAction: "none",
        outline: item.locked
          ? "1.5px solid rgba(234,179,8,0.45)"      // light yellow when locked
          : isSelected
          ? "2px solid rgba(214,74,134,0.6)"         // pink when selected
          : "1.5px solid rgba(180,180,180,0.25)",    // subtle grey always
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

        {/* Remove — top-right (hidden when locked) */}
        {!item.locked && (
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onRemove(item.uid); }}
            className={`absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md transition-opacity ${handleVis}`}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Rotate — top-center (hidden when locked) */}
        {!item.locked && (
          <div
            onPointerDown={handleRotateStart}
            className={`absolute -top-7 left-1/2 -translate-x-1/2 flex h-6 w-6 cursor-crosshair items-center justify-center rounded-full bg-primary shadow-md transition-opacity ${handleVis}`}
            style={{ touchAction: "none" }}
          >
            <svg className="h-3.5 w-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        )}

        {/* Lock toggle — bottom-left, always visible on select/hover */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onToggleLock(item.uid); }}
          title={item.locked ? "Unlock" : "Lock"}
          className={`absolute -bottom-3 -left-3 flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-opacity ${item.locked ? "opacity-100 bg-yellow-400" : `bg-muted ${handleVis}`}`}
        >
          {item.locked ? (
            // locked icon
            <svg className="h-3 w-3 text-yellow-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          ) : (
            // unlocked icon
            <svg className="h-3 w-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          )}
        </button>

        {/* Resize — bottom-right (hidden when locked) */}
        {!item.locked && (
          <div
            onPointerDown={handleResizeStart}
            className={`absolute -bottom-2 -right-2 h-5 w-5 cursor-nwse-resize rounded-sm bg-primary shadow-md transition-opacity ${handleVis}`}
            style={{ touchAction: "none" }}
          />
        )}
      </div>
    </div>
  );
}
