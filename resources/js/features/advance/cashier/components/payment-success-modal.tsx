import { Button } from '@/components';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks';
import { CheckCircle2, Printer } from 'lucide-react';

interface PaymentSuccessModalProps {
    invoice: string;
    total: number;
    onPrint: () => void;
    onClose: () => void;
}

export function PaymentSuccessModal({ invoice, total, onPrint, onClose }: PaymentSuccessModalProps) {
    const { t } = useLanguage();

    return (
        <Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="text-center sm:max-w-sm">
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--success-background)]">
                    <CheckCircle2 className="h-7 w-7 text-[var(--success)]" />
                </div>

                <DialogTitle className="text-lg font-bold text-[var(--subheading)]">{t('cashier.order.payment.successTitle')}</DialogTitle>
                <p className="mt-1 text-sm text-[var(--grey-text)]">
                    {t('cashier.order.successPrefix')} <strong className="text-[var(--subheading)]">{invoice}</strong>
                </p>
                <p className="mt-3 text-2xl font-extrabold text-[var(--subheading)]">Rp. {total.toLocaleString('id-ID')}</p>

                <div className="mt-6 flex flex-col gap-2">
                    <Button onClick={onPrint} className="bg-[var(--surface-header)] text-white hover:bg-[var(--surface-header-hover)]">
                        <Printer className="mr-2 h-4 w-4" />
                        {t('cashier.order.payment.printReceiptButton')}
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        {t('cashier.order.payment.newOrderButton')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
