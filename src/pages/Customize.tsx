import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Dynamically import all images from the jewelry folder.
// Any new image added to src/assets/jewelry/ will appear automatically.
const jewelryModules = import.meta.glob<{ default: string }>(
  "../assets/jewelry/*.{png,jpg,jpeg,webp,svg}",
  { eager: true }
);

const JEWELRY_ITEMS = Object.entries(jewelryModules).map(([path, mod]) => {
  const filename = path.split("/").pop()!.replace(/\.[^.]+$/, ""); // e.g. "charm-1"
  const name = filename
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()); // e.g. "Charm 1"
  return { id: filename, name, src: mod.default };
});

interface CanvasItem {
  uid: string;
  id: string;
  name: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

const Customize = () => {
  const navigate = useNavigate();
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragFromGallery = useCallback(
    (e: React.DragEvent, item: (typeof JEWELRY_ITEMS)[number]) => {
      e.dataTransfer.setData("jewelry-id", item.id);
      e.dataTransfer.setData("jewelry-name", item.name);
      e.dataTransfer.setData("jewelry-src", item.src);
      e.dataTransfer.setData("source", "gallery");
    },
    []
  );

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const source = e.dataTransfer.getData("source");
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const x = e.clientX - canvasRect.left - 40;
      const y = e.clientY - canvasRect.top - 40;

      if (source === "gallery") {
        const newItem: CanvasItem = {
          uid: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          id: e.dataTransfer.getData("jewelry-id"),
          name: e.dataTransfer.getData("jewelry-name"),
          src: e.dataTransfer.getData("jewelry-src"),
          x: Math.max(0, x),
          y: Math.max(0, y),
          width: 80,
          height: 80,
          rotation: 0,
        };
        setCanvasItems((prev) => [...prev, newItem]);
      }
    },
    []
  );

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const updateItemPosition = useCallback((uid: string, x: number, y: number) => {
    setCanvasItems((prev) =>
      prev.map((item) => (item.uid === uid ? { ...item, x, y } : item))
    );
  }, []);

  const updateItemSize = useCallback((uid: string, width: number, height: number) => {
    setCanvasItems((prev) =>
      prev.map((item) => (item.uid === uid ? { ...item, width, height } : item))
    );
  }, []);

  const updateItemRotation = useCallback((uid: string, rotation: number) => {
    setCanvasItems((prev) =>
      prev.map((item) => (item.uid === uid ? { ...item, rotation } : item))
    );
  }, []);

  const removeItem = useCallback((uid: string) => {
    setCanvasItems((prev) => prev.filter((item) => item.uid !== uid));
  }, []);

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-body text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Jewelry Studio
        </h1>
        <div className="w-16" />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Gallery */}
        <aside className="w-72 flex-shrink-0 overflow-y-auto border-r border-border bg-card p-4">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Jewelry Pieces
          </h2>
          <p className="mb-4 font-body text-xs text-muted-foreground">
            Drag pieces to the canvas to create your design
          </p>
          <div className="grid grid-cols-2 gap-3">
            {JEWELRY_ITEMS.map((item) => (
              <motion.div
                key={item.id}
                draggable
                onDragStart={(e) =>
                  handleDragFromGallery(e as unknown as React.DragEvent, item)
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group cursor-grab rounded-lg border border-border bg-popover p-2 transition-shadow hover:shadow-lg active:cursor-grabbing"
              >
                <div className="relative aspect-square overflow-hidden rounded-md">
                  <img
                    src={item.src}
                    alt={item.name}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="mt-1.5 text-center font-body text-xs font-medium text-foreground">
                  {item.name}
                </p>
              </motion.div>
            ))}
          </div>
        </aside>

        {/* Right Panel - Canvas */}
        <main className="flex flex-1 flex-col p-6 overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Design Canvas
              </h2>
              <p className="font-body text-xs text-muted-foreground">
                {canvasItems.length} piece{canvasItems.length !== 1 ? "s" : ""} placed
              </p>
            </div>
            <div className="flex gap-3">
              {canvasItems.length > 0 && (
                <button
                  onClick={() => setCanvasItems([])}
                  className="rounded-lg border border-border px-4 py-2 font-body text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setPreviewOpen(true)}
                disabled={canvasItems.length === 0}
                className="rounded-full px-6 py-2 font-body text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                style={{
                  background:
                    canvasItems.length > 0
                      ? "linear-gradient(135deg, #D6A07A, #D64A86, #C73A78)"
                      : "hsl(var(--muted))",
                }}
              >
                Submit Design
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div
            ref={canvasRef}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
            className="relative flex-1 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-popover transition-colors"
            style={{ minHeight: 400 }}
          >
            {canvasItems.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <svg className="mb-3 h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <p className="font-body text-sm">Drop jewelry pieces here</p>
              </div>
            )}

            {canvasItems.map((item) => (
              <DraggableCanvasItem
                key={item.uid}
                item={item}
                canvasRef={canvasRef}
                onPositionChange={updateItemPosition}
                onSizeChange={updateItemSize}
                onRotationChange={updateItemRotation}
                onRemove={removeItem}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-foreground">
              Your Custom Design
            </DialogTitle>
            <DialogDescription className="font-body text-muted-foreground">
              Here's a preview of your customized jewelry arrangement
            </DialogDescription>
          </DialogHeader>
          <PreviewCanvas canvasItems={canvasItems} />
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => setPreviewOpen(false)}
              className="rounded-lg border border-border px-5 py-2 font-body text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              Continue Editing
            </button>
            <button
              onClick={() => {
                setPreviewOpen(false);
                navigate("/");
              }}
              className="rounded-full px-6 py-2 font-body text-sm font-semibold text-primary-foreground shadow-lg"
              style={{
                background: "linear-gradient(135deg, #D6A07A, #D64A86, #C73A78)",
              }}
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PreviewCanvas = ({
  canvasItems,
}: {
  canvasItems: CanvasItem[];
}) => {
  if (canvasItems.length === 0) return null;

  // Calculate bounding box of all items
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  canvasItems.forEach((item) => {
    minX = Math.min(minX, item.x);
    minY = Math.min(minY, item.y);
    maxX = Math.max(maxX, item.x + item.width);
    maxY = Math.max(maxY, item.y + item.height);
  });

  const contentW = maxX - minX;
  const contentH = maxY - minY;
  const previewW = 580;
  const previewH = 400;
  const padding = 40;
  const availW = previewW - padding * 2;
  const availH = previewH - padding * 2;
  const scale = Math.min(availW / contentW, availH / contentH, 1);
  const offsetX = (previewW - contentW * scale) / 2 - minX * scale;
  const offsetY = (previewH - contentH * scale) / 2 - minY * scale;

  return (
    <div
      className="relative mx-auto mt-4 overflow-hidden rounded-xl bg-popover"
      style={{ width: previewW, height: previewH }}
    >
      {canvasItems.map((item) => (
        <img
          key={item.uid}
          src={item.src}
          alt={item.name}
          className="absolute object-contain"
          style={{
            left: item.x * scale + offsetX,
            top: item.y * scale + offsetY,
            width: item.width * scale,
            height: item.height * scale,
            transform: `rotate(${item.rotation}deg)`,
            transformOrigin: "center center",
          }}
        />
      ))}
    </div>
  );
};

interface DraggableCanvasItemProps {
  item: CanvasItem;
  canvasRef: React.RefObject<HTMLDivElement>;
  onPositionChange: (uid: string, x: number, y: number) => void;
  onSizeChange: (uid: string, width: number, height: number) => void;
  onRotationChange: (uid: string, rotation: number) => void;
  onRemove: (uid: string) => void;
}

const DraggableCanvasItem = ({
  item,
  canvasRef,
  onPositionChange,
  onSizeChange,
  onRotationChange,
  onRemove,
}: DraggableCanvasItemProps) => {
  const [isResizing, setIsResizing] = useState(false);

  // Free-hand drag via pointer events — no constraints
  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (isResizing) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      const startX = e.clientX - item.x;
      const startY = e.clientY - item.y;

      const onMove = (ev: PointerEvent) => {
        onPositionChange(item.uid, ev.clientX - startX, ev.clientY - startY);
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [isResizing, item.uid, item.x, item.y, onPositionChange]
  );

  const handleResizeStart = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setIsResizing(true);
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = item.width;
      const startH = item.height;

      const onMove = (ev: PointerEvent) => {
        onSizeChange(
          item.uid,
          Math.max(30, startW + ev.clientX - startX),
          Math.max(30, startH + ev.clientY - startY)
        );
      };
      const onUp = () => {
        setIsResizing(false);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [item.uid, item.width, item.height, onSizeChange]
  );

  // Rotate handle: drag around item center to spin
  const handleRotateStart = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const cx = item.x + item.width / 2;
      const cy = item.y + item.height / 2;

      const onMove = (ev: PointerEvent) => {
        const angle = Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI) + 90;
        onRotationChange(item.uid, angle);
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [item.uid, item.x, item.y, item.width, item.height, onRotationChange]
  );

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
      }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 rounded-md border border-pink-glow/40 pointer-events-none" />
        <img
          src={item.src}
          alt={item.name}
          className="h-full w-full object-contain drop-shadow-lg"
          draggable={false}
        />
        {/* Remove button */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onRemove(item.uid); }}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Rotate handle — top center */}
        <div
          onPointerDown={handleRotateStart}
          title="Rotate"
          className="absolute -top-6 left-1/2 -translate-x-1/2 flex h-5 w-5 cursor-crosshair items-center justify-center rounded-full bg-primary opacity-0 shadow-md transition-opacity group-hover:opacity-80"
          style={{ touchAction: "none" }}
        >
          <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        {/* Resize handle — bottom right */}
        <div
          onPointerDown={handleResizeStart}
          className="absolute -bottom-1.5 -right-1.5 h-4 w-4 cursor-nwse-resize rounded-sm bg-primary opacity-0 shadow-md transition-opacity group-hover:opacity-80"
          style={{ touchAction: "none" }}
        />
      </div>
    </div>
  );
};

export default Customize;
