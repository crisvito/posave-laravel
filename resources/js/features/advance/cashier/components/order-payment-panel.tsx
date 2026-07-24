import { Button, Input, Separator } from '@/components';
import { useLanguage } from '@/hooks';
import { Banknote, QrCode } from 'lucide-react';

const QUICK_AMOUNTS = [20000, 50000, 100000, 150000];

interface OrderPaymentPanelProps {
    paymentMethod: 'cash' | 'qris';
    onPaymentMethodChange: (method: 'cash' | 'qris') => void;
    totalTagihan: number;
    customerMoney: number;
    onCustomerMoneyChange: (value: number) => void;
    kembalian: number;
    showQris: boolean;
    onShowQris: () => void;
    onCancel: () => void;
    onConfirmClick: () => void;
    confirmDisabled: boolean;
}

export function OrderPaymentPanel({
    paymentMethod,
    onPaymentMethodChange,
    totalTagihan,
    customerMoney,
    onCustomerMoneyChange,
    kembalian,
    showQris,
    onShowQris,
    onCancel,
    onConfirmClick,
    confirmDisabled,
}: OrderPaymentPanelProps) {
    const { t } = useLanguage();

    return (
        <>
            <div className="p-5">
                <h2 className="text-base font-bold text-white">{t('cashier.order.payment.title')}</h2>
                <p className="text-[11px] text-white/60">{t('cashier.order.payment.methodsCount')}</p>
            </div>
            <Separator className="bg-white/10" />

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
                <div>
                    <p className="mb-3 text-xs font-bold text-white/70">{t('cashier.order.payment.methodsLabel')}</p>
                    <div className="grid grid-cols-2 gap-3">
                        {(
                            [
                                { id: 'cash', label: t('cashier.order.payment.cash'), icon: <Banknote className="h-6 w-6" /> },
                                { id: 'qris', label: t('cashier.order.payment.qris'), icon: <QrCode className="h-6 w-6" /> },
                            ] as const
                        ).map((method) => (
                            <button
                                aria-label={`${t('cashier.order.payment.selectMethodAriaPrefix')} ${method.label}`}
                                key={method.id}
                                onClick={() => onPaymentMethodChange(method.id)}
                                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-4 transition ${
                                    paymentMethod === method.id
                                        ? 'border-[var(--secondary-600)] bg-[var(--secondary-600)]/15 text-white'
                                        : 'border-white/15 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]'
                                }`}
                            >
                                {method.icon}
                                <span className="text-[11px] font-bold">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">{t('cashier.order.payment.totalBill')}</span>
                    <span className="text-sm font-bold text-white">Rp. {totalTagihan.toLocaleString('id-ID')}</span>
                </div>

                {paymentMethod === 'cash' && (
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-white/70">{t('cashier.order.payment.customerAmountLabel')}</p>
                        <div className="grid grid-cols-2 gap-2">
                            {QUICK_AMOUNTS.map((amount, i) => (
                                <Button
                                    aria-label={`${t('cashier.order.payment.quickAmountAriaPrefix')} ${amount}`}
                                    key={i}
                                    onClick={() => onCustomerMoneyChange(amount)}
                                    className={`h-9 text-xs font-medium ${
                                        customerMoney === amount
                                            ? 'bg-white text-slate-900 hover:bg-slate-100'
                                            : 'border border-white/15 bg-white/[0.03] text-white/70 hover:bg-white/10'
                                    }`}
                                >
                                    Rp. {amount.toLocaleString('id-ID')}
                                </Button>
                            ))}
                        </div>
                        <Input
                            aria-label={t('cashier.order.payment.customerAmountAria')}
                            type="number"
                            value={customerMoney || ''}
                            onChange={(e) => onCustomerMoneyChange(Number(e.target.value))}
                            placeholder={t('cashier.order.payment.customerAmountPlaceholder')}
                            className="h-10 border-white/20 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-white/70">{t('cashier.order.payment.change')}</span>
                            <span className="font-bold text-white">Rp. {kembalian.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                )}

                {paymentMethod === 'qris' && (
                    <div className="flex items-center justify-center rounded-xl bg-white/[0.03] py-8">
                        {showQris ? (
                            <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-4 text-black">
                                <div className="flex h-36 w-36 items-center justify-center rounded border-2 border-slate-200 bg-slate-100 text-[10px] font-bold text-slate-400">
                                    {t('cashier.order.payment.qrisCode')}
                                </div>
                                <span className="text-[10px] text-slate-500">{t('cashier.order.payment.qrisScanHint')}</span>
                            </div>
                        ) : (
                            <Button
                                aria-label={t('cashier.order.payment.showQrisAria')}
                                onClick={onShowQris}
                                className="bg-white px-8 text-xs font-bold text-slate-900 hover:bg-slate-100"
                            >
                                {t('cashier.order.payment.showQrisButton')}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <Separator className="bg-white/10" />
            <div className="space-y-2 p-5">
                <Button
                    aria-label={t('cashier.order.payment.cancelAria')}
                    onClick={onCancel}
                    variant="outline"
                    className="h-10 w-full border-white/15 bg-transparent text-xs text-white hover:bg-white/10 hover:text-white"
                >
                    {t('cashier.order.payment.cancelButton')}
                </Button>
                <Button
                    aria-label={t('cashier.order.payment.confirmAria')}
                    onClick={onConfirmClick}
                    disabled={confirmDisabled}
                    className="h-11 w-full bg-white text-xs font-bold text-slate-900 hover:bg-slate-100 disabled:opacity-50"
                >
                    {t('cashier.order.payment.confirmButton')}
                </Button>
            </div>
        </>
    );
}
