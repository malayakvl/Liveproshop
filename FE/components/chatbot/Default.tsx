import React, { Fragment, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { itemsSystemSelector } from '../../redux/chatbot/selectors';
import { RowDefault, Row } from './index';
import { fetchDataSystemAction, fetchFormAction } from '../../redux/chatbot';

const DefaultMessages: React.FC<any> = ({ user }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const items = useSelector(itemsSystemSelector);

    useEffect(() => {
        dispatch(fetchDataSystemAction('system'));
    }, []);

    const handleEditBtnClick = useCallback(
        (event: React.SyntheticEvent): void => {
            const id = Number(event.currentTarget.getAttribute('data-id'));
            dispatch(fetchFormAction(id));
        },
        [items, dispatch]
    );

    return (
        <>
            <div className="flex border border-l-0 border-r-0 border-t-0 pb-5 mb-10">
                <h2 className="dark-blue-header">
                    {t('System Replies')}
                    <span className="text-gray-180 font-normal text-sm"> ({t('Mandatory')})</span>
                </h2>
            </div>
            <div className="system-message overflow-x-scroll">
                <table className="w-full float-table">
                    <thead>
                        <tr>
                            {/*<th />*/}
                            {/*<th />*/}
                            <th style={{ textAlign: 'left' }}>
                                <i className="scenario" />
                                {t('Scenario')}
                            </th>
                            {/*<th className="text-left">*/}
                            {/*    <i className="message" />*/}
                            {/*    {t('Trigger')}*/}
                            {/*</th>*/}
                            <th />
                            {/*<th />*/}
                            {/*<th />*/}
                            <th className="chat-eye sorting_disabled">
                                <i className="eye" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items?.map((item: any) => (
                            <Fragment key={item.id}>
                                {user.role_id === 3 && (
                                    <RowDefault
                                        key={item.id}
                                        item={item}
                                        user={user}
                                        handleEditBtnClick={handleEditBtnClick}
                                    />
                                )}
                                {user.role_id !== 3 && (
                                    <Row
                                        key={item.id}
                                        item={item}
                                        user={user}
                                        handleEditBtnClick={handleEditBtnClick}
                                    />
                                )}
                            </Fragment>
                            // <RowDefault
                            //     key={item.id}
                            //     item={item}
                            //     user={user}
                            //     handleEditBtnClick={handleEditBtnClick}
                            // />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default DefaultMessages;
