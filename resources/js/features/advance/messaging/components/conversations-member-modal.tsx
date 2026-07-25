import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks';
import type { Conversation } from '../types';

interface ConversationMembersModalProps {
    conversation: Conversation;
    authUserId: number;
    onClose: () => void;
}

export function ConversationMembersModal({ conversation, authUserId, onClose }: ConversationMembersModalProps) {
    const { t } = useLanguage();

    const isGroup = conversation.type === 'group';
    const title = isGroup ? t('dashboardAdvance.messaging.membersModal.groupTitle') : t('dashboardAdvance.messaging.membersModal.privateTitle');

    // Private: cuma tampilin lawan bicara. Grup: tampilin semua, termasuk diri sendiri.
    const displayMembers = isGroup ? conversation.members : conversation.members.filter((m) => m.id !== authUserId);

    return (
        <Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-1">
                    {displayMembers.map((member) => {
                        const initials = member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase();
                        const isSelf = member.id === authUserId;

                        return (
                            <div key={member.id} className="flex items-center gap-3 rounded-lg px-2 py-2">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-header)] text-xs font-medium text-white">
                                    {initials}
                                </div>
                                <span className="text-sm font-medium text-[var(--subheading)]">
                                    {member.name}
                                    {isSelf && ` (${t('dashboardAdvance.messaging.membersModal.youSuffix')})`}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
