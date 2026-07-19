import { Button } from '@/components/ui/button';
import { submitToolForm } from '@/features/chatbot/api';
import { useLanguage } from '@/hooks';
import { useState } from 'react';
import type { FormField, PendingForm } from '../types';

interface ToolFormCardProps {
    form: PendingForm;
    conversationId: number;
    onSubmitted: (assistantMessage: { content: string; action: any }) => void;
}

export function ToolFormCard({ form, conversationId, onSubmitted }: ToolFormCardProps) {
    const { t } = useLanguage();
    const [values, setValues] = useState<Record<string, string | number>>(Object.fromEntries(form.fields.map((f) => [f.name, f.value])));
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const isValid = form.fields.every((f) => !f.required || String(values[f.name] ?? '').trim() !== '');

    const handleChange = (field: FormField, raw: string) => {
        setValues((prev) => ({ ...prev, [field.name]: field.type === 'number' ? Number(raw) : raw }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await submitToolForm(conversationId, form.tool_name, values);
            onSubmitted({ content: res.reply, action: res.action });
            setSubmitted(true);
        } catch {
            alert(t('shared.chatbot.toolForm.submitFailedAlert'));
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return <p className="mt-2 text-xs font-medium text-[var(--grey-text)]">{t('shared.chatbot.toolForm.submittedLabel')}</p>;
    }

    return (
        <div className="mt-2 w-full max-w-sm rounded-xl border border-[var(--secondary-600)]/20 bg-[var(--secondary-600)]/10 p-3">
            <div className="mb-3 flex flex-col gap-2.5">
                {form.fields.map((field) => (
                    <div key={field.name}>
                        <label className="mb-1 block text-xs font-medium text-[var(--grey-text)]">
                            {field.label}
                            {field.required && <span className="text-[var(--danger)]"> *</span>}
                        </label>

                        {field.type === 'select' ? (
                            <select
                                aria-label={field.label}
                                value={String(values[field.name] ?? '')}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--card)] px-2.5 py-1.5 text-sm text-[var(--subheading)]"
                            >
                                <option value="" disabled>
                                    {t('shared.chatbot.toolForm.selectPlaceholderPrefix')} {field.label.toLowerCase()}
                                </option>
                                {field.options?.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                aria-label={field.label}
                                type={field.type === 'number' ? 'number' : 'text'}
                                value={values[field.name] ?? ''}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--card)] px-2.5 py-1.5 text-sm text-[var(--subheading)]"
                            />
                        )}
                    </div>
                ))}
            </div>

            <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!isValid || loading}
                className="w-full bg-[var(--secondary-600)] text-xs hover:bg-[var(--secondary-700)]"
            >
                {loading ? t('shared.chatbot.toolForm.preparing') : t('shared.chatbot.toolForm.continueButton')}
            </Button>
        </div>
    );
}
