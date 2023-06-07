import Image from 'next/image';
import React from 'react';
import { useTranslations } from 'next-intl';

// interface PropsContent {
//     locale: string;
// }
const Livesession: React.FC = () => {
    const t = useTranslations();

    return (
        <>
            <span className="text-gray-350 text-[20px] leading-[30px]">{t('guide_head_text')}</span>
            <div className="rounded-gray-block">
                <h2 className="dark-blue-header mb-4 text-[18px]">{t('Remarque!')}</h2>
                <div className="text-base text-gray-550">
                    {t('remarque_text')}
                    &nbsp;
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a target="_blank" href="https://liveproshop.com/settings" rel="noreferrer">
                        https://liveproshop.com/settings
                    </a>
                </div>
            </div>
            <h2 className="dark-blue-header block mb-[10px] mt-[30px]">
                {t('Comment programmer une nouvelle session')}
            </h2>
            {/*How to Facebook and Livesession*/}
            <span className="text-gray-350 text-[20px] leading-[30px]">{t(`guide_1`)}</span>
            <div className="my-12 mb-24 text-center">
                <Image src="/images/guides/liveselling1.png" width={994} height={425} />
            </div>
            <span className="text-gray-350 text-[20px] leading-[30px]">{t(`guide_2`)}</span>
            <div className="my-12 mb-24 text-center">
                <div className="img-shadow">
                    <Image src="/images/guides/liveselling2.png" width={992} height={432} />
                </div>
            </div>
            <span className="text-gray-350 text-[20px] leading-[30px]">{t('guide_3')}</span>
            <div className="my-12 mb-24 text-center">
                <Image src="/images/guides/liveselling3.png" width={374} height={327} />
            </div>
            <span className="text-gray-350 text-[20px] leading-[30px]">{t('guide_4')}</span>
            <div className="my-12 mb-24 text-center">
                <div className="img-shadow">
                    <Image src="/images/guides/liveselling4.png" width={795} height={400} />
                </div>
            </div>
            <h2 id="session-comment" className="dark-blue-header block mb-[10px] mt-[30px]">
                {t('Comment arrêter le live?')}
            </h2>
            <span className="text-gray-350 text-[20px] leading-[30px]">{t('text_stop')}</span>
            <div className="my-12 mb-24 text-center">
                <div className="img-shadow">
                    <Image src="/images/guides/liveselling5.png" width={795} height={517} />
                </div>
            </div>

            <div id="session-remarque" className="rounded-gray-block">
                <h2 className="dark-blue-header mb-4 text-[18px]">{t('inportant_note')}</h2>
                <div className="text-base text-gray-350">{t('text_remarque_stop')}</div>
            </div>
        </>
    );
};
export default Livesession;
