import { useChatbot } from '@/features/chatbot';
import { Bot, History, X } from 'lucide-react';

interface ChatHeaderProps {
    onOpenHistory?: () => void;
}

export function ChatHeader({ onOpenHistory }: ChatHeaderProps) {
    const { close } = useChatbot();

    return (
        <div className="flex h-14 items-center justify-between border-b px-4 sm:h-16 sm:px-6 dark:border-[var(--border-strong)]">
            <div className="flex min-w-0 items-center gap-2">
                {onOpenHistory && (
                    <button
                        type="button"
                        aria-label="Buka riwayat percakapan"
                        onClick={onOpenHistory}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-gray-400 dark:hover:bg-[var(--border-strong)] dark:hover:text-white"
                    >
                        <History className="h-5 w-5" />
                    </button>
                )}
                <Bot className="h-6 w-6 shrink-0 text-blue-600" />
                <div className="min-w-0">
                    <h2 className="truncate font-semibold text-slate-900 dark:text-white">Robot Pintar</h2>
                    <p className="truncate text-xs text-slate-500 dark:text-[var(--muted-foreground)]">POSAVE AI Assistant</p>
                </div>
            </div>

            <button
                aria-label="Tutup chatbot"
                onClick={close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-[var(--border-strong)] dark:hover:text-white"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
}
