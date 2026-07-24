import { useLanguage } from '@/hooks';

interface ReceiptLineItem {
    name: string;
    price: number;
    qty: number;
}

interface CompanyProfileForReceipt {
    name?: string;
    address?: string;
    phone?: string;
    logo?: string;
}

interface PrintableReceiptProps {
    invoice: string;
    dateLabel: string;
    items: ReceiptLineItem[];
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: string;
    customerMoney?: number;
    change?: number;
    companyProfile?: CompanyProfileForReceipt | null;
    receiptNotes?: string | null;
}

export function PrintableReceipt({
    invoice,
    dateLabel,
    items,
    subtotal,
    discount,
    total,
    paymentMethod,
    customerMoney,
    change,
    companyProfile,
    receiptNotes,
}: PrintableReceiptProps) {
    const { t } = useLanguage();

    return (
        <>
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #printable-receipt, #printable-receipt * { visibility: visible; }
                    #printable-receipt { position: absolute; left: 0; top: 0; width: 100%; }
                }
            `}</style>

            <div id="printable-receipt" className="hidden print:block">
                <div className="mx-auto w-[280px] p-4 font-mono text-xs text-black">
                    {companyProfile?.logo && (
                        <div className="mb-2 flex justify-center">
                            <img src={`/storage/${companyProfile.logo}`} alt="" className="h-10 w-auto object-contain" />
                        </div>
                    )}
                    <div className="text-center">
                        <p className="text-sm font-bold">{companyProfile?.name || 'POSAVE'}</p>
                        {companyProfile?.address && <p className="mt-0.5">{companyProfile.address}</p>}
                        {companyProfile?.phone && <p>{companyProfile.phone}</p>}
                    </div>

                    <div className="my-2 border-t border-dashed border-black" />

                    <div className="flex justify-between">
                        <span>{invoice}</span>
                        <span>{dateLabel}</span>
                    </div>

                    <div className="my-2 border-t border-dashed border-black" />

                    {items.map((item, index) => (
                        <div key={index} className="mb-1.5">
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
                        <span>TOTAL</span>
                        <span>{total.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="my-2 border-t border-dashed border-black" />

                    <div className="flex justify-between">
                        <span>{paymentMethod.toUpperCase()}</span>
                    </div>
                    {typeof customerMoney === 'number' && typeof change === 'number' && (
                        <>
                            <div className="flex justify-between">
                                <span>{t('cashier.order.payment.customerAmountLabel')}</span>
                                <span>{customerMoney.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('cashier.order.payment.change')}</span>
                                <span>{change.toLocaleString('id-ID')}</span>
                            </div>
                        </>
                    )}

                    {receiptNotes && (
                        <>
                            <div className="my-2 border-t border-dashed border-black" />
                            <p className="text-center">{receiptNotes}</p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
