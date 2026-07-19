import { useLanguage } from '@/hooks';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { AuthUser, Broadcast, Note } from '../types';

interface InfoPanelProps {
    broadcasts: Broadcast[];
    notes: Note[];
    authUser: AuthUser;
    onCreateBroadcast: (content: string) => void;
    onCreateNote: (content: string) => void;
    onDeleteNote: (id: number) => void;
    variant?: 'sidebar' | 'sheet';
}

function formatTime(isoString: string, locale: 'id' | 'en'): string {
    return new Date(isoString).toLocaleTimeString(locale === 'en' ? 'en-US' : 'id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function InfoPanel({ broadcasts, notes, authUser, onCreateBroadcast, onCreateNote, onDeleteNote, variant = 'sidebar' }: InfoPanelProps) {
    const { locale, t } = useLanguage();
    const [broadcastOpen, setBroadcastOpen] = useState(true);
    const [noteOpen, setNoteOpen] = useState(true);
    const [newBroadcast, setNewBroadcast] = useState('');
    const [newNote, setNewNote] = useState('');
    const [showBroadcastInput, setShowBroadcastInput] = useState(false);
    const [showNoteInput, setShowNoteInput] = useState(false);

    const canBroadcast = authUser.role === 'owner' || authUser.role === 'branch_manager';

    const handleSendBroadcast = () => {
        if (!newBroadcast.trim()) return;
        onCreateBroadcast(newBroadcast.trim());
        setNewBroadcast('');
        setShowBroadcastInput(false);
    };

    const handleSaveNote = () => {
        if (!newNote.trim()) return;
        onCreateNote(newNote.trim());
        setNewNote('');
        setShowNoteInput(false);
    };

    const textareaClass =
        'w-full resize-none rounded-lg border border-[var(--border-strong)] bg-[var(--page-bg)] px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[var(--border-strong)]';
    const btnPrimaryClass =
        'rounded-lg bg-[var(--surface-header)] px-3 py-1.5 text-xs font-medium text-[var(--text-light)] hover:bg-[var(--surface-header-hover)]';
    const btnGhostClass =
        'rounded-lg border border-[var(--border-strong)] px-3 py-1.5 text-xs font-medium text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:hover:bg-[var(--border-strong)]';

    const rootClass =
        variant === 'sheet'
            ? 'flex h-full w-full flex-col overflow-y-auto bg-[var(--neutral-white)] dark:bg-[var(--card)]'
            : 'hidden h-full w-72 flex-shrink-0 flex-col overflow-y-auto border-l border-[var(--border-strong)] bg-[var(--neutral-white)] dark:bg-[var(--card)] lg:flex';

    return (
        <div className={rootClass}>
            <div className="border-b border-[var(--border-strong)]">
                <button
                    aria-label={t('dashboardAdvance.messaging.infoPanel.toggleBroadcastAriaLabel')}
                    onClick={() => setBroadcastOpen(!broadcastOpen)}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[var(--subheading)]"
                >
                    <span>{t('dashboardAdvance.messaging.infoPanel.generalInfo')}</span>
                    {broadcastOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {broadcastOpen && (
                    <div className="px-4 pb-4">
                        {canBroadcast && (
                            <div className="mb-3">
                                {showBroadcastInput ? (
                                    <div className="flex flex-col gap-2">
                                        <textarea
                                            aria-label={t('dashboardAdvance.messaging.infoPanel.writeBroadcastAriaLabel')}
                                            value={newBroadcast}
                                            onChange={(e) => setNewBroadcast(e.target.value)}
                                            placeholder={t('dashboardAdvance.messaging.infoPanel.broadcastPlaceholder')}
                                            rows={3}
                                            className={textareaClass}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                aria-label={t('dashboardAdvance.messaging.infoPanel.cancelBroadcastAriaLabel')}
                                                onClick={() => {
                                                    setShowBroadcastInput(false);
                                                    setNewBroadcast('');
                                                }}
                                                className={btnGhostClass}
                                            >
                                                {t('dashboardAdvance.messaging.infoPanel.cancel')}
                                            </button>
                                            <button
                                                aria-label={t('dashboardAdvance.messaging.infoPanel.sendBroadcastAriaLabel')}
                                                onClick={handleSendBroadcast}
                                                className={btnPrimaryClass}
                                            >
                                                {t('dashboardAdvance.messaging.infoPanel.send')}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        aria-label={t('dashboardAdvance.messaging.infoPanel.newBroadcastAriaLabel')}
                                        onClick={() => setShowBroadcastInput(true)}
                                        className="flex w-full items-center gap-1.5 rounded-lg border border-dashed border-[var(--border-strong)] px-3 py-2 text-xs text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:hover:bg-[var(--border-strong)]"
                                    >
                                        <Plus className="h-3 w-3" />
                                        {t('dashboardAdvance.messaging.infoPanel.newBroadcastButton')}
                                    </button>
                                )}
                            </div>
                        )}

                        {broadcasts.length === 0 ? (
                            <p className="py-4 text-center text-xs text-[var(--grey-text-muted)]">
                                {t('dashboardAdvance.messaging.infoPanel.emptyBroadcasts')}
                            </p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {broadcasts.map((b) => (
                                    <div key={b.id} className="rounded-xl border border-[var(--border-strong)] bg-[var(--page-bg)] p-3">
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-xs font-medium text-[var(--subheading)]">{b.sender.name}</span>
                                            <span className="text-xs text-[var(--grey-text-muted)]">{formatTime(b.created_at, locale)}</span>
                                        </div>
                                        <p className="text-xs leading-relaxed text-[var(--grey-text)]">{b.content}</p>
                                        {b.branch_id === null && (
                                            <span className="mt-1.5 inline-block rounded-full bg-[var(--surface-header)] px-2 py-0.5 text-xs text-[var(--text-light)]">
                                                {t('dashboardAdvance.messaging.infoPanel.allBranchesBadge')}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div>
                <button
                    aria-label={t('dashboardAdvance.messaging.infoPanel.toggleNoteAriaLabel')}
                    onClick={() => setNoteOpen(!noteOpen)}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[var(--subheading)]"
                >
                    <span>{t('dashboardAdvance.messaging.infoPanel.note')}</span>
                    {noteOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {noteOpen && (
                    <div className="px-4 pb-4">
                        <div className="mb-3">
                            {showNoteInput ? (
                                <div className="flex flex-col gap-2">
                                    <textarea
                                        aria-label={t('dashboardAdvance.messaging.infoPanel.writeNoteAriaLabel')}
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder={t('dashboardAdvance.messaging.infoPanel.notePlaceholder')}
                                        rows={3}
                                        className={textareaClass}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            aria-label={t('dashboardAdvance.messaging.infoPanel.cancelNoteAriaLabel')}
                                            onClick={() => {
                                                setShowNoteInput(false);
                                                setNewNote('');
                                            }}
                                            className={btnGhostClass}
                                        >
                                            {t('dashboardAdvance.messaging.infoPanel.cancel')}
                                        </button>
                                        <button
                                            aria-label={t('dashboardAdvance.messaging.infoPanel.saveNoteAriaLabel')}
                                            onClick={handleSaveNote}
                                            className={btnPrimaryClass}
                                        >
                                            {t('dashboardAdvance.messaging.infoPanel.save')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    aria-label={t('dashboardAdvance.messaging.infoPanel.newNoteAriaLabel')}
                                    onClick={() => setShowNoteInput(true)}
                                    className="flex w-full items-center gap-1.5 rounded-lg border border-dashed border-[var(--border-strong)] px-3 py-2 text-xs text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:hover:bg-[var(--border-strong)]"
                                >
                                    <Plus className="h-3 w-3" />
                                    {t('dashboardAdvance.messaging.infoPanel.newNoteButton')}
                                </button>
                            )}
                        </div>

                        {notes.length === 0 ? (
                            <p className="py-4 text-center text-xs text-[var(--grey-text-muted)]">
                                {t('dashboardAdvance.messaging.infoPanel.emptyNotes')}
                            </p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {notes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="group relative rounded-xl border border-[var(--border-strong)] bg-[var(--page-bg)] p-3"
                                    >
                                        <p className="text-xs leading-relaxed text-[var(--grey-text)]">{note.content}</p>
                                        <button
                                            aria-label={t('dashboardAdvance.messaging.infoPanel.deleteNoteAriaLabel')}
                                            onClick={() => onDeleteNote(note.id)}
                                            className="absolute top-2 right-2 hidden text-[var(--grey-text-muted)] group-hover:block hover:text-red-500"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
