import { AppLogoIcon } from '@/components';
import { useLanguage } from '@/hooks';
import { Link } from '@inertiajs/react';

export interface FeatureItemData {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface AuthSplitLayoutProps {
    children: React.ReactNode;
    title: React.ReactNode;
    description: string;
    illustrationImage: string;
    features: FeatureItemData[];
}

export function AuthSplitLayout({ children, title, description, features }: AuthSplitLayoutProps) {
    const { t } = useLanguage();

    return (
        <div className="flex min-h-screen bg-[var(--neutral-white)] dark:bg-[var(--background)]">
            <div className="flex w-full flex-col justify-between px-8 py-8 md:w-1/2 lg:px-24">
                <div>
                    <Link href="/" className="flex items-center gap-2 font-bold text-[var(--secondary-600)]">
                        <AppLogoIcon className="h-6 w-6 fill-current" />
                        <span className="text-xl">POSAVE</span>
                    </Link>
                </div>

                <div className="mx-auto my-auto w-full max-w-sm py-12">
                    <div className="mb-8">
                        <h1 className="flex items-center gap-2 text-3xl font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-[var(--grey-text)] dark:text-[var(--neutral-white)]">{description}</p>
                    </div>
                    {children}
                </div>

                <div className="text-center text-xs text-[var(--grey-text-muted)] md:text-left">{t('auth.layout.copyright')}</div>
            </div>

            <div className="relative hidden w-1/2 flex-col items-center overflow-hidden bg-[var(--second-accent)] p-12 md:flex dark:bg-[var(--primary-900)]">
                <div className="relative z-10 flex h-120 w-full max-w-md items-center">
                    <div className="mt-12 flex flex-col gap-6">
                        {features.map((feature, index) => (
                            <FeatureItem key={index} icon={feature.icon} title={feature.title} description={feature.description} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ icon, title, description }: FeatureItemData) {
    return (
        <div className="flex items-start gap-4 rounded-xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-4 shadow-sm dark:bg-[var(--card)]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--second-accent)] text-xl dark:bg-[var(--border-strong)]">
                {icon}
            </div>
            <div>
                <h4 className="text-sm font-bold text-[var(--subheading)] dark:text-[var(--neutral-white)]">{title}</h4>
                <p className="mt-1 text-xs text-[var(--grey-text)] dark:text-[var(--neutral-white)]">{description}</p>
            </div>
        </div>
    );
}
