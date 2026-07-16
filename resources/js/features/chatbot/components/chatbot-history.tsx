import { CreateButton } from '@/components';
import { deleteConversation, renameConversation } from '@/features/chatbot/api';
import { ConversationMenu } from '@/features/chatbot/components';
import { MessageSquare } from 'lucide-react';
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
            ? 'flex h-full w-full flex-col bg-white dark:bg-[var(--card)]'
            : 'flex h-full w-72 flex-col border-r bg-white dark:bg-[var(--card)] dark:border-[var(--border-strong)]';

    return (
        <aside className={rootClass}>
            <div className="flex h-16 items-center border-b px-4 dark:border-[var(--border-strong)]">
                <CreateButton label="Chat Baru" onClick={onNewChat} className="w-full" />
            </div>

            <div className="flex-1 overflow-auto pr-1">
                <div className="px-4 py-3 text-xs font-semibold text-slate-400 dark:text-[var(--muted-foreground)]">Riwayat</div>

                {conversations.length === 0 && (
                    <p className="px-4 py-2 text-sm text-slate-400 dark:text-[var(--muted-foreground)]">Belum ada percakapan.</p>
                )}

                {conversations.map((conv) => {
                    const isEditing = editingId === conv.id;

                    return (
                        <div
                            key={conv.id}
                            onClick={() => !isEditing && onSelect(conv.id)}
                            className={`group flex w-full items-center gap-2 px-4 py-3 ${isEditing ? '' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-[var(--border-strong)]'} ${
                                conv.id === activeConversationId ? 'bg-slate-200 dark:bg-[var(--border-strong)]' : ''
                            } ${deletingId === conv.id ? 'opacity-50' : ''}`}
                        >
                            <MessageSquare size={16} className="shrink-0 dark:text-white" />

                            {isEditing ? (
                                <input
                                    aria-label="Ganti nama percakapan"
                                    autoFocus
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') commitRename(conv.id);
                                        if (e.key === 'Escape') cancelEditing();
                                    }}
                                    onBlur={() => commitRename(conv.id)}
                                    className="flex-1 rounded border border-blue-400 bg-white px-1 py-0.5 text-sm outline-none dark:border-blue-600 dark:bg-[#111827] dark:text-white"
                                />
                            ) : (
                                <span
                                    onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        startEditing(conv);
                                    }}
                                    className="flex-1 truncate text-left dark:text-white"
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
