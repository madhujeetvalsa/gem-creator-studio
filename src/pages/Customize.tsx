import { useState, useCallback } from "react";
import { useCanvasItems } from "@/hooks/useCanvasItems";
import { JEWELRY_ITEMS } from "@/data/jewelryItems";
import { StudioHeader } from "@/components/studio/StudioHeader";
import { GalleryPanel } from "@/components/studio/GalleryPanel";
import { GalleryBottomSheet } from "@/components/studio/GalleryBottomSheet";
import { DesignCanvas } from "@/components/studio/DesignCanvas";
import { PreviewDialog } from "@/components/studio/PreviewDialog";
import type { JewelryItem } from "@/types/jewelry";

const Customize = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const {
    items,
    selectedUid,
    setSelectedUid,
    canvasRef,
    addFromDrop,
    addFromTap,
    updatePosition,
    updateSize,
    updateRotation,
    removeItem,
    clearAll,
    toggleLock,
  } = useCanvasItems();

  const handleDragFromGallery = useCallback(
    (e: React.DragEvent, item: JewelryItem) => {
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
      if (e.dataTransfer.getData("source") !== "gallery") return;
      const item: JewelryItem = {
        id: e.dataTransfer.getData("jewelry-id"),
        name: e.dataTransfer.getData("jewelry-name"),
        src: e.dataTransfer.getData("jewelry-src"),
      };
      addFromDrop(e, item);
    },
    [addFromDrop]
  );

  const handleTapAdd = useCallback(
    (item: JewelryItem) => {
      addFromTap(item);
      setGalleryOpen(false);
    },
    [addFromTap]
  );

  return (
    <div className="flex h-[100dvh] flex-col bg-background overflow-hidden">
      <StudioHeader
        itemCount={items.length}
        onClear={clearAll}
        onSubmit={() => setPreviewOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <GalleryPanel items={JEWELRY_ITEMS} onDragStart={handleDragFromGallery} />

        <main className="flex flex-1 flex-col overflow-hidden p-2 sm:p-4 md:p-6">
          {/* Desktop canvas label */}
          <div className="hidden md:flex mb-3 items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                Design Canvas
              </h2>
              <p className="font-body text-xs text-muted-foreground">
                {items.length} piece{items.length !== 1 ? "s" : ""} placed
              </p>
            </div>
          </div>

          <DesignCanvas
            canvasRef={canvasRef}
            items={items}
            selectedUid={selectedUid}
            itemCount={items.length}
            onDrop={handleCanvasDrop}
            onDeselect={() => setSelectedUid(null)}
            onSelect={setSelectedUid}
            onPositionChange={updatePosition}
            onSizeChange={updateSize}
            onRotationChange={updateRotation}
            onRemove={removeItem}
            onToggleLock={toggleLock}
          />

          {/* Mobile bottom bar */}
          <div className="md:hidden flex items-center justify-between mt-2 px-1">
            <p className="font-body text-xs text-muted-foreground">
              {items.length} piece{items.length !== 1 ? "s" : ""} placed
            </p>
            <button
              onClick={() => setGalleryOpen(true)}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 font-body text-sm font-semibold text-primary-foreground shadow-lg"
              style={{ background: "linear-gradient(135deg, #D6A07A, #D64A86, #C73A78)" }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Piece
            </button>
          </div>
        </main>
      </div>

      <GalleryBottomSheet
        open={galleryOpen}
        items={JEWELRY_ITEMS}
        onClose={() => setGalleryOpen(false)}
        onSelect={handleTapAdd}
      />

      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        items={items}
      />
    </div>
  );
};

export default Customize;
