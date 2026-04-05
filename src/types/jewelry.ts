export interface JewelryItem {
    id: string;
    name: string;
    src: string;
}

export interface CanvasItem extends JewelryItem {
    uid: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    locked: boolean;
}
