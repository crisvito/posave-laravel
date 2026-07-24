import { Badge, Button } from '@/components';
import { Separator } from '@/components/ui';
import { STATUS_BADGE_STYLES, STATUS_LABEL, type Transaction } from '@/features/advance/cashier/history/type';
import { useLanguage } from '@/hooks';
import { Mail, Printer } from 'lucide-react';

interface HistoryDetailPanelProps {
    selected: Transaction | null;
    subtotal: number;
    onPrint: () => void;
    onSendEmail: () => void;
}

export function HistoryDetailPanel({ selected, subtotal, onPrint, onSendEmail }: HistoryDetailPanelProps) {
    const { t } = useLanguage();

    return (
        <>
            <div className="p-5">
                <h2 className="text-base font-bold tracking-widest uppercase">{t('cashier.history.detail.title')}</h2>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                    {selected && <span className="text-slate-400">{selected.dateLabel}</span>}
                </div>
            </div>
            <Separator className="bg-white/10" />

            <div className="flex-1 overflow-y-auto">
                {selected ? (
                    <div className="space-y-4 p-5">
                        <div className="flex items-center justify-between">
                            <Badge
                                variant="outline"
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_STYLES[selected.status]}`}
                            >
                                {STATUS_LABEL[selected.status]}
                            </Badge>
                            <span className="text-sm font-bold text-white">{selected.invoice}</span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">{t('cashier.history.detail.timeLabel')}</span>
                                <span className="font-medium text-slate-200">
                                    {selected.date}, {selected.time}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">{t('cashier.history.detail.paymentMethodLabel')}</span>
                                <span className="font-medium text-slate-200">{selected.paymentMethod.toUpperCase()}</span>
                            </div>
                        </div>

                        <Separator className="bg-white/10" />

                        <div className="flex justify-between text-[11px] text-slate-400">
                            <span>{t('cashier.history.detail.itemHeader')}</span>
                            <div className="flex gap-8">
                                <span>{t('cashier.history.detail.qtyHeader')}</span>
                                <span>{t('cashier.history.detail.priceHeader')}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {selected.items.map((item, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-lg">
                                                🛒
                                            </div>
                                            <div>
                                                <p className="text-xs leading-tight font-semibold text-slate-200">{item.name}</p>
                                                <p className="text-[10px] text-slate-400">Rp. {item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-shrink-0 items-center gap-3">
                                            <Badge className="rounded border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-bold text-white">
                                                {item.qty}
                                            </Badge>
                                            <span className="text-[11px] font-medium text-slate-300">
                                                Rp. {(item.price * item.qty).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                    {item.note && <p className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-slate-300">📝 {item.note}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500">{t('cashier.history.detail.emptySelection')}</div>
                )}
            </div>

            <div>
                <Separator className="bg-white/10" />
                <div className="space-y-1.5 p-5">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>{t('cashier.history.detail.discountLabel')}</span>
                        <span>Rp. {selected ? selected.discount.toLocaleString('id-ID') : 0}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white">
                        <span>{t('cashier.history.detail.subtotalLabel')}</span>
                        <span>Rp. {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                </div>
                <Separator className="bg-white/10" />
                <div className="space-y-2 p-5">
                    <Button
                        aria-label={t('cashier.history.detail.printAria')}
                        variant="outline"
                        onClick={onPrint}
                        disabled={!selected}
                        className="h-10 w-full border-white/20 bg-transparent text-xs font-semibold text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
                    >
                        <Printer className="h-3.5 w-3.5" />
                        {t('cashier.history.detail.printButton')}
                    </Button>
                    <Button
                        aria-label={t('cashier.history.detail.emailAria')}
                        onClick={onSendEmail}
                        disabled={!selected}
                        className="h-11 w-full bg-white text-xs font-bold text-slate-900 hover:bg-slate-100 disabled:opacity-40"
                    >
                        <Mail className="h-3.5 w-3.5" />
                        {t('cashier.history.detail.emailButton')}
                    </Button>
                </div>
            </div>
        </>
    );
}
