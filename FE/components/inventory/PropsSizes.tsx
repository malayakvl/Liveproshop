import React from 'react';
import { useTranslations } from 'next-intl';

const RenderSizes: React.FC<any> = ({ sizes, configured, removeSizeHandler }) => {
    const t = useTranslations();

    return (
        <div
            role="presentation"
            className="react-tags"
            style={{ minHeight: '39px' }}
            // onClick={() => showSizeHandler()}
        >
            {sizes.length > 0 && configured && (
                <>
                    {sizes.map((size: any) => (
                        <button
                            key={size.value}
                            type="button"
                            className="react-tags__selected-tag"
                            onClick={() => removeSizeHandler(size.value)}
                            title="Click to remove tag">
                            <span className="react-tags__selected-tag-name">{size.label}</span>
                        </button>
                    ))}
                </>
            )}
            {sizes.length > 0 && !configured && (
                <>
                    {sizes.map((size: any) => (
                        <div key={size.value} className="text-xs mt-1">
                            {size.label}
                        </div>
                    ))}
                </>
            )}
            {sizes.length === 0 && <div className="text-xs mt-1">{t('Size')}</div>}
            {Object.keys(sizes) && !sizes.length && (
                <div className="text-xs mt-1">{sizes.label}</div>
            )}
        </div>
    );
};

export default RenderSizes;
