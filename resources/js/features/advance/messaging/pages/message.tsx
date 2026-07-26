import { Sheet, SheetContent } from '@/components/ui';
import { ChatArea, ConversationList, InfoPanel } from '@/features/advance/messaging/components';
import { useMessagingNotifications } from '@/features/messaging/notifications-context';
import { useConfirmAction, useLanguage } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { useEchoPresence, useEchoPublic } from '@laravel/echo-react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import type { AuthUser, Broadcast, Contact, Conversation, Message, Note } from '../types';

interface Props {
    conversations: Conversation[];
    broadcasts: Broadcast[];
    notes: Note[];
    contacts: Contact[];
    auth_user: AuthUser;
}

export default function MessagingIndex({
    conversations: initialConversations,
    broadcasts: initialBroadcasts,
    notes: initialNotes,
    contacts,
    auth_user,
}: Props) {
    const { t } = useLanguage();
    // const [activeTab, setActiveTab] = useState<'pesan' | 'kontak'>('pesan');
    const [activeTab, setActiveTab] = useState<'pesan' | 'kontak' | 'info'>('pesan');
    const [search, setSearch] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>(initialBroadcasts);
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const { activeConversationId, setActiveConversationId, lastMessageEvent } = useMessagingNotifications();
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const { confirmAndRun } = useConfirmAction();
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
    const [infoSheetOpen, setInfoSheetOpen] = useState(false);

    useEchoPublic<Broadcast>(
        `company.${auth_user.company_id}.broadcasts`,
        '.broadcast.created',
        (data) => {
            setBroadcasts((prev) => [data, ...prev]);
        },
        [auth_user.company_id],
    );

    useEchoPresence<Message>(
        (activeConversationId ? `conversation.${activeConversationId}` : null) as string,
        '.message.sent',
        (data) => {
            if (!activeConversationId) return;
            setMessages((prev) => [...prev, { ...data, is_mine: false }]);
        },
        [activeConversationId],
    );

    // Update daftar percakapan (preview + badge per-item) tiap kali ada pesan baru lewat
    // channel notifikasi pribadi — ini yang bikin list ke-update live tanpa refresh/pindah halaman.
    useEffect(() => {
        if (!lastMessageEvent) return;

        setConversations((prev) =>
            prev.map((c) => {
                if (c.id !== lastMessageEvent.conversation_id) return c;

                const isCurrentlyOpen = c.id === activeConversationId;

                return {
                    ...c,
                    latest_message: {
                        body: lastMessageEvent.body,
                        sender: lastMessageEvent.sender,
                        created_at: lastMessageEvent.created_at,
                    },
                    unread_count: isCurrentlyOpen ? 0 : (c.unread_count ?? 0) + 1,
                };
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastMessageEvent]);

    const selectConversation = useCallback(
        async (id: number) => {
            const conv = conversations.find((c) => c.id === id) ?? null;
            setActiveConversationId(id, conv?.unread_count ?? 0);
            setMobileView('chat');
            setIsLoadingMessages(true);
            setMessages([]);
            setActiveConversation(conv);
            setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread_count: 0 } : c)));

            try {
                const res = await axios.get(route('messaging.messages', id));
                setMessages(res.data.messages);
                setActiveConversation(res.data.conversation);
            } catch (err) {
                console.error('Gagal memuat pesan:', err);
            } finally {
                setIsLoadingMessages(false);
            }
        },
        [conversations, setActiveConversationId],
    );

    const handleBack = useCallback(() => {
        setMobileView('list');
        setActiveConversationId(null);
        setActiveConversation(null);
        setMessages([]);
    }, [setActiveConversationId]);

    const handleSendMessage = useCallback(
        async (body: string, files: File[]) => {
            if (!activeConversationId) return;

            const formData = new FormData();
            if (body) formData.append('body', body);
            files.forEach((f) => formData.append('attachments[]', f));

            const optimisticMsg: Message = {
                id: Date.now(),
                body,
                sender: { id: auth_user.id, name: auth_user.name },
                attachments: [],
                created_at: new Date().toISOString(),
                is_mine: true,
            };

            setMessages((prev) => [...prev, optimisticMsg]);
            setConversations((prev) =>
                prev.map((c) =>
                    c.id === activeConversationId
                        ? {
                              ...c,
                              latest_message: {
                                  body,
                                  sender: { id: auth_user.id, name: auth_user.name },
                                  created_at: new Date().toISOString(),
                              },
                          }
                        : c,
                ),
            );

            try {
                await axios.post(route('messaging.send', activeConversationId), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } catch (err) {
                console.error('Gagal mengirim pesan:', err);
                setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
            }
        },
        [activeConversationId, auth_user],
    );

    const handleStartPrivateChat = useCallback(
        async (userId: number) => {
            try {
                const res = await axios.post(route('messaging.private'), { user_id: userId });
                const convId = res.data.conversation_id as number;

                router.reload({ only: ['conversations'] });
                setActiveTab('pesan');
                setTimeout(() => selectConversation(convId), 300);
            } catch (err) {
                console.error('Gagal memulai chat:', err);
            }
        },
        [selectConversation],
    );

    const handleCreateBroadcast = useCallback(async (content: string) => {
        try {
            await axios.post(route('messaging.broadcast.store'), { content });
        } catch (err) {
            console.error('Gagal mengirim broadcast:', err);
        }
    }, []);

    const handleCreateNote = useCallback(async (content: string) => {
        try {
            const res = await axios.post(route('messaging.note.store'), { content });
            setNotes((prev) => [res.data, ...prev]);
        } catch (err) {
            console.error('Gagal menyimpan catatan:', err);
        }
    }, []);

    const handleDeleteNote = useCallback(
        (id: number) => {
            confirmAndRun(t('dashboardAdvance.messaging.deleteNoteConfirm'), async () => {
                try {
                    await axios.delete(route('messaging.note.destroy', id));
                    setNotes((prev) => prev.filter((n) => n.id !== id));
                } catch (err) {
                    console.error('Gagal menghapus catatan:', err);
                }
            });
        },
        [confirmAndRun, t],
    );

    return (
        <DashboardSidebarLayout title={t('dashboardAdvance.messaging.layoutTitle')} description={t('dashboardAdvance.messaging.layoutDescription')}>
            <Head title={t('dashboardAdvance.messaging.headTitle')} />

            <div className="flex h-[calc(100vh-100px)] overflow-hidden bg-[var(--page-bg)]">
                <div className={`h-full w-full flex-col lg:flex lg:w-72 lg:flex-shrink-0 ${mobileView === 'list' ? 'flex' : 'hidden'}`}>
                    <ConversationList
                        conversations={conversations}
                        contacts={contacts}
                        activeTab={activeTab}
                        activeConversationId={activeConversationId}
                        authUserId={auth_user.id}
                        onTabChange={setActiveTab}
                        onSelectConversation={selectConversation}
                        onStartPrivateChat={handleStartPrivateChat}
                        search={search}
                        onSearchChange={setSearch}
                        infoPanel={
                            <InfoPanel
                                broadcasts={broadcasts}
                                notes={notes}
                                authUser={auth_user}
                                onCreateBroadcast={handleCreateBroadcast}
                                onCreateNote={handleCreateNote}
                                onDeleteNote={handleDeleteNote}
                                variant="sheet"
                            />
                        }
                    />
                </div>

                <ChatArea
                    conversation={activeConversation}
                    messages={messages}
                    authUserId={auth_user.id}
                    isLoading={isLoadingMessages}
                    onSendMessage={handleSendMessage}
                    onBack={handleBack}
                    onOpenInfo={() => setInfoSheetOpen(true)}
                    className={mobileView === 'chat' ? 'flex flex-1' : 'hidden flex-1 lg:flex'}
                />

                <InfoPanel
                    broadcasts={broadcasts}
                    notes={notes}
                    authUser={auth_user}
                    onCreateBroadcast={handleCreateBroadcast}
                    onCreateNote={handleCreateNote}
                    onDeleteNote={handleDeleteNote}
                    variant="sidebar"
                />
            </div>

            <Sheet open={infoSheetOpen} onOpenChange={setInfoSheetOpen}>
                <SheetContent side="right" className="w-[85vw] border-[var(--border-strong)] bg-[var(--card)] p-0 sm:max-w-[360px]">
                    <InfoPanel
                        broadcasts={broadcasts}
                        notes={notes}
                        authUser={auth_user}
                        onCreateBroadcast={handleCreateBroadcast}
                        onCreateNote={handleCreateNote}
                        onDeleteNote={handleDeleteNote}
                        variant="sheet"
                    />
                </SheetContent>
            </Sheet>
        </DashboardSidebarLayout>
    );
}
