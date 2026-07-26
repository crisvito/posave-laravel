import { AppLogoIcon } from '@/components';

export function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white">
                <AppLogoIcon className="size-5 fill-current text-[var(--primary-900)]" />
            </div>

            <div className="ml-1 grid flex-1 text-left text-lg text-[var(--white)]">
                <span className="truncate leading-none font-bold">POSAVE</span>
            </div>
        </div>
    );
}
