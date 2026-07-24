import { Button } from '@/components';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { CartItem } from '@/features/advance/cashier/order/type';
import { useLanguage } from '@/hooks';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface PaymentConfirmModalProps {
    cart: CartItem[];
    paymentMethod: 'cash' | 'qris';
    total: number;
    customerMoney: number;
    change: number;
    onClose: () => void;
    onSuccess: (data: { invoice: string; total: number; date: Date }) => void;
}

export function PaymentConfirmModal({ cart, paymentMethod, total, customerMoney, change, onClose, onSuccess }: PaymentConfirmModalProps) {
    const { t } = useLanguage();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        setProcessing(true);
        setError(null);
        try {
            const res = await axios.post(route('cashier.order.store'), {
                items: cart.map((c) => ({ item_id: c.itemId, qty: c.qty, note: c.note || null })),
                payment_method: paymentMethod,
            });

            onSuccess({ invoice: res.data.invoice_no, total: res.data.total, date: new Date() });
        } catch (err: any) {
            setError(err?.response?.data?.message ?? t('cashier.order.paymentFailedError'));
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog open onOpenChange={(isOpen) => !isOpen && !processing && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{t('cashier.order.payment.confirmModalTitle')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-2 rounded-xl bg-[var(--second-accent)] p-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-[var(--grey-text)]">{t('cashier.order.payment.methodsLabel')}</span>
                        <span className="font-semibold text-[var(--subheading)]">
                            {paymentMethod === 'cash' ? t('cashier.order.payment.cash') : t('cashier.order.payment.qris')}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--grey-text)]">{t('cashier.order.payment.totalBill')}</span>
                        <span className="font-semibold text-[var(--subheading)]">Rp. {total.toLocaleString('id-ID')}</span>
                    </div>
                    {paymentMethod === 'cash' && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-[var(--grey-text)]">{t('cashier.order.payment.customerAmountLabel')}</span>
                                <span className="font-semibold text-[var(--subheading)]">Rp. {customerMoney.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--grey-text)]">{t('cashier.order.payment.change')}</span>
                                <span className="font-semibold text-[var(--subheading)]">Rp. {change.toLocaleString('id-ID')}</span>
                            </div>
                        </>
                    )}
                </div>

                {error && (
                    <div className="flex items-start gap-2 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-background)] px-3 py-2 text-xs text-[var(--danger)]">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <DialogFooter className="mt-2 flex gap-2 sm:justify-end">
                    <Button variant="outline" onClick={onClose} disabled={processing}>
                        {t('cashier.order.payment.confirmModalCancel')}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={processing}
                        className="bg-[var(--surface-header)] text-white hover:bg-[var(--surface-header-hover)]"
                    >
                        {processing ? t('cashier.order.payment.processingButton') : t('cashier.order.payment.confirmModalSubmit')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
