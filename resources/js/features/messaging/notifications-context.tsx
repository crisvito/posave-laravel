import { usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import axios from 'axios';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

interface IncomingMessage {
    id: number;
    conversation_id: number;
    body: string | null;
    sender: { id: number; name: string };
    attachments: { id: number; file_name: string; file_type: string; url: string }[];
    created_at: string;
}

interface MessagingNotificationsContextValue {
    unreadCount: number;
    activeConversationId: number | null;
    setActiveConversationId: (id: number | null, previousUnreadCount?: number) => void;
    lastMessageEvent: IncomingMessage | null;
}

const MessagingNotificationsContext = createContext<MessagingNotificationsContextValue | null>(null);

export function MessagingNotificationsProvider({ children }: { children: ReactNode }) {
    const { props } = usePage() as { props: { auth?: { user?: { id: number } | null }; unread_message_count?: number } };
    const authUserId = props.auth?.user?.id ?? null;

    const [unreadCount, setUnreadCount] = useState(props.unread_message_count ?? 0);
    const [activeConversationId, setActiveConversationIdState] = useState<number | null>(null);
    const [lastMessageEvent, setLastMessageEvent] = useState<IncomingMessage | null>(null);
    const activeConversationIdRef = useRef(activeConversationId);
    activeConversationIdRef.current = activeConversationId;

    // Sinkron ulang tiap kali props Inertia berubah (misal abis pindah halaman) — jaring pengaman
    // kalau ada event yang somehow ke-miss pas gak lagi buka tab/koneksi terputus sebentar.
    useEffect(() => {
        setUnreadCount(props.unread_message_count ?? 0);
    }, [props.unread_message_count]);

    useEcho<IncomingMessage>(
        authUserId ? `App.Models.User.${authUserId}` : 'App.Models.User.0',
        '.message.sent',
        (data) => {
            if (data.sender.id === authUserId) return;

            setLastMessageEvent(data);

            const isViewingThisConversation = activeConversationIdRef.current === data.conversation_id;

            if (isViewingThisConversation) {
                // Lagi dibuka — anggap langsung terbaca, JANGAN nambah badge sama sekali.
                axios.post(route('messaging.mark-read', data.conversation_id)).catch(() => {});
                return;
            }

            setUnreadCount((prev) => prev + 1);
        },
        [authUserId],
    );

    const setActiveConversationId = (id: number | null, previousUnreadCount = 0) => {
        setActiveConversationIdState(id);

        if (id !== null) {
            if (previousUnreadCount > 0) {
                setUnreadCount((prev) => Math.max(0, prev - previousUnreadCount));
            }
            axios.post(route('messaging.mark-read', id)).catch(() => {});
        }
    };

    return (
        <MessagingNotificationsContext.Provider value={{ unreadCount, activeConversationId, setActiveConversationId, lastMessageEvent }}>
            {children}
        </MessagingNotificationsContext.Provider>
    );
}

export function useMessagingNotifications() {
    const context = useContext(MessagingNotificationsContext);
    if (!context) {
        throw new Error('useMessagingNotifications must be used within a MessagingNotificationsProvider.');
    }
    return context;
}
