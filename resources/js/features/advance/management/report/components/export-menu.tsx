import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { ExportFormat } from '@/features/advance/management/report/lib';
import { ChevronDown, Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

const ITEMS: { format: ExportFormat; label: string; icon: typeof Download }[] = [
    { format: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
    { format: 'pdf', label: 'PDF', icon: FileText },
    { format: 'csv', label: 'CSV', icon: Download },
];

export function ExportMenu({ onExport }: { onExport: (format: ExportFormat) => void | Promise<void> }) {
    const [busy, setBusy] = useState<ExportFormat | null>(null);

    const run = async (format: ExportFormat) => {
        try {
            setBusy(format);
            await onExport(format);
        } catch (err) {
            console.error('Export gagal:', err);
            alert('Export gagal diproses. Coba lagi atau gunakan format lain.');
        } finally {
            setBusy(null);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    disabled={busy !== null}
                    className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[var(--surface-header)] px-4 text-sm font-semibold text-[var(--text-light)] shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Export
                    <ChevronDown className="h-3.5 w-3.5 opacity-80" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="min-w-[172px] border-[var(--border)] bg-[var(--neutral-white)] shadow-md dark:border-[var(--border-strong)] dark:bg-[var(--card)]"
            >
                {ITEMS.map((item) => (
                    <DropdownMenuItem
                        key={item.format}
                        disabled={busy !== null}
                        onSelect={(e) => {
                            e.preventDefault();
                            void run(item.format);
                        }}
                        className="cursor-pointer gap-2 text-[var(--subheading)] focus:bg-[var(--second-accent)] focus:text-[var(--subheading)] dark:text-white dark:focus:bg-[var(--border-strong)] dark:focus:text-white"
                    >
                        <item.icon className="h-4 w-4 text-[var(--grey-text)] dark:text-[var(--muted-foreground)]" />
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
