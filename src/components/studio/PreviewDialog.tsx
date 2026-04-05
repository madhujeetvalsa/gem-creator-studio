import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { CanvasItem } from "@/types/jewelry";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CanvasItem[];
}

function PreviewCanvas({ items }: { items: CanvasItem[] }) {
  if (items.length === 0) return null;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  items.forEach((item) => {
    minX = Math.min(minX, item.x);
    minY = Math.min(minY, item.y);
    maxX = Math.max(maxX, item.x + item.width);
    maxY = Math.max(maxY, item.y + item.height);
  });

  const contentW = maxX - minX || 1;
  const contentH = maxY - minY || 1;
  const previewW = 500;
  const previewH = 320;
  const padding = 32;
  const scale = Math.min(
    (previewW - padding * 2) / contentW,
    (previewH - padding * 2) / contentH,
    1
  );
  const offsetX = (previewW - contentW * scale) / 2 - minX * scale;
  const offsetY = (previewH - contentH * scale) / 2 - minY * scale;

  return (
    <div
      className="relative mx-auto mt-3 overflow-hidden rounded-xl bg-popover w-full"
      style={{ paddingBottom: `${(previewH / previewW) * 100}%` }}
    >
      <div className="absolute inset-0">
        {items.map((item) => (
          <img
            key={item.uid}
            src={item.src}
            alt={item.name}
            className="absolute object-contain"
            style={{
              left: `${((item.x * scale + offsetX) / previewW) * 100}%`,
              top: `${((item.y * scale + offsetY) / previewH) * 100}%`,
              width: `${(item.width * scale / previewW) * 100}%`,
              height: `${(item.height * scale / previewH) * 100}%`,
              transform: `rotate(${item.rotation}deg)`,
              transformOrigin: "center center",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function PreviewDialog({ open, onOpenChange, items }: PreviewDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            Your Custom Design
          </DialogTitle>
          <DialogDescription className="font-body text-muted-foreground">
            Preview of your jewelry arrangement
          </DialogDescription>
        </DialogHeader>

        <PreviewCanvas items={items} />

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-border px-4 py-2 font-body text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Continue Editing
          </button>
          <button
            onClick={() => { onOpenChange(false); navigate("/"); }}
            className="rounded-full px-5 py-2 font-body text-sm font-semibold text-primary-foreground shadow-lg"
            style={{ background: "linear-gradient(135deg, #D6A07A, #D64A86, #C73A78)" }}
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
