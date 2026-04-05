import { useState, useCallback, useRef } from "react";
import type { CanvasItem, JewelryItem } from "@/types/jewelry";

function makeItem(
    item: JewelryItem,
    x: number,
    y: number
): CanvasItem {
    return {
        uid: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        ...item,
        x,
        y,
        width: 80,
        height: 80,
        rotation: 0,
        locked: false,
    };
}

export function useCanvasItems() {
    const [items, setItems] = useState<CanvasItem[]>([]);
    const [selectedUid, setSelectedUid] = useState<string | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    const addFromDrop = useCallback(
        (e: React.DragEvent, item: JewelryItem) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            const newItem = makeItem(
                item,
                Math.max(0, e.clientX - rect.left - 40),
                Math.max(0, e.clientY - rect.top - 40)
            );
            setItems((prev) => [...prev, newItem]);
            setSelectedUid(newItem.uid);
        },
        []
    );

    const addFromTap = useCallback((item: JewelryItem) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        const newItem = makeItem(
            item,
            rect ? rect.width / 2 - 40 : 100,
            rect ? rect.height / 2 - 40 : 100
        );
        setItems((prev) => [...prev, newItem]);
        setSelectedUid(newItem.uid);
    }, []);

    const updatePosition = useCallback((uid: string, x: number, y: number) => {
        setItems((prev) =>
            prev.map((it) => (it.uid === uid ? { ...it, x, y } : it))
        );
    }, []);

    const updateSize = useCallback(
        (uid: string, width: number, height: number) => {
            setItems((prev) =>
                prev.map((it) => (it.uid === uid ? { ...it, width, height } : it))
            );
        },
        []
    );

    const updateRotation = useCallback((uid: string, rotation: number) => {
        setItems((prev) =>
            prev.map((it) => (it.uid === uid ? { ...it, rotation } : it))
        );
    }, []);

    const removeItem = useCallback((uid: string) => {
        setItems((prev) => prev.filter((it) => it.uid !== uid));
        setSelectedUid(null);
    }, []);

    const clearAll = useCallback(() => {
        setItems([]);
        setSelectedUid(null);
    }, []);

    const toggleLock = useCallback((uid: string) => {
        setItems((prev) =>
            prev.map((it) => (it.uid === uid ? { ...it, locked: !it.locked } : it))
        );
    }, []);

    return {
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
    };
}
