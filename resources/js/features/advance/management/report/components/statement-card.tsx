import { DeltaBadge } from '@/features/advance/management/dashboard/components';
import { deltaPct, runExport, type ReportExport } from '@/features/advance/management/report/lib';
import { formatPct, formatRupiah } from '@/lib/format';
import { ExportMenu } from './export-menu';

export interface Line {
    label: string;
    current: number;
    previous: number;
    deduction?: boolean;
    bold?: boolean;
    format?: 'currency' | 'percent';
}

function fmtValue(value: number, line: Line): string {
    if (line.format === 'percent') return formatPct(value);
    const formatted = formatRupiah(value);
    return line.deduction && value > 0 ? `− ${formatted}` : formatted;
}

function valueColor(value: number, line: Line): string {
    const negative = line.format !== 'percent' && (line.deduction ? value > 0 : value < 0);
    if (negative) return 'text-[var(--danger)]';
    return line.bold ? 'text-[var(--subheading)] dark:text-white' : 'text-[var(--grey-text)] dark:text-[var(--muted-foreground)]';
}

interface StatementCardProps {
    lines: Line[];
    note?: string;
    report: ReportExport;
    compare: boolean;
}

export function StatementCard({ lines, note, report, compare }: StatementCardProps) {
    const grid = compare ? 'grid-cols-[1fr_auto] sm:grid-cols-[1fr_140px_140px_90px]' : 'grid-cols-[1fr_auto]';

    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 dark:border-[var(--border-strong)] dark:bg-[var(--card)]">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                {note ? <p className="text-sm leading-relaxed text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">{note}</p> : <span />}
                <ExportMenu onExport={(f) => runExport(f, report)} />
            </div>

            <div
                className={`grid ${grid} items-center gap-4 rounded-t-md bg-[var(--surface-header)] px-4 py-2.5 text-xs font-medium text-[var(--text-light)] dark:bg-[var(--border-strong)] dark:text-white`}
            >
                <span>Keterangan</span>
                <span className="text-right">{compare ? 'Periode Ini' : 'Nilai'}</span>
                {compare && <span className="hidden text-right sm:block">Periode Lalu</span>}
                {compare && <span className="hidden text-right sm:block">Δ</span>}
            </div>

            <dl className="divide-y divide-[var(--border)] dark:divide-[var(--border-strong)]">
                {lines.map((line) => (
                    <div key={line.label} className={`grid ${grid} items-center gap-4 px-4 py-3.5`}>
                        <dt
                            className={`text-sm ${line.bold ? 'font-semibold text-[var(--subheading)] dark:text-white' : 'text-[var(--grey-text)] dark:text-[var(--muted-foreground)]'}`}
                        >
                            {line.label}
                        </dt>
                        <dd className={`text-right text-sm ${line.bold ? 'font-bold' : 'font-medium'} ${valueColor(line.current, line)}`}>
                            {fmtValue(line.current, line)}
                        </dd>
                        {compare && (
                            <dd className={`hidden text-right text-sm sm:block ${valueColor(line.previous, line)}`}>
                                {fmtValue(line.previous, line)}
                            </dd>
                        )}
                        {compare && (
                            <dd className="hidden justify-end sm:flex">
                                <DeltaBadge value={deltaPct(line.current, line.previous)} invert={line.deduction} compact />
                            </dd>
                        )}
                    </div>
                ))}
            </dl>
        </div>
    );
}
