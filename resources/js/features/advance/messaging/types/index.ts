export interface ConversationMember {
    id: number;
    name: string;
}

export interface MessageAttachment {
    id: number;
    file_name: string;
    file_type: string;
    url: string;
}

export interface Message {
    id: number;
    body: string | null;
    sender: ConversationMember;
    attachments: MessageAttachment[];
    created_at: string;
    is_mine: boolean;
}

export interface Conversation {
    id: number;
    name: string | null;
    type: 'private' | 'group';
    members: ConversationMember[];
    latest_message?: {
        body: string | null;
        sender: ConversationMember;
        created_at: string;
    } | null;
    unread_count: number
}

export interface Broadcast {
    id: number;
    content: string;
    sender: ConversationMember;
    branch_id: number | null;
    created_at: string;
}

export interface Note {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface Contact {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface AuthUser {
    id: number;
    name: string;
    role: string;
    company_id: number;
}