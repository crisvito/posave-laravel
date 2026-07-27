import { AskChatbotButton, SidebarTrigger } from '@/components';
import { useChatbot } from '@/features/chatbot';

interface AppSidebarHeaderProps {
    title?: string;
    description?: string;
}

export function AppSidebarHeader({ title, description }: AppSidebarHeaderProps) {
    const { open } = useChatbot();
    return (
        <header className="sticky top-0 z-[5] flex h-[100px] w-full items-center overflow-hidden border-b border-[var(--border-strong)] bg-[var(--neutral-white)] text-[var(--primary-700)] backdrop-blur dark:border-[var(--border-strong)] dark:bg-[var(--primary-900)] dark:text-white">
            <div className="flex w-full items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="mt-1" />

                    <div>
                        <h1 className="text-xl font-bold lg:text-3xl">{title}</h1>
                        <p className="mt-1 text-[12px] opacity-80 lg:text-sm">{description}</p>
                    </div>
                </div>

                <AskChatbotButton className="ml-auto" />
            </div>
        </header>
    );
}
