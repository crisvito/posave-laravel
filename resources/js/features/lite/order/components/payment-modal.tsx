import { Button, Input } from '@/components/ui';
import { useLanguage } from '@/hooks';
import axios from 'axios';
import { Banknote, QrCode, X } from 'lucide-react';
import { useState } from 'react';

interface CartItem {
    itemId: number;
    qty: number;
}

interface PaymentModalProps {
    cart: CartItem[];
    subtotal: number;
    onClose: () => void;
    onSuccess: (invoice: string, total: number) => void;
}

const QUICK_AMOUNTS = [20000, 50000, 100000, 150000];

export function PaymentModal({ cart, subtotal, onClose, onSuccess }: PaymentModalProps) {
    const { t } = useLanguage();
    const [method, setMethod] = useState<'cash' | 'qris'>('cash');
    const [customerMoney, setCustomerMoney] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const kembalian = customerMoney > subtotal ? customerMoney - subtotal : 0;
    const canConfirm = method === 'qris' || customerMoney >= subtotal;

    const handleConfirm = async () => {
        setProcessing(true);
        setError(null);
        try {
            const res = await axios.post(route('lite.order.store'), {
                items: cart.map((c) => ({ item_id: c.itemId, qty: c.qty })),
                payment_method: method,
            });
            onSuccess(res.data.invoice_no, res.data.total);
        } catch (err: any) {
            setError(err?.response?.data?.message ?? t('dashboardLite.order.payment.genericError'));
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
            <div className="w-full max-w-md rounded-t-3xl bg-[var(--neutral-white)] shadow-xl sm:rounded-3xl dark:bg-[var(--background)]">
                <div className="flex items-center justify-between p-5">
                    <h3 className="text-xl font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                        {t('dashboardLite.order.payment.title')}
                    </h3>
                    <button aria-label={t('dashboardLite.order.payment.closeAria')} onClick={onClose}>
                        <X className="h-6 w-6 text-[var(--grey-text)] dark:text-[var(--neutral-white)]" />
                    </button>
                </div>

                <div className="flex flex-col gap-4 px-5 pb-5">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            aria-label={t('dashboardLite.order.payment.cashAria')}
                            onClick={() => setMethod('cash')}
                            className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 transition ${
                                method === 'cash'
                                    ? 'border-[var(--surface-header)] bg-[var(--second-accent)] dark:border-[var(--neutral-white)] dark:bg-[var(--border-strong)]'
                                    : 'border-[var(--border-strong)] text-[var(--grey-text)] dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)]'
                            }`}
                        >
                            <Banknote className="h-6 w-6" />
                            <span className="text-sm font-bold">{t('dashboardLite.order.payment.cashLabel')}</span>
                        </button>
                        <button
                            aria-label={t('dashboardLite.order.payment.qrisAria')}
                            onClick={() => setMethod('qris')}
                            className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 transition ${
                                method === 'qris'
                                    ? 'border-[var(--surface-header)] bg-[var(--second-accent)] dark:border-[var(--neutral-white)] dark:bg-[var(--border-strong)]'
                                    : 'border-[var(--border-strong)] text-[var(--grey-text)] dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)]'
                            }`}
                        >
                            <QrCode className="h-6 w-6" />
                            <span className="text-sm font-bold">{t('dashboardLite.order.payment.qrisLabel')}</span>
                        </button>
                    </div>

                    <div className="flex justify-between rounded-xl bg-[var(--second-accent)] px-4 py-3 dark:bg-[var(--border-strong)]">
                        <span className="text-sm font-semibold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {t('dashboardLite.order.payment.totalBill')}
                        </span>
                        <span className="text-lg font-extrabold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            Rp {subtotal.toLocaleString('id-ID')}
                        </span>
                    </div>

                    {method === 'cash' && (
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-2">
                                {QUICK_AMOUNTS.map((amt) => (
                                    <button
                                        aria-label={`${t('dashboardLite.order.payment.quickAmountAriaPrefix')} ${amt}`}
                                        key={amt}
                                        onClick={() => setCustomerMoney(amt)}
                                        className={`h-11 rounded-xl border-2 text-sm font-bold transition ${
                                            customerMoney === amt
                                                ? 'border-[var(--surface-header)] bg-[var(--surface-header)] text-white dark:border-[var(--neutral-white)] dark:bg-[var(--neutral-white)] dark:text-[var(--primary-900)]'
                                                : 'border-[var(--border-strong)] text-[var(--subheading)] dark:border-[var(--border-strong)] dark:text-[var(--neutral-white)]'
                                        }`}
                                    >
                                        Rp {amt.toLocaleString('id-ID')}
                                    </button>
                                ))}
                            </div>
                            <Input
                                aria-label={t('dashboardLite.order.payment.customerMoneyAria')}
                                type="number"
                                value={customerMoney || ''}
                                onChange={(e) => setCustomerMoney(Number(e.target.value))}
                                placeholder={t('dashboardLite.order.payment.customerMoneyPlaceholder')}
                                className="h-12 rounded-xl text-base dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-[var(--neutral-white)]"
                            />
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--grey-text)] dark:text-[var(--neutral-white)]">
                                    {t('dashboardLite.order.payment.change')}
                                </span>
                                <span className="font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                                    Rp {kembalian.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    )}

                    {error && <p className="text-center text-sm font-medium text-[var(--danger)]">{error}</p>}

                    <Button
                        aria-label={t('dashboardLite.order.payment.confirmAria')}
                        onClick={handleConfirm}
                        disabled={!canConfirm || processing}
                        className="h-12 rounded-xl"
                    >
                        {processing ? t('dashboardLite.order.payment.processingButton') : t('dashboardLite.order.payment.confirmButton')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
