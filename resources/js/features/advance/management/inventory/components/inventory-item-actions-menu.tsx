import { Eye, Pencil, Trash2 } from 'lucide-react';

interface InventoryCategory {
    id: number;
    name: string;
    color: string | null;
    items_count: number;
}

export interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    category_id: number;
    category: InventoryCategory;
    image: string | null;
    min_stock: number;
    current_stock: number;
    price: number;
}

interface InventoryItemActionsMenuProps {
    item: InventoryItem;
    position: { top: number; left: number };
    onClose: () => void;
    onView: (item: InventoryItem) => void;
    onEdit: (item: InventoryItem) => void;
    onDelete: (id: number) => void;
}

export function InventoryItemActionsMenu({ item, position, onClose, onView, onEdit, onDelete }: InventoryItemActionsMenuProps) {
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="fixed z-50 w-36 overflow-hidden rounded-xl shadow-lg" style={{ top: position.top, left: position.left }}>
                <button
                    onClick={() => onView(item)}
                    className="flex w-full items-center gap-2 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-600 hover:bg-sky-100"
                >
                    <Eye className="h-4 w-4" />
                    Lihat
                </button>
                <button
                    onClick={() => onEdit(item)}
                    className="flex w-full items-center gap-2 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-500 hover:bg-orange-100"
                >
                    <Pencil className="h-4 w-4" />
                    Ubah
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="flex w-full items-center gap-2 bg-red-50 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-100"
                >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                </button>
            </div>
        </>
    );
}
