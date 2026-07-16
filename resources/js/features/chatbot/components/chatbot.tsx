import { Sheet, SheetContent } from '@/components/ui';
import { ChatBody, ChatHeader, ChatHistory, ChatInput } from '@/features/chatbot/components';
import { useChatMessages, useChatbot } from '@/features/chatbot/hooks';
import { useEffect, useState } from 'react';

export function Chatbot() {
    const { isOpen, close } = useChatbot();
    const {
        messages,
        conversations,
        activeConversationId,
        isLoadingHistory,
        isWaitingReply,
        sendMessage,
        loadConversations,
        selectConversation,
        appendAssistantMessage,
        startNewConversation,
    } = useChatMessages();

    const [historyOpen, setHistoryOpen] = useState(false);

    useEffect(() => {
        if (isOpen) loadConversations();
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSelect = (id: number) => {
        selectConversation(id);
        setHistoryOpen(false);
    };

    const handleNewChat = () => {
        startNewConversation();
        setHistoryOpen(false);
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60" onClick={close} />
            <div className="fixed inset-0 z-50 flex flex-col border-l bg-white shadow-2xl lg:top-0 lg:right-0 lg:left-auto lg:h-screen lg:w-[900px] lg:flex-row dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
                <div className="hidden lg:flex">
                    <ChatHistory
                        conversations={conversations}
                        activeConversationId={activeConversationId}
                        onSelect={selectConversation}
                        onNewChat={startNewConversation}
                        onListChanged={loadConversations}
                        variant="sidebar"
                    />
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">
                    <ChatHeader onOpenHistory={() => setHistoryOpen(true)} />
                    <ChatBody
                        messages={messages}
                        isLoadingHistory={isLoadingHistory}
                        isWaitingReply={isWaitingReply}
                        conversationId={activeConversationId}
                        onFormSubmitted={appendAssistantMessage}
                    />
                    <ChatInput onSend={sendMessage} isLoading={isWaitingReply} />
                </div>
            </div>

            <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
                <SheetContent
                    side="left"
                    className="w-[85vw] border-[var(--border-strong)] bg-white p-0 sm:max-w-[320px] lg:hidden dark:bg-[var(--card)]"
                >
                    <ChatHistory
                        conversations={conversations}
                        activeConversationId={activeConversationId}
                        onSelect={handleSelect}
                        onNewChat={handleNewChat}
                        onListChanged={loadConversations}
                        variant="sheet"
                    />
                </SheetContent>
            </Sheet>
        </>
    );
}
