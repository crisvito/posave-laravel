import { Sheet, SheetContent } from '@/components/ui';
import { ChatArea, ConversationList, InfoPanel } from '@/features/advance/messaging/components';
import { useConfirmAction } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { useEchoPresence, useEchoPublic } from '@laravel/echo-react';
import axios from 'axios';
import { useCallback, useState } from 'react';
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
    const [activeTab, setActiveTab] = useState<'pesan' | 'kontak'>('pesan');
    const [search, setSearch] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>(initialBroadcasts);
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
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
        activeConversationId ? `conversation.${activeConversationId}` : 'conversation.0',
        '.message.sent',
        (data) => {
            if (!activeConversationId) return;

            setMessages((prev) => [...prev, { ...data, is_mine: false }]);

            setConversations((prev) =>
                prev.map((c) =>
                    c.id === activeConversationId
                        ? {
                              ...c,
                              latest_message: {
                                  body: data.body,
                                  sender: data.sender,
                                  created_at: data.created_at,
                              },
                          }
                        : c,
                ),
            );
        },
        [activeConversationId],
    );

    const selectConversation = useCallback(
        async (id: number) => {
            setActiveConversationId(id);
            setMobileView('chat');
            setIsLoadingMessages(true);
            setMessages([]);

            const conv = conversations.find((c) => c.id === id) ?? null;
            setActiveConversation(conv);

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
        [conversations],
    );

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

    const handleDeleteNote = useCallback((id: number) => {
        confirmAndRun('Hapus catatan ini?', async () => {
            try {
                await axios.delete(route('messaging.note.destroy', id));
                setNotes((prev) => prev.filter((n) => n.id !== id));
            } catch (err) {
                console.error('Gagal menghapus catatan:', err);
            }
        });
    }, []);

    return (
        <DashboardSidebarLayout title="Pesan" description="Buat pesan terhadap rekan-rekan anda">
            <Head title="Pesan" />

            <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[var(--page-bg)] dark:bg-[var(--background)]">
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
                    />
                </div>

                <ChatArea
                    conversation={activeConversation}
                    messages={messages}
                    authUserId={auth_user.id}
                    isLoading={isLoadingMessages}
                    onSendMessage={handleSendMessage}
                    onBack={() => setMobileView('list')}
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
