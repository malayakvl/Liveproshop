import Head from 'next/head';
import { getSession } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentSessionAction } from '../../redux/chatbot';
import { saveMessageAction } from '../../redux/chatbot/actions';
import { liveActiveSessionsSelector } from '../../redux/chatbot/selectors';
import moment from 'moment';

export default function Index({ session }: { session: any }) {
    if (!session) return <></>;
    const t = useTranslations();
    const dispatch = useDispatch();
    const items = useSelector(liveActiveSessionsSelector);
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [message, setMessage] = useState<any>('');
    const saveMessage = () => {
        dispatch(
            saveMessageAction(selectedSession, [
                {
                    id: moment().valueOf(),
                    message: message,
                    from: { name: `Test ${moment().valueOf()}`, id: moment().valueOf() },
                    created_time: moment.utc().valueOf()
                }
            ])
        );
        setMessage('');
        // [
        // {"id": 126577551217100, "message": "Отличное фото 1", "from": { "name": "Joe Commenter", "id": 126577551217199 }},
        // {"id": 126577551217101, "message": "Отличное фото 2", "from": { "name": "Joe Commenter", "id": 126577551217199 }}
        // ]
    };

    useEffect(() => {
        dispatch(fetchCurrentSessionAction());
    }, []);

    return (
        <>
            <Head>
                <title>Amadeo CRM - Training section</title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-big">
                <div className="page-title">
                    <h1>Training section</h1>
                    <div className="clear-both" />
                </div>
            </div>
            <div className="block-white-8 mr-10 white-shadow-medium mt-10">
                <ul className="mt-10 w-1/2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {items.map((session: any) => (
                        <li
                            className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600"
                            key={session.id}>
                            <input type="radio" onClick={() => setSelectedSession(session.id)} />
                            {session.id} {':  '}
                            {moment(session.event_date).format('DD/MM/YYYY')} at{' '}
                            {session.event_time}, scenarios: {session.scenarios}
                        </li>
                    ))}
                </ul>
                <div className="mt-10">
                    <div className="mb-4">
                        <label className="control-label">{t('Message')}</label>
                        <textarea
                            className="form-control"
                            placeholder={t('Message')}
                            onChange={(e) => {
                                setMessage(e.target.value);
                            }}
                            value={message}
                            name="message"
                        />
                    </div>
                    <button type="submit" className="gradient-btn" onClick={() => saveMessage()}>
                        {t('Send')}
                    </button>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context: any) {
    const { locale } = context;
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: { destination: `/${locale === 'fr' ? '' : `${locale}/`}auth/signin` }
        };
    }

    return {
        props: {
            session,
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
