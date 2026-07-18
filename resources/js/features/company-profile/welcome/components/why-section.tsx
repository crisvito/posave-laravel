import { useLanguage } from '@/hooks';

export function WhySection() {
    const { t } = useLanguage();

    return (
        <>
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col items-center gap-0 lg:flex-row">
                    <div className="z-10 flex w-full justify-start lg:w-1/2">
                        <div
                            className="h-[810px] w-full max-w-[600px] overflow-hidden rounded-[65px] dark:shadow-none"
                            style={{ boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.35)' }}
                        >
                            <img
                                src="assets/landing-page/kenapa-posave.jpeg"
                                alt="Kenapa Pilih Posave"
                                className="h-full w-full object-cover dark:opacity-90"
                            />
                        </div>
                    </div>

                    <div className="z-20 mt-12 flex w-full flex-col lg:mt-0 lg:-ml-30 lg:w-1/2">
                        <div className="mb-3 ml-15 lg:pl-12">
                            <h2 className="text-[52px] leading-none font-bold tracking-tight text-[var(--primary-900)] dark:text-[var(--text-light)]">
                                {t('companyProfile.welcome.why.titleLine1')}
                            </h2>
                            <div className="mt-0 ml-21.5 flex items-center gap-4">
                                <img
                                    src="assets/landing-page/logo.png"
                                    alt="POSAVE"
                                    className="h-16 scale-450 object-contain dark:brightness-0 dark:invert"
                                />
                                <span className="ml-18 text-[70px] leading-none font-bold text-[var(--secondary-900)] dark:text-[var(--text-light)]">
                                    ?
                                </span>
                            </div>
                        </div>

                        <div
                            className="rounded-[55px] border-10 border-[var(--accent-700)] bg-[var(--primary-900)] p-10 text-white shadow-2xl lg:p-14 dark:border-[var(--border-strong)] dark:bg-[var(--primary-800)]"
                            style={{ boxShadow: '0 40px 80px -15px rgba(0, 0, 0, 0.5)' }}
                        >
                            <p className="mb-10 text-[17px] leading-relaxed text-[var(--accent-800)]">
                                <span className="text-lg font-bold text-white">{t('companyProfile.welcome.why.bodyBrand')}</span>{' '}
                                {t('companyProfile.welcome.why.body')}
                            </p>

                            <div className="space-y-10">
                                <div className="flex items-start gap-6">
                                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-[var(--neutral-white)] shadow-lg">
                                        <svg
                                            width="48"
                                            height="48"
                                            viewBox="0 0 48 48"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-9 w-9"
                                        >
                                            <path
                                                d="M29.8081 7.00221H18.1921C16.7879 7.00163 15.3973 7.28611 14.0999 7.83939C12.8024 8.39267 11.6235 9.20391 10.6305 10.2268C9.63743 11.2496 8.84976 12.464 8.31245 13.8006C7.77515 15.1372 7.49874 16.5697 7.49902 18.0164V29.9836C7.49846 31.4305 7.77466 32.8633 8.31184 34.2001C8.84901 35.5369 9.63664 36.7516 10.6297 37.7747C11.6228 38.7978 12.8018 39.6092 14.0994 40.1626C15.397 40.716 16.7877 41.0006 18.1921 41H29.8081C31.2125 41.0006 32.6032 40.716 33.9008 40.1626C35.1984 39.6092 36.3774 38.7978 37.3705 37.7747C38.3636 36.7516 39.1512 35.5369 39.6884 34.2001C40.2255 32.8633 40.5017 31.4305 40.5012 29.9836V18.0164C40.5017 16.5695 40.2255 15.1367 39.6884 13.7999C39.1512 12.4631 38.3636 11.2484 37.3705 10.2253C36.3774 9.20225 35.1984 8.39081 33.9008 7.83739C32.6032 7.28397 31.2125 6.99942 29.8081 7V7.00221Z"
                                                stroke="var(--primary-900)"
                                                strokeWidth="3"
                                            />
                                            <path
                                                d="M40.3251 31.934H43.8C44.3835 31.934 44.9431 31.6952 45.3556 31.2701C45.7682 30.8451 46 30.2686 46 29.6675V18.3349C46 17.7338 45.7682 17.1573 45.3556 16.7322C44.9431 16.3072 44.3835 16.0684 43.8 16.0684H40.3229M7.67707 31.934H4.2C3.91109 31.934 3.62501 31.8754 3.3581 31.7615C3.09118 31.6476 2.84865 31.4806 2.64436 31.2701C2.44008 31.0597 2.27803 30.8098 2.16746 30.5348C2.0569 30.2598 2 29.9651 2 29.6675V18.3349C2 17.7338 2.23178 17.1573 2.64436 16.7322C3.05695 16.3072 3.61652 16.0684 4.2 16.0684H7.67707"
                                                stroke="var(--primary-900)"
                                                strokeWidth="3"
                                            />
                                            <path
                                                d="M4.17773 16.0685V7.00244M43.7992 16.0685L43.7777 7.00244M28.3563 21.7337H32.7541M17.3992 19.1267V23.6597M19.5992 30.7998C20.7692 31.9962 22.3508 32.6675 23.9992 32.6675C25.6476 32.6675 27.2292 31.9962 28.3992 30.7998"
                                                stroke="var(--primary-900)"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>

                                    <div>
                                        <h4 className="mb-1 text-[20px] font-bold">{t('companyProfile.welcome.why.feature1Title')}</h4>

                                        <p className="text-[15px] leading-snug text-[var(--accent-800)]">
                                            {t('companyProfile.welcome.why.feature1Body')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-[var(--neutral-white)] shadow-lg">
                                        <svg
                                            width="48"
                                            height="48"
                                            viewBox="0 0 48 48"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-9 w-9"
                                        >
                                            <path
                                                d="M24.0057 44V4M24.0057 24H43.0533M4 6.85714V41.1429C4 41.9006 4.30102 42.6273 4.83684 43.1632C5.37266 43.699 6.09938 44 6.85714 44H41.1429C41.9006 44 42.6273 43.699 43.1632 43.1632C43.699 42.6273 44 41.9006 44 41.1429V6.85714C44 6.09938 43.699 5.37266 43.1632 4.83684C42.6273 4.30102 41.9006 4 41.1429 4H6.85714C6.09938 4 5.37266 4.30102 4.83684 4.83684C4.30102 5.37266 4 6.09938 4 6.85714Z"
                                                stroke="var(--primary-900)"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>

                                    <div>
                                        <h4 className="mb-1 text-[20px] font-bold">{t('companyProfile.welcome.why.feature2Title')}</h4>

                                        <p className="text-[15px] leading-snug text-[var(--accent-800)]">
                                            {t('companyProfile.welcome.why.feature2Body')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-[var(--neutral-white)] shadow-lg">
                                        <svg
                                            width="48"
                                            height="48"
                                            viewBox="0 0 48 48"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-9 w-9"
                                        >
                                            <path
                                                d="M45 42C45 42 48 42 48 39C48 36 45 27 33 27C21 27 18 36 18 39C18 42 21 42 21 42H45ZM21.066 39L21 38.988C21.003 38.196 21.501 35.898 23.28 33.828C24.936 31.887 27.846 30 33 30C38.151 30 41.061 31.89 42.72 33.828C44.499 35.898 44.994 38.199 45 38.988L44.976 38.994L44.934 39H21.066ZM33 21C34.5913 21 36.1174 20.3679 37.2426 19.2426C38.3679 18.1174 39 16.5913 39 15C39 13.4087 38.3679 11.8826 37.2426 10.7574C36.1174 9.63214 34.5913 9 33 9C31.4087 9 29.8826 9.63214 28.7574 10.7574C27.6321 11.8826 27 13.4087 27 15C27 16.5913 27.6321 18.1174 28.7574 19.2426C29.8826 20.3679 31.4087 21 33 21ZM42 15C42 16.1819 41.7672 17.3522 41.3149 18.4442C40.8626 19.5361 40.1997 20.5282 39.364 21.364C38.5282 22.1997 37.5361 22.8626 36.4442 23.3149C35.3522 23.7672 34.1819 24 33 24C31.8181 24 30.6478 23.7672 29.5558 23.3149C28.4639 22.8626 27.4718 22.1997 26.636 21.364C25.8003 20.5282 25.1374 19.5361 24.6851 18.4442C24.2328 17.3522 24 16.1819 24 15C24 12.6131 24.9482 10.3239 26.636 8.63604C28.3239 6.94821 30.6131 6 33 6C35.3869 6 37.6761 6.94821 39.364 8.63604C41.0518 10.3239 42 12.6131 42 15ZM20.808 27.84C19.6073 27.4647 18.3705 27.2164 17.118 27.099C16.4141 27.0304 15.7072 26.9973 15 27C3 27 0 36 0 39C0 41 1 42 3 42H15.648C15.2035 41.0634 14.9817 40.0366 15 39C15 35.97 16.131 32.874 18.27 30.288C18.999 29.406 19.848 28.581 20.808 27.84ZM14.76 30C12.9856 32.6683 12.0265 35.7956 12 39H3C3 38.22 3.492 35.91 5.28 33.828C6.915 31.92 9.756 30.06 14.76 30.003V30ZM4.5 16.5C4.5 14.1131 5.44821 11.8239 7.13604 10.136C8.82387 8.44821 11.1131 7.5 13.5 7.5C15.8869 7.5 18.1761 8.44821 19.864 10.136C21.5518 11.8239 22.5 14.1131 22.5 16.5C22.5 18.8869 21.5518 21.1761 19.864 22.864C18.1761 24.5518 15.8869 25.5 13.5 25.5C11.1131 25.5 8.82387 24.5518 7.13604 22.864C5.44821 21.1761 4.5 18.8869 4.5 16.5ZM13.5 10.5C11.9087 10.5 10.3826 11.1321 9.25736 12.2574C8.13214 13.3826 7.5 14.9087 7.5 16.5C7.5 18.0913 8.13214 19.6174 9.25736 20.7426C10.3826 21.8679 11.9087 22.5 13.5 22.5C15.0913 22.5 16.6174 21.8679 17.7426 20.7426C18.8679 19.6174 19.5 18.0913 19.5 16.5C19.5 14.9087 18.8679 13.3826 17.7426 12.2574C16.6174 11.1321 15.0913 10.5 13.5 10.5Z"
                                                fill="var(--primary-900)"
                                            />
                                        </svg>
                                    </div>

                                    <div>
                                        <h4 className="mb-1 text-[20px] font-bold">{t('companyProfile.welcome.why.feature3Title')}</h4>

                                        <p className="text-[15px] leading-snug text-[var(--accent-800)]">
                                            {t('companyProfile.welcome.why.feature3Body')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
