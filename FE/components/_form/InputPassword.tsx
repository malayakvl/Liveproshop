import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
    style: string | null;
    icon: string | null;
    name: string;
    label: string | null;
    placeholder: string | null;
    props: any;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputPassword: React.FC<Props> = ({
    style,
    icon,
    name,
    label,
    placeholder,
    props,
    onChange
}) => {
    const t = useTranslations();
    return (
        <div className={`mb-4 ${style} relative`}>
            {label && <label htmlFor={name}>{t(label)}</label>}
            {icon && <i className={`f-icon ${icon}`} />}
            <input
                className={icon ? 'form-control-icon' : 'form-control'}
                placeholder={placeholder ? t(placeholder) : ''}
                type="password"
                onChange={onChange ? onChange : props.handleChange}
                value={props.values[name] || ''}
                name={name}
            />
            {props.errors[name] && <div className="error-el">{props.errors[name]}</div>}
        </div>
    );
};

export { InputPassword };
