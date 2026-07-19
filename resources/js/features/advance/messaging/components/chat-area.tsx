import { useLanguage } from '@/hooks';
import { ArrowLeft, Info, Paperclip, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Conversation, Message } from '../types';
import { MessageBubble } from './message-bubble';

interface ChatAreaProps {
    conversation: Conversation | null;
    messages: Message[];
    authUserId: number;
    isLoading: boolean;
    onSendMessage: (body: string, attachments: File[]) => void;
    onBack?: () => void;
    onOpenInfo?: () => void;
    className?: string;
}

export function ChatArea({ conversation, messages, authUserId, isLoading, onSendMessage, onBack, onOpenInfo, className = '' }: ChatAreaProps) {
    const { t } = useLanguage();
    const [body, setBody] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!body.trim() && files.length === 0) return;
        onSendMessage(body.trim(), files);
        setBody('');
        setFiles([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? []);
        setFiles((prev) => [...prev, ...selected].slice(0, 5));
        e.target.value = '';
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    if (!conversation) {
        return (
            <div className={`flex flex-col items-center justify-center bg-[var(--page-bg)] ${className}`}>
                <div className="flex flex-1 flex-col items-center justify-center">
                    <p className="mb-3 text-4xl">💬</p>
                    <p className="text-sm font-medium text-[var(--subheading)]">{t('dashboardAdvance.messaging.chatArea.emptyTitle')}</p>
                    <p className="mt-1 px-6 text-center text-xs text-[var(--grey-text-muted)]">
                        {t('dashboardAdvance.messaging.chatArea.emptyBody')}
                    </p>
                </div>
            </div>
        );
    }

    const conversationName =
        conversation.type === 'group'
            ? (conversation.name ?? t('dashboardAdvance.messaging.chatArea.groupFallback'))
            : (conversation.members.find((m) => m.id !== authUserId)?.name ?? t('dashboardAdvance.messaging.chatArea.unknownFallback'));

    const initials = conversationName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className={`flex flex-col overflow-hidden bg-[var(--page-bg)] ${className}`}>
            <div className="flex h-15 items-center gap-3 border-b border-[var(--border-strong)] bg-[var(--neutral-white)] px-4 py-3.5 sm:px-5 dark:bg-[var(--card)]">
                {onBack && (
                    <button
                        type="button"
                        aria-label={t('dashboardAdvance.messaging.chatArea.backAriaLabel')}
                        onClick={onBack}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[var(--grey-text)] hover:bg-[var(--second-accent)] lg:hidden dark:hover:bg-[var(--border-strong)]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                )}

                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--surface-header)] text-xs font-medium text-white">
                    {conversation.type === 'group' ? '👥' : initials}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--subheading)]">{conversationName}</p>
                    <p className="truncate text-xs text-[var(--grey-text-muted)]">
                        {conversation.type === 'group'
                            ? `${conversation.members.length} ${t('dashboardAdvance.messaging.chatArea.membersCount')}`
                            : t('dashboardAdvance.messaging.chatArea.privateChat')}
                    </p>
                </div>

                {onOpenInfo && (
                    <button
                        type="button"
                        aria-label={t('dashboardAdvance.messaging.chatArea.infoAriaLabel')}
                        onClick={onOpenInfo}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[var(--grey-text)] hover:bg-[var(--second-accent)] lg:hidden dark:hover:bg-[var(--border-strong)]"
                    >
                        <Info className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-[var(--grey-text-muted)]">{t('dashboardAdvance.messaging.chatArea.loadingMessages')}</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-[var(--grey-text-muted)]">{t('dashboardAdvance.messaging.chatArea.emptyMessages')}</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {files.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-[var(--border-strong)] bg-[var(--neutral-white)] px-4 py-2 dark:bg-[var(--card)]">
                    {files.map((file, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--second-accent)] px-2 py-1 text-xs text-[var(--grey-text)] dark:border-transparent dark:bg-[var(--border-strong)]"
                        >
                            <span className="max-w-[120px] truncate">{file.name}</span>
                            <button
                                aria-label={`${t('dashboardAdvance.messaging.chatArea.removeFileAriaLabel')} ${file.name}`}
                                onClick={() => removeFile(i)}
                                className="text-[var(--grey-text-muted)] hover:text-red-500"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="border-t border-[var(--border-strong)] bg-[var(--neutral-white)] px-3 py-3 sm:px-4 dark:bg-[var(--card)]">
                <div className="flex items-end gap-2">
                    <button
                        aria-label={t('dashboardAdvance.messaging.chatArea.attachAriaLabel')}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--border-strong)] text-[var(--grey-text)] transition-all hover:bg-[var(--second-accent)] dark:hover:bg-[var(--border-strong)]"
                    >
                        <Paperclip className="h-4 w-4" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        aria-label={t('dashboardAdvance.messaging.chatArea.uploadAriaLabel')}
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <textarea
                        aria-label={t('dashboardAdvance.messaging.chatArea.typeAriaLabel')}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('dashboardAdvance.messaging.chatArea.typePlaceholder')}
                        rows={1}
                        className="flex-1 resize-none rounded-lg border border-[var(--border-strong)] bg-[var(--page-bg)] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[var(--border-strong)]"
                        style={{ maxHeight: '120px' }}
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.style.height = 'auto';
                            el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                        }}
                    />

                    <button
                        aria-label={t('dashboardAdvance.messaging.chatArea.sendAriaLabel')}
                        onClick={handleSend}
                        disabled={!body.trim() && files.length === 0}
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--surface-header)] text-white transition-all hover:bg-[var(--surface-header-hover)] disabled:opacity-40"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
