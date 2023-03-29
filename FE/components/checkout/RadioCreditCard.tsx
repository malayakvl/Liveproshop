/* eslint-disable jsx-a11y/label-has-associated-control */
import { InputText } from '../_form';

const RadioCreditCard = ({ field, title, form }: any) => {
    return (
        <label
            className={`flex flex-col justify-items-stretch border border-solid box-border rounded-lg pt-6 pb-2 px-5 mb-4
          ${field.checked ? 'border-gradient' : ''}`}>
            <div className="flex justify-between space-x-2 text-gray-350">
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
                    <div className={`min-w-max ${!field.checked ? 'text-gray-450' : ''}`}>
                        {title}
                    </div>
                </div>

                <div className="flex justify-end space-x-1 sm:space-x-2">
                    <img width="34" height="20" src={`/images/payments/amex.svg`} alt="AMEX" />
                    <img
                        width="34"
                        height="20"
                        src={`/images/payments/mastercard.svg`}
                        alt="MasterCard"
                    />
                    <img width="34" height="20" src={`/images/payments/visa.svg`} alt="VISA" />
                    <img
                        width="34"
                        height="20"
                        src={`/images/payments/payoneer.svg`}
                        alt="Payoneer"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:gap-4 mt-8">
                <InputText
                    icon="f-credit-card"
                    style="col-span-2"
                    label={null}
                    name="card_number"
                    placeholder="0000 0000 0000 0000"
                    props={form}
                    tips={null}
                />
                <InputText
                    icon="f-credit-credit-card-exp"
                    style={null}
                    label={null}
                    name="card_expire_date"
                    placeholder="MM/YY"
                    props={form}
                    tips={null}
                />
                <InputText
                    icon="f-credit-credit-card-ccv"
                    style="lg:w-36"
                    label={null}
                    name="card_ccv"
                    placeholder="CCV"
                    props={form}
                    tips={null}
                />
            </div>
        </label>
    );
};

export default RadioCreditCard;
