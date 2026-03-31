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

import ringGold from "@/assets/jewelry/ring-gold.png";
import necklaceSilver from "@/assets/jewelry/necklace-silver.png";
import earringsDiamond from "@/assets/jewelry/earrings-diamond.png";
import braceletGold from "@/assets/jewelry/bracelet-gold.png";
import tiaraRosegold from "@/assets/jewelry/tiara-rosegold.png";
import broochPearl from "@/assets/jewelry/brooch-pearl.png";

const JEWELRY_ITEMS = [
  { id: "ring", name: "Gold Ring", src: ringGold },
  { id: "necklace", name: "Silver Necklace", src: necklaceSilver },
  { id: "earrings", name: "Diamond Earrings", src: earringsDiamond },
  { id: "bracelet", name: "Gold Bracelet", src: braceletGold },
  { id: "tiara", name: "Rose Gold Tiara", src: tiaraRosegold },
  { id: "brooch", name: "Pearl Brooch", src: broochPearl },
];

interface CanvasItem {
  uid: string;
  id: string;
  name: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
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

  const removeItem = useCallback((uid: string) => {
    setCanvasItems((prev) => prev.filter((item) => item.uid !== uid));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
        <main className="flex flex-1 flex-col p-6">
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
          <div className="relative mt-4 overflow-hidden rounded-xl bg-popover" style={{ minHeight: 400 }}>
            {canvasItems.map((item) => (
              <img
                key={item.uid}
                src={item.src}
                alt={item.name}
                className="absolute h-20 w-20 object-contain"
                style={{ left: item.x, top: item.y }}
              />
            ))}
          </div>
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

interface DraggableCanvasItemProps {
  item: CanvasItem;
  canvasRef: React.RefObject<HTMLDivElement>;
  onPositionChange: (uid: string, x: number, y: number) => void;
  onRemove: (uid: string) => void;
}

const DraggableCanvasItem = ({
  item,
  canvasRef,
  onPositionChange,
  onRemove,
}: DraggableCanvasItemProps) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={canvasRef}
      dragElastic={0}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, x: item.x, y: item.y }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onDragEnd={(_, info) => {
        onPositionChange(
          item.uid,
          item.x + info.offset.x,
          item.y + info.offset.y
        );
      }}
      className="group absolute cursor-grab active:cursor-grabbing"
      style={{ left: 0, top: 0 }}
    >
      <div className="relative">
        <img
          src={item.src}
          alt={item.name}
          className="h-20 w-20 object-contain drop-shadow-lg"
        />
        <button
          onClick={() => onRemove(item.uid)}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default Customize;
