import { Button, Input, Label } from '@/components';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks';
import axios from 'axios';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface SendReceiptEmailModalProps {
    transactionId: number;
    invoice: string;
    onClose: () => void;
}

export function SendReceiptEmailModal({ transactionId, invoice, onClose }: SendReceiptEmailModalProps) {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        setSending(true);
        setError(null);
        try {
            await axios.post(route('cashier.history.send-email', transactionId), { email });
            setSent(true);
        } catch (err: any) {
            setError(err?.response?.data?.message ?? t('cashier.history.emailModal.failed'));
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open onOpenChange={(isOpen) => !isOpen && !sending && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{t('cashier.history.emailModal.title')}</DialogTitle>
                </DialogHeader>

                {sent ? (
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success-background)]">
                            <CheckCircle2 className="h-6 w-6 text-[var(--success)]" />
                        </div>
                        <p className="text-sm text-[var(--subheading)]">
                            {t('cashier.history.emailModal.sentPrefix')} <strong>{email}</strong>
                        </p>
                        <Button onClick={onClose} className="mt-2 w-full">
                            {t('cashier.history.emailModal.closeButton')}
                        </Button>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-[var(--grey-text)]">
                            {t('cashier.history.emailModal.description')} <strong>{invoice}</strong>
                        </p>
                        <div>
                            <Label htmlFor="receipt-email">{t('cashier.history.emailModal.emailLabel')}</Label>
                            <Input
                                id="receipt-email"
                                type="email"
                                aria-label={t('cashier.history.emailModal.emailAriaLabel')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('cashier.history.emailModal.emailPlaceholder')}
                            />
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-background)] px-3 py-2 text-xs text-[var(--danger)]">
                                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <DialogFooter className="mt-2 flex gap-2 sm:justify-end">
                            <Button variant="outline" onClick={onClose} disabled={sending}>
                                {t('cashier.history.emailModal.cancel')}
                            </Button>
                            <Button
                                onClick={handleSend}
                                disabled={sending || !email}
                                className="bg-[var(--surface-header)] text-white hover:bg-[var(--surface-header-hover)]"
                            >
                                {sending ? t('cashier.history.emailModal.sending') : t('cashier.history.emailModal.sendButton')}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
