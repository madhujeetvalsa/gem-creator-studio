import { useState, useCallback } from "react";
import type { CanvasItem } from "@/types/jewelry";

interface UseItemInteractionProps {
    item: CanvasItem;
    onSelect: () => void;
    onPositionChange: (uid: string, x: number, y: number) => void;
    onSizeChange: (uid: string, width: number, height: number) => void;
    onRotationChange: (uid: string, rotation: number) => void;
}

export function useItemInteraction({
    item,
    onSelect,
    onPositionChange,
    onSizeChange,
    onRotationChange,
}: UseItemInteractionProps) {
    const [isResizing, setIsResizing] = useState(false);

    const handleDragStart = useCallback(
        (e: React.PointerEvent) => {
            if (isResizing || item.locked) return;
            e.stopPropagation();
            e.preventDefault();
            onSelect();
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            const startX = e.clientX - item.x;
            const startY = e.clientY - item.y;
            const onMove = (ev: PointerEvent) =>
                onPositionChange(item.uid, ev.clientX - startX, ev.clientY - startY);
            const onUp = () => {
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", onUp);
            };
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
        },
        [isResizing, item.uid, item.x, item.y, onPositionChange, onSelect]
    );

    const handleResizeStart = useCallback(
        (e: React.PointerEvent) => {
            if (item.locked) return;
            e.stopPropagation();
            e.preventDefault();
            setIsResizing(true);
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            const startX = e.clientX;
            const startY = e.clientY;
            const startW = item.width;
            const startH = item.height;
            const onMove = (ev: PointerEvent) =>
                onSizeChange(
                    item.uid,
                    Math.max(40, startW + ev.clientX - startX),
                    Math.max(40, startH + ev.clientY - startY)
                );
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

    const handleRotateStart = useCallback(
        (e: React.PointerEvent) => {
            if (item.locked) return;
            e.stopPropagation();
            e.preventDefault();
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            const cx = item.x + item.width / 2;
            const cy = item.y + item.height / 2;
            const onMove = (ev: PointerEvent) => {
                const angle =
                    Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI) + 90;
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

    return { isResizing, handleDragStart, handleResizeStart, handleRotateStart };
}
