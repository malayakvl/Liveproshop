/* eslint-disable jsx-a11y/label-has-associated-control */
// import { InputText } from '../_form';
import InputMask from 'react-input-mask';
import React, { useState } from 'react';

const RadioCreditCard = ({ field, title, form }: any) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    // const [cardStarCVV, setCardStarCVV] = useState('');
    const [cardDate, setCardDate] = useState('');

    return (
        <label
            className={`credit-card-account flex flex-col justify-items-stretch border border-solid box-border rounded-lg pt-6 pb-2 px-5 mb-4
          ${field.checked ? 'shadow-border' : 'shadow-border'}`}>
            <div className="flex justify-between space-x-2 text-gray-350">
                <div className="flex-none flex space-x-1 font-bold min-w-max w-1/6">
                    <div className="hidden">
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

            <div className="grid grid-cols-2 gap-2 lg:gap-4 mt-8 mb-4">
                {/*<InputText*/}
                {/*    icon="f-credit-card"*/}
                {/*    style="col-span-2"*/}
                {/*    label={null}*/}
                {/*    name="card_number"*/}
                {/*    placeholder="0000 0000 0000 0000"*/}
                {/*    props={form}*/}
                {/*    tips={null}*/}
                {/*/>*/}
                <div className="relative">
                    <div className="input-card-number-icon" />
                    <InputMask
                        style={{ width: '336px' }}
                        name="card_number"
                        // props={form}
                        className="form-control-icon"
                        mask="9999 9999 9999 9999"
                        placeholder="9999 9999 9999 9999"
                        maskPlaceholder="9999 9999 9999 9999"
                        onChange={(e) => {
                            setCardNumber(e.target.value);
                            form.values.card_number = e.target.value;
                        }}
                        onFocus={(e) => e.target.select()}
                        value={cardNumber}
                    />
                </div>
                <div className="clearfix" />
                <div className="relative">
                    <div className="input-card-date-icon" />
                    <InputMask
                        style={{ width: '144px' }}
                        className="form-control-icon input-card-date"
                        mask="99/99"
                        name="card_expire_date"
                        placeholder="MM/YY"
                        maskPlaceholder="99/99"
                        onChange={(e) => {
                            setCardDate(e.target.value);
                            form.values.card_expire_date = e.target.value;
                        }}
                        onFocus={(e) => e.target.select()}
                        value={cardDate}
                    />
                </div>
                <div className="relative">
                    <div className="input-card-csv-icon" />
                    <InputMask
                        style={{ width: '110px', marginLeft: '45px' }}
                        className="form-control-icon"
                        mask="999"
                        name="card_ccv"
                        placeholder="CCV"
                        onChange={(e) => {
                            setCardCVV(e.target.value);
                            form.values.card_ccv = e.target.value;
                            // setTimeout(() => {
                            //     setCardStarCVV('*');
                            // }, 1000);
                        }}
                        onFocus={(e) => e.target.select()}
                        value={cardCVV}
                    />
                </div>
                {/*<InputText*/}
                {/*    icon="f-credit-credit-card-exp"*/}
                {/*    style={null}*/}
                {/*    label={null}*/}
                {/*    name="card_expire_date"*/}
                {/*    placeholder="MM/YY"*/}
                {/*    props={form}*/}
                {/*    tips={null}*/}
                {/*/>*/}
                {/*<InputText*/}
                {/*    icon="f-credit-credit-card-ccv"*/}
                {/*    style="lg:w-36"*/}
                {/*    label={null}*/}
                {/*    name="card_ccv"*/}
                {/*    placeholder="CCV"*/}
                {/*    props={form}*/}
                {/*    tips={null}*/}
                {/*/>*/}
            </div>
        </label>
    );
};

export default RadioCreditCard;
