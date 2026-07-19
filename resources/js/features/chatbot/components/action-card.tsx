import { Button } from '@/components/ui/button';
import { cancelAction, confirmAction } from '@/features/chatbot/api';
import { useLanguage } from '@/hooks';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import type { PendingAction } from '../types';

interface ActionCardProps {
    action: PendingAction;
}

function formatValue(key: string, value: unknown): string {
    if (key === 'price' && typeof value === 'number') {
        return `Rp ${value.toLocaleString('id-ID')}`;
    }
    return String(value);
}

export function ActionCard({ action }: ActionCardProps) {
    const { t } = useLanguage();
    const [status, setStatus] = useState(action.status);
    const [loading, setLoading] = useState<'confirm' | 'cancel' | null>(null);

    const TOOL_LABELS: Record<string, string> = {
        create_inventory_item: t('shared.chatbot.actionCard.toolLabels.createInventoryItem'),
    };

    const handleConfirm = async () => {
        setLoading('confirm');
        try {
            await confirmAction(action.id);
            setStatus('confirmed');
        } catch {
            alert(t('shared.chatbot.actionCard.confirmFailedAlert'));
        } finally {
            setLoading(null);
        }
    };

    const handleCancel = async () => {
        setLoading('cancel');
        try {
            await cancelAction(action.id);
            setStatus('cancelled');
        } catch {
            alert(t('shared.chatbot.actionCard.cancelFailedAlert'));
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="mt-2 w-full max-w-sm rounded-xl border border-[var(--secondary-600)]/20 bg-[var(--secondary-600)]/10 p-3">
            <p className="mb-2 text-xs font-semibold text-[var(--secondary-600)]">{TOOL_LABELS[action.tool_name] ?? action.tool_name}</p>
            <dl className="mb-3 flex flex-col gap-1">
                {Object.entries(action.summary)
                    .filter(([key]) => !key.endsWith('_valid'))
                    .map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                            <dt className="text-[var(--grey-text)]">{key.replace(/_/g, ' ')}</dt>
                            <dd className="font-medium text-[var(--subheading)]">{formatValue(key, value)}</dd>
                        </div>
                    ))}
            </dl>

            {status === 'pending' && (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        onClick={handleConfirm}
                        disabled={loading !== null}
                        className="flex-1 bg-[var(--secondary-600)] text-xs hover:bg-[var(--secondary-700)]"
                    >
                        <Check className="mr-1 h-3.5 w-3.5" />
                        {loading === 'confirm' ? t('shared.chatbot.actionCard.confirming') : t('shared.chatbot.actionCard.confirmButton')}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} disabled={loading !== null} className="flex-1 text-xs">
                        <X className="mr-1 h-3.5 w-3.5" />
                        {t('shared.chatbot.actionCard.cancelButton')}
                    </Button>
                </div>
            )}

            {status === 'confirmed' && <p className="text-xs font-medium text-[var(--success)]">{t('shared.chatbot.actionCard.confirmedLabel')}</p>}
            {status === 'cancelled' && <p className="text-xs font-medium text-[var(--grey-text)]">{t('shared.chatbot.actionCard.cancelledLabel')}</p>}
        </div>
    );
}
