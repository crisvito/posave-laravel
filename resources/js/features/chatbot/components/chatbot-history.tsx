import { CreateButton } from '@/components';
import { deleteConversation, renameConversation } from '@/features/chatbot/api';
import { ConversationMenu } from '@/features/chatbot/components';
import { useLanguage } from '@/hooks';
import { useState } from 'react';
import type { Conversation } from '../types';

interface ChatHistoryProps {
    conversations: Conversation[];
    activeConversationId: number | null;
    onSelect: (id: number) => void;
    onNewChat: () => void;
    onListChanged: () => void;
    variant?: 'sidebar' | 'sheet';
}

export function ChatHistory({ conversations, activeConversationId, onSelect, onNewChat, onListChanged, variant = 'sidebar' }: ChatHistoryProps) {
    const { t } = useLanguage();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState('');

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await deleteConversation(id);
            onListChanged();
        } catch (error) {
            console.error('Gagal menghapus percakapan:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const startEditing = (conv: Conversation) => {
        setEditingId(conv.id);
        setEditingValue(conv.title);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingValue('');
    };

    const commitRename = async (id: number) => {
        const trimmed = editingValue.trim();
        const original = conversations.find((c) => c.id === id)?.title;

        if (!trimmed || trimmed === original) {
            cancelEditing();
            return;
        }

        try {
            await renameConversation(id, trimmed);
            onListChanged();
        } catch (error) {
            console.error('Gagal mengganti nama:', error);
        } finally {
            cancelEditing();
        }
    };

    const rootClass =
        variant === 'sheet'
            ? 'flex h-full w-full flex-col bg-[var(--card)]'
            : 'flex h-full w-72 flex-col border-r border-[var(--border-strong)] bg-[var(--card)]';

    return (
        <aside className={rootClass}>
            <div className="flex h-16 items-center border-b border-[var(--border-strong)] px-4">
                <CreateButton label={t('shared.chatbot.history.newChatButton')} onClick={onNewChat} className="w-full" />
            </div>

            <div className="flex-1 overflow-auto pr-1">
                <div className="px-4 py-3 text-xs font-semibold text-[var(--grey-text-muted)]">{t('shared.chatbot.history.historyLabel')}</div>

                {conversations.length === 0 && (
                    <p className="px-4 py-2 text-sm text-[var(--grey-text-muted)]">{t('shared.chatbot.history.emptyState')}</p>
                )}

                {conversations.map((conv) => {
                    const isEditing = editingId === conv.id;

                    return (
                        <div
                            key={conv.id}
                            onClick={() => !isEditing && onSelect(conv.id)}
                            className={`group flex w-full items-center gap-2 px-4 py-3 ${isEditing ? '' : 'cursor-pointer hover:bg-[var(--second-accent)]'} ${
                                conv.id === activeConversationId ? 'bg-[var(--surface-badge)]' : ''
                            } ${deletingId === conv.id ? 'opacity-50' : ''}`}
                        >
                            {isEditing ? (
                                <input
                                    aria-label={t('shared.chatbot.history.renameAriaLabel')}
                                    autoFocus
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') commitRename(conv.id);
                                        if (e.key === 'Escape') cancelEditing();
                                    }}
                                    onBlur={() => commitRename(conv.id)}
                                    className="flex-1 rounded border border-[var(--secondary-600)] bg-[var(--card)] px-1 py-0.5 text-sm text-[var(--subheading)] outline-none"
                                />
                            ) : (
                                <span
                                    onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        startEditing(conv);
                                    }}
                                    className="flex-1 truncate text-left text-[var(--subheading)]"
                                >
                                    {conv.title}
                                </span>
                            )}

                            {!isEditing && (
                                <ConversationMenu
                                    onDelete={() => handleDelete(conv.id)}
                                    onRename={() => startEditing(conv)}
                                    forceVisible={conv.id === activeConversationId}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
