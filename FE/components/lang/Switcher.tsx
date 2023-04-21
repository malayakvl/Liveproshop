import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

export default function LangSwitcher() {
    const { locale, locales, defaultLocale }: any = useRouter();
    const router = useRouter();
    const node = useRef<HTMLDivElement>(null);

    const [showLangMenu, setShowLangMenu] = useState(false);

    const switchLang = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        const { pathname, asPath, query } = router;
        const target = event.target as HTMLSpanElement;
        const _locale: string = target.getAttribute('data-lang') || defaultLocale;
        router.push({ pathname, query }, asPath, { locale: _locale });
        setShowLangMenu(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    const handleClick = (e: any) => {
        if (
            e.target.parentNode.classList.contains('btn-langs') ||
            node?.current?.contains(e.target)
        ) {
            return;
        }
        setShowLangMenu(false);
    };

    return (
        <div className="relative min-w-max">
            <div className="language-block inline-block text-right">
                <button
                    className="btn-langs"
                    onClick={() => {
                        setShowLangMenu(!showLangMenu);
                    }}>
                    <span>{locale}</span>
                </button>
                {showLangMenu && (
                    <div className="lang-menu" ref={node}>
                        <div className="corner" />
                        <ul>
                            {locales.map((locale: string) => (
                                <li
                                    role="presentation"
                                    key={locale}
                                    data-lang={locale}
                                    onClick={switchLang}>
                                    {locale}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
