import { motion } from "framer-motion";
import type { JewelryItem } from "@/types/jewelry";

interface GalleryPanelProps {
  items: JewelryItem[];
  onDragStart: (e: React.DragEvent, item: JewelryItem) => void;
}

export function GalleryPanel({ items, onDragStart }: GalleryPanelProps) {
  return (
    <aside className="hidden md:flex w-64 lg:w-72 flex-shrink-0 flex-col overflow-y-auto border-r border-border bg-card p-4">
      <h2 className="mb-1 font-display text-base font-semibold text-foreground">
        Jewelry Pieces
      </h2>
      <p className="mb-4 font-body text-xs text-muted-foreground">
        Drag pieces onto the canvas
      </p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <motion.div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, item)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="cursor-grab rounded-lg border border-border bg-popover p-2 transition-shadow hover:shadow-md active:cursor-grabbing"
          >
            <div className="aspect-square overflow-hidden rounded-md">
              <img
                src={item.src}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </div>
            <p className="mt-1 text-center font-body text-xs font-medium text-foreground truncate">
              {item.name}
            </p>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
