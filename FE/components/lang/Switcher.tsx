import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

export default function LangSwitcher({ type }: { type: string | null | boolean }) {
    const { locale, locales, defaultLocale }: any = useRouter();
    const router = useRouter();
    const node = useRef<HTMLDivElement>(null);
    // const [isMobile, setIsMobile] = useState(false);

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
        // if (window.innerWidth < 991) {
        //     setIsMobile(true);
        // }

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
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
            className={`language-block inline-block text-right  ${
                type ? 'language-block-content-1' : ''
            }`}>
            <button
                className="btn-langs z-50"
                onClick={() => {
                    setShowLangMenu(!showLangMenu);
                }}>
                <span className="active-lang">{locale}</span>
            </button>
            {showLangMenu && (
                <div className="lang-menu shadow-2xl" ref={node}>
                    <div className="corner" />
                    <ul>
                        {locales.map((_locale: string) => (
                            <li
                                className={_locale == locale ? 'hidden' : ''}
                                role="presentation"
                                key={_locale}
                                data-lang={_locale}
                                onClick={switchLang}>
                                {_locale}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
