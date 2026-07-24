import type { CartItem } from '@/features/advance/cashier/order/type';
import { useLanguage } from '@/hooks';

interface PrintableOrderSlipProps {
    items: CartItem[];
    subtotal: number;
    discount: number;
}

/** Bon pesanan — dicetak SEBELUM bayar. Beda dari struk resmi: gak ada status bayar/metode/kembalian. */
export function PrintableOrderSlip({ items, subtotal, discount }: PrintableOrderSlipProps) {
    const { t } = useLanguage();

    if (items.length === 0) return null;

    const total = subtotal - discount;

    return (
        <>
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #printable-order-slip, #printable-order-slip * { visibility: visible; }
                    #printable-order-slip { position: absolute; left: 0; top: 0; width: 100%; }
                }
            `}</style>

            <div id="printable-order-slip" className="hidden print:block">
                <div className="mx-auto w-[280px] p-4 font-mono text-xs text-black">
                    <p className="text-center text-sm font-bold">{t('cashier.order.orderSlip.title')}</p>
                    <p className="text-center text-[10px]">{t('cashier.order.orderSlip.notPaidNotice')}</p>

                    <div className="my-2 border-t border-dashed border-black" />

                    <div className="flex justify-between">
                        <span>
                            {new Date().toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>

                    <div className="my-2 border-t border-dashed border-black" />

                    {items.map((item) => (
                        <div key={item.itemId} className="mb-1.5">
                            <p>{item.name}</p>
                            <div className="flex justify-between">
                                <span>
                                    {item.qty} x {item.price.toLocaleString('id-ID')}
                                </span>
                                <span>{(item.qty * item.price).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    ))}

                    <div className="my-2 border-t border-dashed border-black" />

                    <div className="flex justify-between">
                        <span>{t('cashier.order.detail.subtotalLabel')}</span>
                        <span>{subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between">
                            <span>{t('cashier.order.detail.discountLabel')}</span>
                            <span>-{discount.toLocaleString('id-ID')}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold">
                        <span>{t('cashier.order.orderSlip.estimatedTotal')}</span>
                        <span>{total.toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
