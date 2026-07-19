import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { ExportFormat } from '@/features/advance/management/report/lib';
import { useLanguage } from '@/hooks';
import { ChevronDown, Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function ExportMenu({ onExport }: { onExport: (format: ExportFormat) => void | Promise<void> }) {
    const { t } = useLanguage();
    const [busy, setBusy] = useState<ExportFormat | null>(null);

    const ITEMS: { format: ExportFormat; label: string; icon: typeof Download }[] = [
        { format: 'excel', label: t('dashboardAdvance.report.exportMenu.excel'), icon: FileSpreadsheet },
        { format: 'pdf', label: t('dashboardAdvance.report.exportMenu.pdf'), icon: FileText },
        { format: 'csv', label: t('dashboardAdvance.report.exportMenu.csv'), icon: Download },
    ];

    const run = async (format: ExportFormat) => {
        try {
            setBusy(format);
            await onExport(format);
        } catch (err) {
            console.error('Export gagal:', err);
            alert(t('dashboardAdvance.report.exportMenu.failedAlert'));
        } finally {
            setBusy(null);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    disabled={busy !== null}
                    className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[var(--surface-header)] px-4 text-sm font-semibold text-[var(--text-light)] shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {t('dashboardAdvance.report.exportMenu.exportLabel')}
                    <ChevronDown className="h-3.5 w-3.5 opacity-80" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[172px] border-[var(--border-strong)] bg-[var(--card)] shadow-md">
                {ITEMS.map((item) => (
                    <DropdownMenuItem
                        key={item.format}
                        disabled={busy !== null}
                        onSelect={(e) => {
                            e.preventDefault();
                            void run(item.format);
                        }}
                        className="cursor-pointer gap-2 text-[var(--subheading)] focus:bg-[var(--second-accent)] focus:text-[var(--subheading)]"
                    >
                        <item.icon className="h-4 w-4 text-[var(--grey-text)]" />
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
