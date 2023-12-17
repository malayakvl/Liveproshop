import React, { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
    options: any;
    onChange: any;
}

const DropdownPdfAction: React.FC<Props> = ({ options, onChange }) => {
    const node = useRef<HTMLDivElement>(null);
    const t = useTranslations();
    const [open, setOpen] = useState(false);

    const handleClick = (e: any) => {
        if (node?.current?.contains(e.target)) {
            // inside click
            return;
        }
        // outside click
        setOpen(false);
    };

    const handleChange = (selectedValue: any) => {
        onChange(selectedValue);
        setOpen(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    return (
        <div ref={node} className="dropdown-action">
            <button className="dropdown-toggler-pdf" onClick={() => setOpen(!open)} />
            {open && (
                <ul className="dropdown-menu">
                    {options.map((opt: any) => (
                        <li
                            role="presentation"
                            key={opt}
                            className="dropdown-menu-item"
                            onClick={() => handleChange(opt)}>
                            {t(opt)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownPdfAction;
