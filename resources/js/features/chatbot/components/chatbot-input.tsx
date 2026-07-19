import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks';
import { Send } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useState } from 'react';

interface ChatInputProps {
    onSend: (text: string) => void;
    isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
    const { t } = useLanguage();
    const [text, setText] = useState('');

    const handleSend = () => {
        if (!text.trim() || isLoading) return;
        onSend(text);
        setText('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="border-t border-[var(--border-strong)] p-3 sm:p-5">
            <div className="flex gap-2 sm:gap-3">
                <Input
                    placeholder={t('shared.chatbot.input.placeholder')}
                    className="h-12"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />

                <Button size="icon" className="h-12 w-12 shrink-0" onClick={handleSend} disabled={isLoading}>
                    <Send size={18} />
                </Button>
            </div>
        </div>
    );
}
