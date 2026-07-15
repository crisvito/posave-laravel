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
    /** 'sidebar' = kolom ke-3 permanen (desktop), 'sheet' = konten di dalam Sheet mobile. */
    variant?: 'sidebar' | 'sheet';
}

function formatTime(isoString: string): string {
    return new Date(isoString).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function InfoPanel({ broadcasts, notes, authUser, onCreateBroadcast, onCreateNote, onDeleteNote, variant = 'sidebar' }: InfoPanelProps) {
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
        'w-full resize-none rounded-lg border border-[var(--border-strong)] bg-[var(--page-bg)] px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[var(--border-strong)] dark:bg-[#111827] dark:text-white dark:border-[var(--border-strong)]';
    const btnPrimaryClass =
        'rounded-lg bg-[var(--surface-header)] px-3 py-1.5 text-xs font-medium text-[var(--text-light)] hover:bg-[var(--surface-header-hover)] dark:bg-white dark:text-black dark:hover:bg-gray-200';
    const btnGhostClass =
        'rounded-lg border border-[var(--border-strong)] px-3 py-1.5 text-xs font-medium text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:text-white dark:border-[var(--border-strong)] dark:hover:bg-[var(--border-strong)]';

    const rootClass =
        variant === 'sheet'
            ? 'flex h-full w-full flex-col overflow-y-auto bg-[var(--neutral-white)] dark:bg-[var(--card)]'
            : 'hidden h-full w-72 flex-shrink-0 flex-col overflow-y-auto border-l border-[var(--border-strong)] bg-[var(--neutral-white)] dark:bg-[var(--card)] dark:border-[var(--border-strong)] lg:flex';

    return (
        <div className={rootClass}>
            <div className="border-b border-[var(--border-strong)] dark:border-[var(--border-strong)]">
                <button
                    aria-label="Toggle broadcast panel"
                    onClick={() => setBroadcastOpen(!broadcastOpen)}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[var(--subheading)] dark:text-white"
                >
                    <span>General Info</span>
                    {broadcastOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {broadcastOpen && (
                    <div className="px-4 pb-4">
                        {canBroadcast && (
                            <div className="mb-3">
                                {showBroadcastInput ? (
                                    <div className="flex flex-col gap-2">
                                        <textarea
                                            aria-label="Tulis broadcast"
                                            value={newBroadcast}
                                            onChange={(e) => setNewBroadcast(e.target.value)}
                                            placeholder="Tulis pengumuman..."
                                            rows={3}
                                            className={textareaClass}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                aria-label="Batal broadcast"
                                                onClick={() => {
                                                    setShowBroadcastInput(false);
                                                    setNewBroadcast('');
                                                }}
                                                className={btnGhostClass}
                                            >
                                                Batal
                                            </button>
                                            <button aria-label="Kirim broadcast" onClick={handleSendBroadcast} className={btnPrimaryClass}>
                                                Kirim
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        aria-label="Buat broadcast baru"
                                        onClick={() => setShowBroadcastInput(true)}
                                        className="flex w-full items-center gap-1.5 rounded-lg border border-dashed border-[var(--border-strong)] px-3 py-2 text-xs text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:border-[var(--border-strong)] dark:text-[var(--muted-foreground)] dark:hover:bg-[var(--border-strong)]"
                                    >
                                        <Plus className="h-3 w-3" />
                                        Buat Pengumuman
                                    </button>
                                )}
                            </div>
                        )}

                        {broadcasts.length === 0 ? (
                            <p className="py-4 text-center text-xs text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]">
                                Belum ada pengumuman
                            </p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {broadcasts.map((b) => (
                                    <div
                                        key={b.id}
                                        className="rounded-xl border border-[var(--border-strong)] bg-[var(--page-bg)] p-3 dark:border-[var(--border-strong)] dark:bg-[#111827]"
                                    >
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-xs font-medium text-[var(--subheading)] dark:text-white">{b.sender.name}</span>
                                            <span className="text-xs text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]">
                                                {formatTime(b.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-xs leading-relaxed text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                            {b.content}
                                        </p>
                                        {b.branch_id === null && (
                                            <span className="mt-1.5 inline-block rounded-full bg-[var(--surface-header)] px-2 py-0.5 text-xs text-[var(--text-light)]">
                                                Semua cabang
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
                    aria-label="Toggle note panel"
                    onClick={() => setNoteOpen(!noteOpen)}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[var(--subheading)] dark:text-white"
                >
                    <span>Note</span>
                    {noteOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {noteOpen && (
                    <div className="px-4 pb-4">
                        <div className="mb-3">
                            {showNoteInput ? (
                                <div className="flex flex-col gap-2">
                                    <textarea
                                        aria-label="Tulis catatan"
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="Tulis catatan..."
                                        rows={3}
                                        className={textareaClass}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            aria-label="Batal catatan"
                                            onClick={() => {
                                                setShowNoteInput(false);
                                                setNewNote('');
                                            }}
                                            className={btnGhostClass}
                                        >
                                            Batal
                                        </button>
                                        <button aria-label="Simpan catatan" onClick={handleSaveNote} className={btnPrimaryClass}>
                                            Simpan
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    aria-label="Buat catatan baru"
                                    onClick={() => setShowNoteInput(true)}
                                    className="flex w-full items-center gap-1.5 rounded-lg border border-dashed border-[var(--border-strong)] px-3 py-2 text-xs text-[var(--grey-text)] hover:bg-[var(--second-accent)] dark:border-[var(--border-strong)] dark:text-[var(--muted-foreground)] dark:hover:bg-[var(--border-strong)]"
                                >
                                    <Plus className="h-3 w-3" />
                                    Tambah Catatan
                                </button>
                            )}
                        </div>

                        {notes.length === 0 ? (
                            <p className="py-4 text-center text-xs text-[var(--grey-text-muted)] dark:text-[var(--muted-foreground)]">
                                Belum ada catatan
                            </p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {notes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="group relative rounded-xl border border-[var(--border-strong)] bg-[var(--page-bg)] p-3 dark:border-[var(--border-strong)] dark:bg-[#111827]"
                                    >
                                        <p className="text-xs leading-relaxed text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                            {note.content}
                                        </p>
                                        <button
                                            aria-label="Hapus catatan"
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
