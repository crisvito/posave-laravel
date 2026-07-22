import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui';
import type { ReactNode } from 'react';

interface CashierSidePanelProps {
    children: ReactNode;
    sheetOpen: boolean;
    onSheetOpenChange: (open: boolean) => void;
    width?: string;
    background?: string;
}

export function CashierSidePanel({
    children,
    sheetOpen,
    onSheetOpenChange,
    width = 'w-[340px]',
    background = 'bg-[var(--sidebar)]',
}: CashierSidePanelProps) {
    return (
        <>
            <div className={`hidden ${width} flex-col border-l border-white/10 ${background} text-white lg:flex`}>{children}</div>

            <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
                <SheetContent side="right" className={`flex w-[85vw] flex-col border-l-0 ${background} p-0 text-white sm:max-w-[400px]`}>
                    <SheetTitle className="sr-only">Order details</SheetTitle>
                    <SheetDescription className="sr-only">Order and payment information</SheetDescription>
                    <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
                </SheetContent>
            </Sheet>
        </>
    );
}
