import { useLanguage } from '@/hooks';
import { Info, MessageCircle, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Contact, Conversation } from '../types';

interface ConversationListProps {
    conversations: Conversation[];
    contacts: Contact[];
    activeTab: 'pesan' | 'kontak' | 'info';
    activeConversationId: number | null;
    authUserId: number;
    onTabChange: (tab: 'pesan' | 'kontak' | 'info') => void;
    onSelectConversation: (id: number) => void;
    onStartPrivateChat: (userId: number) => void;
    search: string;
    onSearchChange: (value: string) => void;
    infoPanel: ReactNode;
}

function formatTime(isoString: string, locale: 'id' | 'en'): string {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const dateLocale = locale === 'en' ? 'en-US' : 'id-ID';

    if (diff < 86400000) {
        return date.toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' });
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
    infoPanel,
}: ConversationListProps) {
    const { locale, t } = useLanguage();

    const getConversationName = (conv: Conversation): string => {
        if (conv.type === 'group') return conv.name ?? t('dashboardAdvance.messaging.conversationList.groupFallback');
        const other = conv.members.find((m) => m.id !== authUserId);
        return other?.name ?? t('dashboardAdvance.messaging.conversationList.unknownFallback');
    };

    const filteredConversations = conversations.filter((c) => getConversationName(c).toLowerCase().includes(search.toLowerCase()));

    const filteredContacts = contacts.filter(
        (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="flex h-full flex-col border-r border-[var(--border-strong)] bg-[var(--neutral-white)] dark:bg-[var(--card)]">
            <div className="flex h-15 gap-2 border-b border-[var(--border-strong)] p-3">
                <button
                    aria-label={t('dashboardAdvance.messaging.conversationList.tabMessagesAriaLabel')}
                    onClick={() => onTabChange('pesan')}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all ${
                        activeTab === 'pesan'
                            ? 'bg-[var(--surface-header)] text-white'
                            : 'text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:hover:bg-[var(--border-strong)]'
                    }`}
                >
                    <MessageCircle className="h-4 w-4" />
                    {t('dashboardAdvance.messaging.conversationList.tabMessages')}
                </button>
                <button
                    aria-label={t('dashboardAdvance.messaging.conversationList.tabContactsAriaLabel')}
                    onClick={() => onTabChange('kontak')}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all ${
                        activeTab === 'kontak'
                            ? 'bg-[var(--surface-header)] text-white'
                            : 'text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:hover:bg-[var(--border-strong)]'
                    }`}
                >
                    <Users className="h-4 w-4" />
                    {t('dashboardAdvance.messaging.conversationList.tabContacts')}
                </button>
                <button
                    aria-label={t('dashboardAdvance.messaging.conversationList.tabInfoAriaLabel')}
                    onClick={() => onTabChange('info')}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all lg:hidden ${
                        activeTab === 'info'
                            ? 'bg-[var(--surface-header)] text-white'
                            : 'text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:hover:bg-[var(--border-strong)]'
                    }`}
                >
                    <Info className="h-4 w-4" />
                    {t('dashboardAdvance.messaging.conversationList.tabInfo')}
                </button>
            </div>

            {activeTab !== 'info' && (
                <div className="p-3">
                    <input
                        type="text"
                        aria-label={t('dashboardAdvance.messaging.conversationList.searchAriaLabel')}
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={t('dashboardAdvance.messaging.conversationList.searchPlaceholder')}
                        className="h-9 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--page-bg)] px-3 text-sm outline-none focus:ring-1 focus:ring-[var(--border-strong)]"
                    />
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'info' ? (
                    infoPanel
                ) : activeTab === 'pesan' ? (
                    filteredConversations.length === 0 ? (
                        <p className="py-10 text-center text-sm text-[var(--grey-text-muted)]">
                            {t('dashboardAdvance.messaging.conversationList.emptyConversations')}
                        </p>
                    ) : (
                        filteredConversations.map((conv) => {
                            const name = getConversationName(conv);
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
                                    aria-label={`${t('dashboardAdvance.messaging.conversationList.openConversationAriaLabel')} ${name}`}
                                    onClick={() => onSelectConversation(conv.id)}
                                    className={`flex w-full items-center gap-3 border-l-4 px-3.5 py-3 text-left transition-all ${
                                        isActive
                                            ? 'border-[var(--secondary-600)] bg-[var(--secondary-600)]/10'
                                            : 'border-transparent hover:bg-[var(--second-accent)] dark:hover:bg-[var(--border-strong)]'
                                    }`}
                                >
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--surface-header)] text-xs font-medium text-white">
                                        {conv.type === 'group' ? '👥' : initials}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="truncate text-sm font-medium text-[var(--subheading)]">{name}</span>
                                            {conv.latest_message && (
                                                <span className="ml-2 flex-shrink-0 text-xs text-[var(--grey-text-muted)]">
                                                    {formatTime(conv.latest_message.created_at, locale)}
                                                </span>
                                            )}
                                        </div>
                                        {conv.latest_message && (
                                            <p className="truncate text-xs text-[var(--grey-text-muted)]">
                                                {conv.latest_message.sender.id === authUserId
                                                    ? t('dashboardAdvance.messaging.conversationList.youPrefix')
                                                    : ''}
                                                {conv.latest_message.body ?? t('dashboardAdvance.messaging.conversationList.fileFallback')}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    )
                ) : filteredContacts.length === 0 ? (
                    <p className="py-10 text-center text-sm text-[var(--grey-text-muted)]">
                        {t('dashboardAdvance.messaging.conversationList.emptyContacts')}
                    </p>
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
                                aria-label={`${t('dashboardAdvance.messaging.conversationList.startChatAriaLabel')} ${contact.name}`}
                                onClick={() => onStartPrivateChat(contact.id)}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-all hover:bg-[var(--second-accent)] dark:hover:bg-[var(--border-strong)]"
                            >
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--surface-header)] text-xs font-medium text-white">
                                    {initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-[var(--subheading)]">{contact.name}</p>
                                    <p className="truncate text-xs text-[var(--grey-text-muted)]">{contact.role}</p>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
