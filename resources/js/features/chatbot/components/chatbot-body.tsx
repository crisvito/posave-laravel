import { useChatbot } from '@/features/chatbot';
import { useLanguage } from '@/hooks';
import { router } from '@inertiajs/react';
import { Bot, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message, PendingAction } from '../types';
import { ActionCard } from './action-card';
import { ToolFormCard } from './tool-form-card';

interface ChatBodyProps {
    messages: Message[];
    isLoadingHistory: boolean;
    isWaitingReply: boolean;
    conversationId: number | null;
    onFormSubmitted: (content: string, action: PendingAction | null) => void;
}

export function ChatBody({ messages, isLoadingHistory, isWaitingReply, conversationId, onFormSubmitted }: ChatBodyProps) {
    const { t } = useLanguage();
    const { close } = useChatbot();
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const isAtBottomRef = useRef(true);
    const [showJumpButton, setShowJumpButton] = useState(false);

    const scrollToBottom = (behavior: ScrollBehavior) => {
        bottomRef.current?.scrollIntoView({ behavior, block: 'end' });
    };

    const checkAtBottom = () => {
        const el = scrollRef.current;
        if (!el) return true;
        return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    };

    const handleScroll = () => {
        const atBottom = checkAtBottom();
        isAtBottomRef.current = atBottom;
        setShowJumpButton(!atBottom);
    };

    useEffect(() => {
        if (!isLoadingHistory) {
            isAtBottomRef.current = true;
            setShowJumpButton(false);
            requestAnimationFrame(() => scrollToBottom('auto'));
        }
    }, [isLoadingHistory, conversationId]);

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        const forceScroll = lastMessage?.role === 'user';

        if (forceScroll || isAtBottomRef.current) {
            isAtBottomRef.current = true;
            setShowJumpButton(false);
            scrollToBottom('smooth');
        } else {
            setShowJumpButton(true);
        }
    }, [messages]);

    function handleMarkdownLinkClick(event: React.MouseEvent<HTMLAnchorElement>, href: string | undefined) {
        const isInternalLink = typeof href === 'string' && href.length > 0 && href.charAt(0) === '/';

        if (isInternalLink) {
            event.preventDefault();
            close();
            router.visit(href as string);
        }
    }

    if (isLoadingHistory) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-[var(--grey-text-muted)]">{t('shared.chatbot.body.loadingHistory')}</p>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center px-6">
                <div className="text-center">
                    <Bot className="mx-auto h-14 w-14 text-[var(--secondary-600)] sm:h-16 sm:w-16" />
                    <h1 className="mt-6 text-2xl font-bold text-[var(--subheading)] sm:text-3xl">{t('shared.chatbot.body.greetingTitle')}</h1>
                    <p className="mt-3 text-sm text-[var(--grey-text)] sm:text-base">
                        {t('shared.chatbot.body.greetingSubtitleLine1')}
                        <br />
                        {t('shared.chatbot.body.greetingSubtitleLine2')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex-1 overflow-hidden">
            <div ref={scrollRef} onScroll={handleScroll} className="absolute inset-0 space-y-4 overflow-y-auto p-4 sm:p-6">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2 sm:max-w-[70%] ${
                                msg.role === 'user' ? 'bg-[var(--secondary-600)] text-white' : 'bg-[var(--second-accent)] text-[var(--subheading)]'
                            }`}
                        >
                            {msg.role === 'assistant' ? (
                                <div className="prose prose-sm prose-p:my-2 prose-ul:my-2 prose-ol:my-2 dark:prose-invert max-w-none">
                                    <ReactMarkdown components={{ a: MarkdownLink(handleMarkdownLinkClick) }}>{msg.content}</ReactMarkdown>
                                </div>
                            ) : (
                                msg.content
                            )}
                        </div>

                        {msg.action && <ActionCard action={msg.action} />}

                        {msg.form && conversationId && (
                            <ToolFormCard
                                form={msg.form}
                                conversationId={conversationId}
                                onSubmitted={(res) => onFormSubmitted(res.content, res.action)}
                            />
                        )}
                    </div>
                ))}

                {isWaitingReply && (
                    <div className="flex justify-start">
                        <div className="max-w-[85%] rounded-2xl bg-[var(--second-accent)] px-4 py-2 text-[var(--grey-text)] sm:max-w-[70%]">
                            {t('shared.chatbot.body.typing')}
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {showJumpButton && (
                <button
                    type="button"
                    aria-label={t('shared.chatbot.body.jumpToLatestAriaLabel')}
                    onClick={() => {
                        isAtBottomRef.current = true;
                        setShowJumpButton(false);
                        scrollToBottom('smooth');
                    }}
                    className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[var(--secondary-600)] px-3.5 py-2 text-xs font-medium text-white shadow-lg transition hover:bg-[var(--secondary-700)]"
                >
                    <ChevronDown className="h-3.5 w-3.5" />
                    {t('shared.chatbot.body.jumpToLatestLabel')}
                </button>
            )}
        </div>
    );
}

function MarkdownLink(onLinkClick: (event: React.MouseEvent<HTMLAnchorElement>, href: string | undefined) => void) {
    return function MarkdownLinkComponent({ href, children }: { href?: string; children?: React.ReactNode }) {
        return (
            <a
                href={href}
                onClick={(event) => onLinkClick(event, href)}
                className="font-medium text-[var(--secondary-600)] underline hover:text-[var(--secondary-700)]"
            >
                {children}
            </a>
        );
    };
}
