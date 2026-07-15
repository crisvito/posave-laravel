import type { Contact, Conversation } from '../types';

interface ConversationListProps {
    conversations: Conversation[];
    contacts: Contact[];
    activeTab: 'pesan' | 'kontak';
    activeConversationId: number | null;
    authUserId: number;
    onTabChange: (tab: 'pesan' | 'kontak') => void;
    onSelectConversation: (id: number) => void;
    onStartPrivateChat: (userId: number) => void;
    search: string;
    onSearchChange: (value: string) => void;
}

function formatTime(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 86400000) {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function getConversationName(conv: Conversation, authUserId: number): string {
    if (conv.type === 'group') return conv.name ?? 'Group';
    const other = conv.members.find((m) => m.id !== authUserId);
    return other?.name ?? 'Unknown';
}

export function ConversationList({
    conversations,
    contacts,
    activeTab,
    activeConversationId,
    authUserId,
    onTabChange,
    onSelectConversation,
    onStartPrivateChat,
    search,
    onSearchChange,
}: ConversationListProps) {
    const filteredConversations = conversations.filter((c) => getConversationName(c, authUserId).toLowerCase().includes(search.toLowerCase()));

    const filteredContacts = contacts.filter(
        (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="flex h-full flex-col border-r border-[var(--border-strong)] bg-[var(--neutral-white)] dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
            <div className="flex gap-2 border-b border-[var(--border-strong)] p-3 dark:border-[var(--border-strong)]">
                <button
                    aria-label="Tab Pesan"
                    onClick={() => onTabChange('pesan')}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                        activeTab === 'pesan'
                            ? 'bg-[var(--surface-header)] text-white'
                            : 'text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:text-[var(--muted-foreground)] dark:hover:bg-[var(--border-strong)]'
                    }`}
                >
                    Pesan
                </button>
                <button
                    aria-label="Tab Kontak"
                    onClick={() => onTabChange('kontak')}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                        activeTab === 'kontak'
                            ? 'bg-[var(--surface-header)] text-white'
                            : 'text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:text-[var(--muted-foreground)] dark:hover:bg-[var(--border-strong)]'
                    }`}
                >
                    Kontak
                </button>
            </div>

            <div className="p-3">
                <input
                    type="text"
                    aria-label="Cari percakapan atau kontak"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Cari..."
                    className="h-9 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--page-bg)] px-3 text-sm outline-none focus:ring-1 focus:ring-[var(--border-strong)] dark:border-[var(--border-strong)] dark:bg-[#111827] dark:text-white"
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'pesan' ? (
                    filteredConversations.length === 0 ? (
                        <p className="py-10 text-center text-sm text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]">
                            Belum ada percakapan
                        </p>
                    ) : (
                        filteredConversations.map((conv) => {
                            const name = getConversationName(conv, authUserId);
                            const isActive = conv.id === activeConversationId;
                            const initials = name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase();

                            return (
                                <button
                                    key={conv.id}
                                    aria-label={`Buka percakapan dengan ${name}`}
                                    onClick={() => onSelectConversation(conv.id)}
                                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all hover:bg-[var(--second-accent)] dark:hover:bg-[var(--border-strong)] ${
                                        isActive ? 'bg-[var(--second-accent)] dark:bg-[var(--border-strong)]' : ''
                                    }`}
                                >
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--surface-header)] text-xs font-medium text-white">
                                        {conv.type === 'group' ? '👥' : initials}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="truncate text-sm font-medium text-[var(--subheading)] dark:text-white">{name}</span>
                                            {conv.latest_message && (
                                                <span className="ml-2 flex-shrink-0 text-xs text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]">
                                                    {formatTime(conv.latest_message.created_at)}
                                                </span>
                                            )}
                                        </div>
                                        {conv.latest_message && (
                                            <p className="truncate text-xs text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]">
                                                {conv.latest_message.sender.id === authUserId ? 'Kamu: ' : ''}
                                                {conv.latest_message.body ?? '📎 File'}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    )
                ) : filteredContacts.length === 0 ? (
                    <p className="py-10 text-center text-sm text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]">Tidak ada kontak</p>
                ) : (
                    filteredContacts.map((contact) => {
                        const initials = contact.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase();

                        return (
                            <button
                                key={contact.id}
                                aria-label={`Mulai chat dengan ${contact.name}`}
                                onClick={() => onStartPrivateChat(contact.id)}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-all hover:bg-[var(--second-accent)] dark:hover:bg-[var(--border-strong)]"
                            >
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--surface-header)] text-xs font-medium text-white">
                                    {initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-[var(--subheading)] dark:text-white">{contact.name}</p>
                                    <p className="truncate text-xs text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]">
                                        {contact.role}
                                    </p>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
