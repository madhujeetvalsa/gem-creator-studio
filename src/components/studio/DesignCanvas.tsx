import type { RefObject } from "react";
import type { CanvasItem as CanvasItemType } from "@/types/jewelry";
import { CanvasItem } from "./CanvasItem";

interface DesignCanvasProps {
  canvasRef: RefObject<HTMLDivElement>;
  items: CanvasItemType[];
  selectedUid: string | null;
  itemCount: number;
  onDrop: (e: React.DragEvent) => void;
  onDeselect: () => void;
  onSelect: (uid: string) => void;
  onPositionChange: (uid: string, x: number, y: number) => void;
  onSizeChange: (uid: string, width: number, height: number) => void;
  onRotationChange: (uid: string, rotation: number) => void;
  onRemove: (uid: string) => void;
}

export function DesignCanvas({
  canvasRef,
  items,
  selectedUid,
  itemCount,
  onDrop,
  onDeselect,
  onSelect,
  onPositionChange,
  onSizeChange,
  onRotationChange,
  onRemove,
}: DesignCanvasProps) {
  return (
    <div
      ref={canvasRef}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={onDeselect}
      className="relative flex-1 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-popover"
    >
      {itemCount === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
          <svg className="mb-3 h-10 w-10 opacity-25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <p className="font-body text-sm opacity-60 hidden md:block">Drop jewelry pieces here</p>
          <p className="font-body text-sm opacity-60 md:hidden">Tap + to add pieces</p>
        </div>
      )}

      {items.map((item) => (
        <CanvasItem
          key={item.uid}
          item={item}
          isSelected={selectedUid === item.uid}
          onSelect={() => onSelect(item.uid)}
          onPositionChange={onPositionChange}
          onSizeChange={onSizeChange}
          onRotationChange={onRotationChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
