import React from 'react';

interface Props {
    inputValue: string | null;
    name: string;
    props: any;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputHidden: React.FC<Props> = ({ inputValue, name, props, onChange }) => {
    return (
        <div className={``}>
            <div className="relative">
                <input
                    type="hidden"
                    onChange={onChange ? onChange : props.handleChange}
                    value={inputValue || ''}
                    name={name}
                />
                {props.errors[name] && <div className="error-el">{props.errors[name]}</div>}
            </div>
        </div>
    );
};

export { InputHidden };
