import { useChatbot } from '@/features/chatbot';
import { useLanguage } from '@/hooks';
import { Bot, History, X } from 'lucide-react';

interface ChatHeaderProps {
    onOpenHistory?: () => void;
}

export function ChatHeader({ onOpenHistory }: ChatHeaderProps) {
    const { t } = useLanguage();
    const { close } = useChatbot();

    return (
        <div className="flex h-14 items-center justify-between border-b border-[var(--border-strong)] px-4 sm:h-16 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
                {onOpenHistory && (
                    <button
                        type="button"
                        aria-label={t('shared.chatbot.header.openHistoryAriaLabel')}
                        onClick={onOpenHistory}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--grey-text)] hover:bg-[var(--second-accent)] hover:text-[var(--subheading)] lg:hidden"
                    >
                        <History className="h-5 w-5" />
                    </button>
                )}
                <Bot className="h-6 w-6 shrink-0 text-[var(--secondary-600)]" />
                <div className="min-w-0">
                    <h2 className="truncate font-semibold text-[var(--subheading)]">{t('shared.chatbot.header.title')}</h2>
                    <p className="truncate text-xs text-[var(--grey-text)]">{t('shared.chatbot.header.subtitle')}</p>
                </div>
            </div>

            <button
                aria-label={t('shared.chatbot.header.closeAriaLabel')}
                onClick={close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--grey-text)] transition hover:bg-[var(--second-accent)] hover:text-[var(--subheading)]"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
}
