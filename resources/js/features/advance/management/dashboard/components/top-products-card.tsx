import { formatNumber, formatRupiah } from '@/lib/format';

export interface TopProduct {
    name: string;
    qty: number;
    omzet: number;
}

export function TopProductsCard({ products, className }: { products: TopProduct[]; className?: string }) {
    return (
        <div
            className={`rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 dark:border-[var(--border-strong)] dark:bg-[var(--card)] ${className ?? ''}`}
        >
            <h3 className="mb-4 text-sm font-semibold text-[var(--subheading)] dark:text-white">Produk Terlaris</h3>
            {products.length === 0 ? (
                <p className="py-8 text-center text-sm text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">Belum ada data</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {products.map((product, i) => (
                        <li key={product.name} className="flex items-center gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--second-accent)] text-xs font-semibold text-[var(--subheading)] dark:bg-[var(--border-strong)] dark:text-white">
                                {i + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-[var(--subheading)] dark:text-white">{product.name}</p>
                                <p className="text-xs text-[var(--grey-text)] dark:text-[var(--muted-foreground)]">
                                    {formatNumber(product.qty)} Terjual
                                </p>
                            </div>
                            <span className="shrink-0 text-sm font-semibold text-[var(--subheading)] dark:text-white">
                                {formatRupiah(product.omzet)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
