import type { Message } from '../types';

interface MessageBubbleProps {
    message: Message;
}

function formatTime(isoString: string): string {
    return new Date(isoString).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isMine = message.is_mine;

    return (
        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[65%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {!isMine && (
                    <span className="px-1 text-xs font-medium text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                        {message.sender.name}
                    </span>
                )}

                <div
                    className={`rounded-2xl px-4 py-2.5 ${
                        isMine
                            ? 'rounded-tr-sm bg-[var(--surface-header)] text-white'
                            : 'rounded-tl-sm border border-[var(--border-strong)] bg-[var(--neutral-white)] text-[var(--subheading)] dark:border-[var(--border-strong)] dark:bg-[#1f2937] dark:text-white'
                    }`}
                >
                    {message.body && <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.body}</p>}

                    {message.attachments.length > 0 && (
                        <div className="mt-2 flex flex-col gap-2">
                            {message.attachments.map((attachment) => (
                                <div key={attachment.id}>
                                    {attachment.file_type.startsWith('image/') ? (
                                        <img src={attachment.url} alt={attachment.file_name} className="max-h-48 w-full rounded-lg object-cover" />
                                    ) : (
                                        <a
                                            href={attachment.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                                                isMine
                                                    ? 'border-white/20 text-white hover:bg-white/10'
                                                    : 'border-[var(--border-strong)] text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:border-[var(--border-strong)] dark:text-white dark:hover:bg-[var(--border-strong)]'
                                            }`}
                                        >
                                            <span>📎</span>
                                            <span className="truncate">{attachment.file_name}</span>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <span className="px-1 text-xs text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]">
                    {formatTime(message.created_at)}
                </span>
            </div>
        </div>
    );
}
