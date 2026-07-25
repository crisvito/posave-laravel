import { NotificationBadge } from '@/components';
import { useLanguage } from '@/hooks';
import { Link } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';

interface WidgetMember {
    id: number;
    name: string;
}

interface WidgetConversation {
    id: number;
    name: string | null;
    type: 'group' | 'private';
    members: WidgetMember[];
    latest_message: {
        body: string | null;
        sender: { id: number; name: string };
        created_at: string;
    } | null;
    unread_count: number;
}

interface MessagingWidgetProps {
    items: WidgetConversation[];
    totalUnread: number;
    authUserId: number;
    className?: string;
}

function getConversationName(conv: WidgetConversation, authUserId: number, fallbackGroup: string, fallbackUser: string): string {
    if (conv.type === 'group') return conv.name ?? fallbackGroup;
    const other = conv.members.find((m) => m.id !== authUserId);
    return other?.name ?? fallbackUser;
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

export function MessagingWidget({ items, totalUnread, authUserId, className = '' }: MessagingWidgetProps) {
    const { locale, t } = useLanguage();

    return (
        <div className={`rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] p-5 shadow-sm ${className}`}>
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[var(--subheading)]">{t('dashboardAdvance.dashboard.messaging.title')}</h3>
                    <NotificationBadge count={totalUnread} />
                </div>
                <Link href={route('messaging.index')} className="text-xs font-medium text-[var(--secondary-600)] hover:underline">
                    {t('dashboardAdvance.dashboard.messaging.viewAll')}
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <MessageCircle className="h-8 w-8 text-[var(--grey-text-muted)]" />
                    <p className="text-sm text-[var(--grey-text)]">{t('dashboardAdvance.dashboard.messaging.empty')}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {items.map((conv) => {
                        const name = getConversationName(
                            conv,
                            authUserId,
                            t('dashboardAdvance.dashboard.messaging.groupFallback'),
                            t('dashboardAdvance.dashboard.messaging.userFallback'),
                        );
                        const isUnread = conv.unread_count > 0;

                        return (
                            <Link
                                key={conv.id}
                                href={route('messaging.index')}
                                className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[var(--second-accent)]"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-header)] text-xs font-medium text-white">
                                    {conv.type === 'group' ? '👥' : name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span
                                            className={`truncate text-sm ${isUnread ? 'font-bold text-[var(--subheading)]' : 'font-medium text-[var(--subheading)]'}`}
                                        >
                                            {name}
                                        </span>
                                        {conv.latest_message && (
                                            <span className="shrink-0 text-[11px] text-[var(--grey-text-muted)]">
                                                {formatTime(conv.latest_message.created_at, locale)}
                                            </span>
                                        )}
                                    </div>
                                    {conv.latest_message && (
                                        <p
                                            className={`truncate text-xs ${isUnread ? 'font-semibold text-[var(--subheading)]' : 'text-[var(--grey-text-muted)]'}`}
                                        >
                                            {conv.latest_message.sender.id === authUserId
                                                ? `${t('dashboardAdvance.dashboard.messaging.youPrefix')} `
                                                : ''}
                                            {conv.latest_message.body ?? t('dashboardAdvance.dashboard.messaging.fileFallback')}
                                        </p>
                                    )}
                                </div>
                                {isUnread && <NotificationBadge count={conv.unread_count} />}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
