import { Button, Input, Separator } from '@/components';
import type { CartItem } from '@/features/advance/cashier/order/type';
import { useLanguage } from '@/hooks';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface OrderCartPanelProps {
    cart: CartItem[];
    qtyDrafts: Record<number, string>;
    onQtyFocus: (itemId: number, currentQty: number) => void;
    onQtyDraftChange: (itemId: number, value: string) => void;
    onQtyDraftCommit: (index: number, itemId: number) => void;
    onIncrement: (index: number) => void;
    onDecrement: (index: number) => void;
    onRemove: (index: number) => void;
    onNoteChange: (index: number, note: string) => void;
    subtotal: number;
    discount: number;
    showContinueButton: boolean;
    onContinue: () => void;
    onPrintOrderSlip: () => void;
}

export function OrderCartPanel({
    cart,
    qtyDrafts,
    onQtyFocus,
    onQtyDraftChange,
    onQtyDraftCommit,
    onIncrement,
    onDecrement,
    onRemove,
    onNoteChange,
    subtotal,
    discount,
    showContinueButton,
    onContinue,
    onPrintOrderSlip,
}: OrderCartPanelProps) {
    const { t, locale } = useLanguage();
    const dateLocale = locale === 'en' ? 'en-US' : 'id-ID';

    return (
        <>
            <div className="p-5">
                <h2 className="text-base font-bold tracking-widest uppercase">{t('cashier.order.detail.title')}</h2>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                        {new Date().toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>
            <Separator className="bg-white/10" />

            <div className="flex justify-between px-5 pt-3 pb-2 text-[11px] text-slate-400">
                <span>{t('cashier.order.detail.itemHeader')}</span>
                <div className="flex gap-8">
                    <span>{t('cashier.order.detail.qtyHeader')}</span>
                    <span>{t('cashier.order.detail.priceHeader')}</span>
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-2">
                {cart.length === 0 && <p className="pt-4 text-center text-xs text-slate-400">{t('cashier.order.detail.emptyCart')}</p>}
                {cart.map((item, index) => (
                    <div key={item.itemId} className="space-y-2 rounded-lg bg-white/[0.03] p-2.5">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-2">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--secondary-600)]/20 text-lg">
                                    🛒
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-xs leading-tight font-semibold text-slate-200">{item.name}</p>
                                    <p className="text-[10px] text-slate-400">Rp. {item.price.toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                            <button
                                aria-label={`${t('cashier.order.detail.removeAriaPrefix')} ${item.name}`}
                                onClick={() => onRemove(index)}
                                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-[var(--danger)]/20 hover:text-[var(--danger)]"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between gap-2 pl-11">
                            <div className="flex items-center gap-1">
                                <button
                                    aria-label={`${t('cashier.order.detail.decreaseAriaPrefix')} ${item.name}`}
                                    onClick={() => onDecrement(index)}
                                    className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 text-slate-300 hover:bg-white/10"
                                >
                                    <Minus className="h-3 w-3" />
                                </button>
                                <input
                                    aria-label={`${t('cashier.order.detail.qtyInputAriaPrefix')} ${item.name}`}
                                    type="text"
                                    inputMode="numeric"
                                    value={qtyDrafts[item.itemId] ?? String(item.qty)}
                                    onFocus={() => onQtyFocus(item.itemId, item.qty)}
                                    onChange={(e) => onQtyDraftChange(item.itemId, e.target.value)}
                                    onBlur={() => onQtyDraftCommit(index, item.itemId)}
                                    onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                    className="h-6 w-9 rounded-md border border-white/15 bg-transparent text-center text-[11px] font-bold text-white outline-none focus:border-[var(--secondary-600)]"
                                />
                                <button
                                    aria-label={`${t('cashier.order.detail.increaseAriaPrefix')} ${item.name}`}
                                    onClick={() => onIncrement(index)}
                                    className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 text-slate-300 hover:bg-white/10"
                                >
                                    <Plus className="h-3 w-3" />
                                </button>
                            </div>
                            <span className="text-[11px] font-medium text-slate-300">Rp. {(item.price * item.qty).toLocaleString('id-ID')}</span>
                        </div>

                        <Input
                            aria-label={`${t('cashier.order.detail.noteAriaPrefix')} ${item.name}`}
                            value={item.note}
                            onChange={(e) => onNoteChange(index, e.target.value)}
                            placeholder={t('cashier.order.detail.notePlaceholder')}
                            className="h-8 rounded-lg border-white/20 bg-white text-xs text-slate-900 placeholder:text-slate-400"
                        />
                    </div>
                ))}
            </div>

            <Separator className="bg-white/10" />
            <div className="space-y-1.5 p-5">
                <div className="flex justify-between text-xs text-slate-400">
                    <span>{t('cashier.order.detail.discountLabel')}</span>
                    <span>Rp. {discount}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white">
                    <span>{t('cashier.order.detail.subtotalLabel')}</span>
                    <span>Rp. {subtotal.toLocaleString('id-ID')}</span>
                </div>
            </div>
            <Separator className="bg-white/10" />

            <div className="space-y-2 p-5">
                <Button
                    aria-label={t('cashier.order.orderSlip.printAria')}
                    variant="outline"
                    onClick={onPrintOrderSlip}
                    disabled={cart.length === 0}
                    className="h-10 w-full border-white/20 bg-transparent text-xs font-semibold text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
                >
                    {t('cashier.order.orderSlip.printButton')}
                </Button>
                {showContinueButton && (
                    <Button
                        aria-label={t('cashier.order.detail.continueAria')}
                        onClick={onContinue}
                        disabled={cart.length === 0}
                        className="h-11 w-full bg-white text-xs font-bold text-slate-900 hover:bg-slate-100 disabled:opacity-50"
                    >
                        {t('cashier.order.detail.continueButton')}
                    </Button>
                )}
            </div>
        </>
    );
}
