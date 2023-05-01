import React from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface State {
    width: number;
    height: number;
    isMobile: boolean;
}

export default function useWindowSize() {
    const MaxMobileWidth = 991;
    const [windowSize, setWindowSize] = React.useState<State>({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= MaxMobileWidth
    });

    const debounced = useDebouncedCallback(
        () => {
            setWindowSize(() => ({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth <= MaxMobileWidth
            }));
        },
        500,
        { maxWait: 2000 }
    );

    React.useEffect(() => {
        window.addEventListener('resize', debounced, { passive: true });

        return () => {
            window.removeEventListener('resize', debounced);
            // cancel();
        };
    }, [debounced]);

    return windowSize;
}
