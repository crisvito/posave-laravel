import { Button } from '@/components/ui';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    message: string;
    variant?: 'danger' | 'default';
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({ message, variant = 'danger', onConfirm, onCancel }: ConfirmDialogProps) {
    return (
        <Dialog open onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <div className="mb-2 flex items-center gap-3">
                        <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                            style={{
                                backgroundColor: variant === 'danger' ? 'var(--danger-background)' : 'var(--second-accent)',
                                color: variant === 'danger' ? 'var(--danger)' : 'var(--subheading)',
                            }}
                        >
                            <AlertTriangle className="h-5 w-5" />
                        </span>
                        <DialogTitle>Konfirmasi</DialogTitle>
                    </div>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-2 flex gap-2 sm:justify-end">
                    <Button variant="outline" onClick={onCancel}>
                        Batal
                    </Button>
                    <Button onClick={onConfirm} className={variant === 'danger' ? 'bg-[var(--danger)] text-white hover:opacity-90' : ''}>
                        Ya, Lanjutkan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
