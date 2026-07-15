import { Button } from '@/components/ui';
import { useChatbot } from '@/features/chatbot';
import { MessageSquare } from 'lucide-react';

interface AskChatbotButtonProps {
    className?: string;
}

export function AskChatbotButton({ className = '' }: AskChatbotButtonProps) {
    const { open } = useChatbot();

    return (
        <Button
            aria-label="Buka asisten chatbot"
            onClick={open}
            variant="outline"
            className={`h-10 shrink-0 rounded-md border-blue-200 bg-white text-[#003399] shadow-sm hover:bg-blue-50 dark:border-[var(--border-strong)] dark:bg-[var(--card)] dark:text-white dark:hover:bg-[var(--second-accent)] ${className}`}
        >
            <MessageSquare className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Tanya Temanmu</span>
        </Button>
    );
}
