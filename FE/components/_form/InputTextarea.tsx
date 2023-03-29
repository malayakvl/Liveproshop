import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
    style: string | null;
    icon: string | null;
    name: string;
    label: string | null;
    placeholder: string | null;
    props: any;
    rows?: number;
}

const InputTextarea: React.FC<Props> = ({ style, icon, name, label, placeholder, props, rows }) => {
    const t = useTranslations();

    const clear = () => {
        props.setFieldValue(name, '');
    };

    return (
        <div className={`mb-4 ${style}`}>
            {label && (
                <label className="control-label" htmlFor={name}>
                    {t(label)}
                </label>
            )}
            <div className="relative">
                {icon && <i className={`f-icon ${icon}`} />}

                <textarea
                    style={{ whiteSpace: 'pre-wrap' }}
                    className={icon ? 'form-control-icon' : 'form-control'}
                    placeholder={placeholder ? t(placeholder) : ''}
                    onChange={props.handleChange}
                    // value={inputValue || ''}
                    value={props.values[name]}
                    name={name}
                    rows={rows ? rows : 4}
                />
                <i
                    role="presentation"
                    className="input-close cursor-pointer"
                    onClick={() => clear()}
                />
                {props.errors[name] && <div className="error-el">{props.errors[name]}</div>}
            </div>
        </div>
    );
};

export { InputTextarea };
