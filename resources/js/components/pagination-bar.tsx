import { Pagination, PerPageSelect } from '@/components';
import { useLanguage } from '@/hooks';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationBarProps {
    from: number;
    to: number;
    total: number;
    itemLabel: string;
    links: PaginationLink[];
    perPage: string;
    onPerPageChange: (value: string) => void;
    perPageOptions?: number[];
}

export function PaginationBar({ from, to, total, itemLabel, links, perPage, onPerPageChange, perPageOptions }: PaginationBarProps) {
    const { t } = useLanguage();

    if (total === 0) return null;

    return (
        <div className="mt-4 grid grid-cols-1 items-center justify-center gap-3 sm:grid-cols-3">
            <span className="text-center text-sm text-[var(--grey-text)] sm:text-left">
                {t('shared.pagination.showingPrefix')} {from}-{to} {t('shared.pagination.showingMiddle')} {total} {itemLabel}
            </span>

            <div className="flex justify-center">
                <Pagination links={links} />
            </div>

            <div className="flex items-center justify-center sm:justify-end">
                <PerPageSelect value={perPage} onChange={onPerPageChange} options={perPageOptions} />
            </div>
        </div>
    );
}
