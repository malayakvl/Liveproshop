import { useTranslations } from 'next-intl';
import { parseTranslation } from '../../lib/functions';
import React from 'react';

interface PropsSelect {
    style: string | null;
    locale: string;
    name: string;
    label: string | null;
    options: any;
    props: any;
    fieldName: string;
}

const InputSelectLocalize: React.FC<PropsSelect> = ({
    style,
    locale,
    name,
    label,
    options,
    props,
    fieldName = 'name'
}) => {
    const t = useTranslations();
    return (
        <div className={`mb-4 ${style} relative`}>
            {label && <label htmlFor={name}>{t(label)}</label>}
            <select
                name={name}
                className="form-control"
                onChange={props.handleChange}
                value={props.values[name] || ''}>
                <option value="">------</option>
                {options.map((option: any) => (
                    <option value={option.id} key={option.id}>
                        {parseTranslation(option, fieldName, locale)}
                    </option>
                ))}
            </select>
            {props.errors[name] && <div className="error-el">{props.errors[name]}</div>}
        </div>
    );
};

export { InputSelectLocalize };
