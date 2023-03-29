import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showedItemsSelector } from '../../redux/chatbot/selectors';
import { showItemAction } from '../../redux/chatbot';
import { useTranslations } from 'next-intl';
import { submitDefaultFormAction } from '../../redux/chatbot/actions';

const Row: React.FC<any> = ({ item }) => {
    const dispatch = useDispatch();
    const showedItems = useSelector(showedItemsSelector);
    const t = useTranslations();

    const [translationEn, setTranslationEn] = useState(item.message_en);
    const [translationFr, setTranslationFr] = useState(item.message_fr);

    return (
        <>
            <tr>
                <td>
                    <span className="overflow-hidden max-w-[500px] block text-ellipsis">
                        {item.keywords}
                    </span>
                </td>
                <td
                    className="chat-eye cursor-pointer"
                    role="presentation"
                    onClick={() => dispatch(showItemAction(item.id))}>
                    <i className={showedItems.includes(item.id) ? 'eye' : 'eye-cross'} />
                </td>
            </tr>
            <tr className={showedItems.includes(item.id) ? '' : 'hidden'}>
                <td colSpan={2} className="translations" style={{ paddingLeft: '16px' }}>
                    <i className="trans-fr" />
                    <div className="    float-left ml-5 mb-5 translations-msg">
                        <textarea
                            rows={10}
                            name={`message_fr_${item.id}`}
                            className="form-control sm d-inline-block align-middle"
                            value={translationFr}
                            onChange={(e) => setTranslationFr(e.target.value)}
                        />
                    </div>
                    <div className="clear-both" />
                    <i className="trans-en" />
                    <div className="float-left ml-5 mb-5 translations-msg">
                        <textarea
                            rows={10}
                            name={`message_en_${item.id}`}
                            className="form-control sm d-inline-block align-middle"
                            value={translationEn}
                            onChange={(e) => setTranslationEn(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        className="gradient-btn"
                        onClick={() => {
                            const values: any = {};
                            values.translationEn = translationEn;
                            values.translationFr = translationFr;
                            values.id = item.id;
                            dispatch(submitDefaultFormAction(values));
                        }}>
                        {t('Save')}
                    </button>
                </td>
            </tr>
        </>
    );
};

export default Row;
