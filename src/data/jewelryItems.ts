import type { JewelryItem } from "@/types/jewelry";

const modules = import.meta.glob<{ default: string }>(
    "../assets/jewelry/*.{png,jpg,jpeg,webp,svg}",
    { eager: true }
);

export const JEWELRY_ITEMS: JewelryItem[] = Object.entries(modules).map(
    ([path, mod]) => {
        const filename = path.split("/").pop()!.replace(/\.[^.]+$/, "");
        const name = filename
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
        return { id: filename, name, src: mod.default };
    }
);
