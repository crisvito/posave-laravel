import { formatSignedPct } from '@/lib/format';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

export function DeltaBadge({ value, invert = false, compact = false }: { value: number; invert?: boolean; compact?: boolean }) {
    const neutral = !value;
    const good = invert ? value < 0 : value > 0;

    const color = neutral ? 'var(--grey-text)' : good ? 'var(--success)' : 'var(--danger)';
    const bg = neutral ? 'var(--second-accent)' : good ? 'var(--success-background)' : 'var(--danger-background)';
    const Icon = neutral ? Minus : value > 0 ? TrendingUp : TrendingDown;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full font-medium transition-colors ${
                compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
            }`}
            style={{
                backgroundColor: bg,
                color: color,
            }}
            title="Dibanding periode sebelumnya"
        >
            <Icon className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            {formatSignedPct(value)}
        </span>
    );
}
