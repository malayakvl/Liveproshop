import React from 'react';
import { useTranslations } from 'next-intl';

function About() {
    const t = useTranslations();

    return (
        <>
            <div className="flex">
                <div className="container w-full">
                    <h1 className="page-heading text-center">{t('About Liveproshop')}</h1>
                    <div className="faq-block">
                        <div className="page" title="Page 1">
                            <div className="flex">
                                <div className="w-1/2 mr-4">
                                    <div className="block mb-3">{t('about_text_1')}</div>
                                    <div className="block mt-4">{t('about_text_2')}</div>
                                    <div className="block mt-4">{t('about_text_3')}</div>
                                    <div className="block mt-4">{t('about_text_4')}</div>
                                    <div className="block mt-4">{t('about_text_5')}</div>
                                </div>
                                <div className="w-1/2">
                                    {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2029.2345459503692!2d24.747794277143107!3d59.429162674662756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692949f56ece403%3A0x76212edf06ed0339!2zVGF0YXJpIDI1LCAxMDExNiBUYWxsaW5uLCDQrdGB0YLQvtC90LjRjw!5e0!3m2!1sru!2sua!4v1683719543452!5m2!1sru!2sua"
                                        width="600"
                                        height="450"
                                        style={{ border: '0' }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;
