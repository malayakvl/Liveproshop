import { useTranslations } from 'next-intl';
import React from 'react';

interface PropsSelect {
    style: string | null;
    name: string;
    label: string | null;
    options: any;
    props: any;
}

const InputSelect: React.FC<PropsSelect> = ({ style, name, label, options, props }) => {
    const t = useTranslations();
    return (
        <div className={`mb-4 ${style} relative`}>
            {label && (
                <label className="control-label" htmlFor={name}>
                    {t(label)}
                </label>
            )}
            <select
                name={name}
                className="form-control"
                onChange={props.handleChange}
                value={props.values[name] || ''}>
                <option value="">------</option>
                {options.map((option: any) => (
                    <option value={option.id} key={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
            {props.errors[name] && <div className="error-el">{props.errors[name]}</div>}
        </div>
    );
};

export { InputSelect };
