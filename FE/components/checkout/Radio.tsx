const Radio = ({ field, title, text, img }: any) => (
    <label
        className={`flex justify-between space-x-2 border border-solid box-border rounded-lg py-6 px-5 mb-4 text-gray-350
          ${field.checked ? 'border-gradient' : ''}`}>
        <div className="flex-none flex space-x-1 font-bold min-w-max w-1/6">
            <div>
                <img
                    width="20"
                    height="20"
                    src={`/images/${field.checked ? 'option-applied' : 'option'}.svg`}
                    className="text-orange-450"
                    alt=""
                />
            </div>
            <input {...field} type="radio" className="opacity-0 w-0 h-0" />
            <div className={`min-w-max ${!field.checked ? 'text-gray-450' : ''}`}>{title}</div>
        </div>

        <div className={`flex-auto ${!field.checked ? 'text-gray-450' : ''}`}>{text}</div>

        <div className="flex-none">
            <img width="46" height="32" src={img} alt={text} />
        </div>
    </label>
);

export default Radio;
