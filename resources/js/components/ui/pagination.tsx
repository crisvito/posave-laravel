import { useLanguage } from '@/hooks';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

function isNumericLabel(label: string): boolean {
    return /^\d+$/.test(label.trim());
}

function buildCompactLinks(links: PaginationLink[]): PaginationLink[] {
    if (links.length === 0) return [];

    const prev = links[0];
    const next = links[links.length - 1];
    const numeric = links.slice(1, -1).filter((l) => isNumericLabel(l.label));

    if (numeric.length === 0) return links;

    const byPage = new Map(numeric.map((l) => [Number(l.label), l]));
    const firstPage = Number(numeric[0].label);
    const lastPage = Number(numeric[numeric.length - 1].label);
    const activeLink = numeric.find((l) => l.active) ?? numeric[0];
    const activePage = Number(activeLink.label);

    const wantedPages = [firstPage, activePage - 1, activePage, activePage + 1, lastPage];

    const candidates = wantedPages
        .filter((page) => byPage.has(page))
        .map((page) => byPage.get(page)!)
        .filter((link, index, arr) => arr.findIndex((l) => l.label === link.label) === index)
        .sort((a, b) => Number(a.label) - Number(b.label));

    const result: PaginationLink[] = [];
    candidates.forEach((link, index) => {
        if (index > 0) {
            const prevPageNum = Number(candidates[index - 1].label);
            const currentPageNum = Number(link.label);
            if (currentPageNum - prevPageNum > 1) {
                result.push({ url: null, label: '...', active: false });
            }
        }
        result.push(link);
    });

    return [prev, ...result, next];
}

export function Pagination({ links }: PaginationProps) {
    const { t } = useLanguage();

    if (links.length <= 3) return null;

    const compactLinks = buildCompactLinks(links);
    const lastIndex = compactLinks.length - 1;

    return (
        <div className="mt-4 flex items-center justify-center gap-1">
            {compactLinks.map((link, i) => {
                const isPrev = i === 0;
                const isNext = i === lastIndex;

                if (isPrev || isNext) {
                    return (
                        <button
                            key={i}
                            aria-label={isPrev ? t('shared.pagination.previous') : t('shared.pagination.next')}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--card)] text-[var(--grey-text)] hover:bg-[var(--second-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {isPrev ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                    );
                }

                return (
                    <button
                        key={i}
                        aria-label={`${t('shared.pagination.pageAriaLabelPrefix')} ${link.label.replace(/<[^>]+>/g, '')}`}
                        disabled={!link.url}
                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                        className={`rounded-lg px-3 py-1.5 text-sm ${
                            link.active
                                ? 'bg-[var(--surface-header)] font-medium text-white'
                                : 'bg-[var(--card)] text-[var(--grey-text)] hover:bg-[var(--second-accent)] disabled:cursor-not-allowed disabled:opacity-40'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}