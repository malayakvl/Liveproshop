import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
    style: string | null;
    name: string;
    label: string | null;
    props: any;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputSwitcher: React.FC<Props> = ({
    style,
    name,
    label,
    props,
    onChange = props.handleChange
}) => {
    const t = useTranslations();

    return (
        <>
            <div className={`mb-4 ${style}`}>
                <label htmlFor={name} className="flex items-center cursor-pointer relative mb-4">
                    <input
                        type="checkbox"
                        id={name}
                        className="sr-only"
                        onChange={onChange}
                        name={name}
                        checked={props.values[name]}
                    />
                    <div className="toggle-bg bg-gray-200 border border-gray-200 h-6 w-11 rounded-full dark:bg-gray-700 dark:border-gray-600" />
                    {label && (
                        <span className="ml-3 text-blue-350 text-xs font-bold">{t(label)}</span>
                    )}
                </label>
            </div>
        </>
    );
};

export { InputSwitcher };
