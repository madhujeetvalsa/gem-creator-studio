import { motion, AnimatePresence } from "framer-motion";
import type { JewelryItem } from "@/types/jewelry";

interface GalleryBottomSheetProps {
  open: boolean;
  items: JewelryItem[];
  onClose: () => void;
  onSelect: (item: JewelryItem) => void;
}

export function GalleryBottomSheet({
  open,
  items,
  onClose,
  onSelect,
}: GalleryBottomSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-card border-t border-border md:hidden"
            style={{ maxHeight: "60dvh" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-display text-base font-semibold">
                Jewelry Pieces
              </h3>
              <button onClick={onClose} className="text-muted-foreground">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div
              className="overflow-y-auto p-3"
              style={{ maxHeight: "calc(60dvh - 56px)" }}
            >
              <div className="grid grid-cols-3 gap-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="rounded-lg border border-border bg-popover p-2 active:scale-95 transition-transform"
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
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
