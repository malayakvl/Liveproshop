import React, { useEffect, useRef, useState } from 'react';
import useInterval from '@use-it/interval';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestAction } from '../../redux/notifications';
import { cntNewSelector, latestNoticeSelector } from '../../redux/notifications/selectors';
import { CogIcon } from '@heroicons/react/solid';
import { useTranslations } from 'next-intl';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { baseApiUrl } from '../../constants';

const NoticeCounter = ({ delay = 1000 }) => {
    const dispatch = useDispatch();
    const noticeCnt = useSelector(cntNewSelector);
    const node = useRef<HTMLDivElement>(null);
    const latestNotice = useSelector(latestNoticeSelector);
    const [showLatest, setShowLatest] = useState(false);
    const t = useTranslations();

    useInterval(() => {
        dispatch(fetchLatestAction());
    }, delay);

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    const handleClick = (e: any) => {
        if (
            e.target.nodeName.toLowerCase() === 'img' ||
            e.target.parentNode.classList.contains('notice-block')
        ) {
            return;
        }
        setShowLatest(false);
    };

    return (
        <div className="notice-block relative">
            <div className={`inline-block mt-2.5 ${noticeCnt > 0 ? 'cursor-pointer' : ''}`}>
                <Image
                    src="/images/bell.svg"
                    width={16}
                    height={20}
                    layout="fixed"
                    role="presentation"
                    onClick={() => setShowLatest(!showLatest)}
                    alt=""
                />
            </div>
            {noticeCnt > 0 && <span className="counter">{noticeCnt}</span>}
            {showLatest && noticeCnt > 0 && (
                <div className="notice-menu" ref={node}>
                    <div className="corner" />
                    {latestNotice.map((notice: Notifications.Notification) => (
                        <div key={notice.id} className="notice-item">
                            <div className="notice-photo">
                                {(notice.type === 'system' || !notice.sender_photo) && (
                                    <CogIcon
                                        className="border rounded-full"
                                        width={24}
                                        height={24}
                                    />
                                )}
                                {notice.sender_photo && (
                                    <Image
                                        className="border rounded-full"
                                        alt=""
                                        width={24}
                                        height={24}
                                        src={baseApiUrl + notice.sender_photo}
                                        layout="fixed"
                                    />
                                )}
                            </div>
                            <div className="notice-text">
                                <div className="notice-row">
                                    <div className="text-xs font-bold">
                                        <span className="subject">{notice.subject}</span>
                                        <span className="text-gray-350">Liis Ristal</span>
                                        <span className="text-gray-450">{notice.message}</span>
                                        <span className="text-gray-180">
                                            {moment(notice.created_at).fromNow()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Link href={'/notifications'}>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a
                            role="presentation"
                            onClick={() => setShowLatest(!showLatest)}
                            className="view-all m-auto block text-center">
                            {t('See all 999 notifications')}
                        </a>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NoticeCounter;
