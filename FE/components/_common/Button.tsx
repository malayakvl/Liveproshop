import React from 'react';
import classNames from 'classnames';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslations } from 'next-intl';

interface Props {
    isLoading?: boolean;
    iconClassName?: string | null;
    icon?: React.ReactElement | null;
    locale?: string;
    localeKey?: string;
    className?: string | null;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const Button: React.FC<Props> = ({
    isLoading = false,
    // variant = 'success',
    iconClassName = null,
    className,
    icon = null,
    locale = '',
    localeKey = '',
    onClick,
    ...rest
}) => {
    const t = useTranslations();
    const localeStr: string = locale || (localeKey && t(localeKey));

    const renderIcon = (): React.ReactNode => {
        if (!icon && !iconClassName && !isLoading) return null;
        return isLoading ? (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        ) : (
            <>
                {icon}
                {!icon && iconClassName && <i className={iconClassName} />}
            </>
        );
    };

    return (
        <button
            {...rest}
            onClick={!isLoading ? onClick : undefined}
            // variant={variant}
            className={classNames(className, {
                'icon-right-margin': Boolean(localeStr),
                loading: isLoading
            })}>
            {renderIcon()}
            {localeStr}
        </button>
    );
};

// const StyledBootstrapButton = styled(BootstrapButton)`
//     white-space: nowrap;
//     min-width: 34px;
//
//     &.icon-right-margin {
//         > i,
//         .image,
//         .spinner-border {
//             margin-right: 10px;
//         }
//
//         .image {
//             width: 15px;
//             height: 15px;
//             flex-shrink: 0;
//         }
//     }
//
//     > svg {
//         position: relative;
//         bottom: 1px;
//         width: 19px;
//         height: 19px;
//         fill: currentColor;
//         margin-right: 10px;
//     }
// `;

export default Button;
