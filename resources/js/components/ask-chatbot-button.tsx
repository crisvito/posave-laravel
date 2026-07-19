import { Button } from '@/components/ui';
import { useChatbot } from '@/features/chatbot';
import { useLanguage } from '@/hooks';
import { MessageSquare } from 'lucide-react';

interface AskChatbotButtonProps {
    className?: string;
}

export function AskChatbotButton({ className = '' }: AskChatbotButtonProps) {
    const { t } = useLanguage();
    const { open } = useChatbot();

    return (
        <Button
            aria-label={t('shared.chatbot.trigger.ariaLabel')}
            onClick={open}
            variant="outline"
            className={`h-10 shrink-0 rounded-md border-[var(--secondary-600)]/30 bg-[var(--card)] text-[var(--secondary-600)] shadow-sm hover:bg-[var(--secondary-600)]/10 ${className}`}
        >
            <MessageSquare className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('shared.chatbot.trigger.label')}</span>
        </Button>
    );
}
