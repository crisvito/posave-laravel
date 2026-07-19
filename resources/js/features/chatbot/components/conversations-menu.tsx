import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface ConversationMenuProps {
    onDelete: () => void;
    onRename: () => void;
    forceVisible?: boolean;
}

export function ConversationMenu({ onDelete, onRename, forceVisible = false }: ConversationMenuProps) {
    const { t } = useLanguage();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className={`h-7 w-7 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 ${forceVisible ? 'lg:opacity-100' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreVertical size={14} />
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    className="z-50 min-w-[140px] rounded-md border border-[var(--border-strong)] bg-[var(--card)] p-1 shadow-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenu.Item
                        onSelect={onRename}
                        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-[var(--subheading)] outline-none hover:bg-[var(--second-accent)]"
                    >
                        <Pencil size={14} />
                        {t('shared.chatbot.conversationMenu.rename')}
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        onSelect={onDelete}
                        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-[var(--danger)] outline-none hover:bg-[var(--danger-background)]"
                    >
                        <Trash2 size={14} />
                        {t('shared.chatbot.conversationMenu.delete')}
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
