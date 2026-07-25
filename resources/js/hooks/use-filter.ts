import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface UseFiltersOptions {
    /** Jeda ms sebelum search otomatis ke-apply setelah user berhenti ngetik. Default 400ms. Isi 0 buat matiin (balik submit-by-Enter doang). */
    debounceMs?: number;
}

export function useFilters<T extends { search?: string }>(routeName: string, filters: T, options: UseFiltersOptions = {}) {
    const debounceMs = options.debounceMs ?? 400;
    const [search, setSearch] = useState(filters.search ?? '');
    const isFirstRender = useRef(true);

    const applyFilters = (overrides: Partial<T>) => {
        router.get(route(routeName), { ...filters, ...overrides }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: search || undefined } as Partial<T>);
    };

    useEffect(() => {
        if (!debounceMs) return;
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            applyFilters({ search: search || undefined } as Partial<T>);
        }, debounceMs);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return { search, setSearch, applyFilters, handleSearch };
}