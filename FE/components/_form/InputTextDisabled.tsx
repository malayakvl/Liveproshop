interface Props {
    props: any;
    name: string;
    icon: string;
}

const InputTextDisabled: React.FC<Props> = ({ name, icon, props }) => {
    return (
        <div className={`relative`}>
            {icon && <i className={`f-icon ${icon}`} />}

            <input
                className={icon ? 'form-control-icon-disabled' : 'form-control-disabled'}
                type="text"
                name={name}
                value={props.values[name]}
                disabled
                readOnly
            />
        </div>
    );
};

export default InputTextDisabled;
