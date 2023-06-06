import Image from 'next/image';
import React from 'react';
import { useTranslations } from 'next-intl';

interface PropsContent {
    locale: string;
}
const Scenario: React.FC<PropsContent> = ({ locale }) => {
    const t = useTranslations();
    return (
        <>
            {locale == 'fr' ? (
                <>
                    <h2 className="dark-blue-header block mb-[20px]">
                        Alors, qu`est-ce qu`un scénario?
                    </h2>
                    <div className="text-gray-350 text-[20px] leading-[30px]">
                        <span>
                            Easy, a Scenario - is a tool that helps you to interact with your
                            audience.
                        </span>
                        <div className="mt-[15px] mb-[30px]">
                            <b>There are two types of scenarios in the system:</b>
                            <ul className="list-disc pt-[15px] pl-[20px]">
                                <li>{t(`Default scenarios`)}</li>
                                <li>{t(`Custom scenarios`)}</li>
                            </ul>
                        </div>
                        <h2 className="dark-blue-header block mb-[20px]">
                            {t(`Default scenarios`)}
                        </h2>
                        <span className="text-gray-350 text-[20px] leading-[30px]">
                            Default Scenarios can not be edited or deleted, they are for view only.
                            You can find them under the “System replies” title.
                        </span>
                        <div className="my-12 mb-24 text-center">
                            <Image src="/images/guides/scenario1.png" width={994} height={425} />
                        </div>
                        <div className="rounded-gray-block">
                            <h2 className="dark-blue-header mb-4 text-[18px]">
                                {t(`There are 6 main system scenarios:`)}
                            </h2>
                            <ul className="list-disc pl-[20px] text-[16px]">
                                <li>
                                    Buyer successfully added wanted item to his cart *for the first
                                    time/ first item of the live
                                </li>
                                <li>
                                    Buyer successfully added wanted item to his cart (not the first
                                    time)
                                </li>
                                <li>Buyer’s comment wasn’t recognized by the system</li>
                                <li>
                                    Wanted item is not available anymore/buyer is put on waiting
                                    list
                                </li>
                                <li>
                                    Wanted item becomes available/buyer off waiting list Live
                                    session is over
                                </li>
                            </ul>
                        </div>
                        <h2 className="dark-blue-header mb-4 text-[18px] mt-[40px]">
                            Custom scenarios
                        </h2>
                        <div>
                            Custom scenarios are the ones <b>you can add/edit/delete</b>. They are
                            designed to help you to interact and communicate with your audience. You
                            can use them for quiz, questionnaires or just for fun.
                            <p className="block mt-[10px] mb-[15px]">
                                <b>
                                    There are a few steps on how to use them to get the maximum
                                    benefit:
                                </b>
                            </p>
                        </div>
                        <div className="text-gray-350 text-[20px] leading-[30px] font-bold">
                            {t(
                                ` 1. In order to add new scenario click on the “Add new reply” button here`
                            )}
                        </div>
                        <div className="my-12 mb-24 text-center">
                            <Image src="/images/guides/scenario2.png" width={994} height={425} />
                        </div>
                        <div className="text-gray-350 text-[20px] leading-[30px] font-bold">
                            {t(`2. You will see the following form`)}
                        </div>
                        <div className="my-12 mb-24 text-center">
                            <Image src="/images/guides/scenario2.png" width={994} height={425} />
                        </div>
                        <div>
                            Now fill it up, <b>Save your changes</b> and you are set!
                        </div>
                        <h2 className="dark-blue-header mb-4 text-[18px] mt-[40px]">
                            {t(`Rules for populating the fields correctly`)}
                        </h2>
                        <div className="overflow-x-scroll">
                            <table
                                className="table-auto guide-table text-[14px] w-full min-w-[1026px]"
                                style={{ lineHeight: '20px' }}>
                                <thead>
                                    <tr
                                        className="text-xs"
                                        style={{ borderBottom: 'solid 1px #EEF1F7' }}>
                                        <th className="w-32 py-4">{t('Field')}</th>
                                        <th>{t('Rule')}</th>
                                        <th>{t('Example')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        style={{
                                            borderBottom: 'solid 1px #EEF1F7'
                                        }}>
                                        <td className="py-[8px] font-bold align-top">
                                            {t(`Name`)}
                                        </td>
                                        <td className="py-[8px] align-top">
                                            {t(`Type a unique name of your scenario`)}
                                        </td>
                                        <td className="py-[8px] align-top">
                                            {t(`Main male actor in the “Beautiful Mind” movie?`)}
                                        </td>
                                    </tr>
                                    <tr
                                        style={{
                                            borderBottom: 'solid 1px #EEF1F7'
                                        }}>
                                        <td className="py-[8px] align-top">
                                            <b>{t(`Trigger words`)}</b>
                                        </td>
                                        <td className="py-[8px] align-top w-[40%]">
                                            <p className="block my-[10px]">
                                                Here you should point correct answer to your should
                                                LWAYS use the word QUESTION and its number right
                                                after (no space needed)
                                            </p>
                                            <p className="block my-[10px]">
                                                <b>Example:</b>
                                            </p>
                                            <p className="block my-[10px]">
                                                “Question1 Russell Crowe”
                                            </p>
                                            <p className="block my-[10px]">
                                                In case there are several correct answers they
                                                should be separated with the pipe symbol (vertical
                                                bar) - |
                                            </p>
                                            <p className="block my-[10px]">
                                                <b>Example:</b>
                                            </p>
                                            <p className="block my-[10px]">
                                                “Question1 Russell Crowe|Paul Bettany”
                                            </p>
                                            <p className="block my-[10px]">
                                                <b
                                                    style={{
                                                        color: '#FBB400',
                                                        padding: '20px 0px',
                                                        display: 'block'
                                                    }}>
                                                    IMPORTANT!
                                                </b>
                                            </p>
                                            <p className="block my-[10px]">
                                                Your viewers should also use the word
                                            </p>
                                            <p className="block my-[10px]">
                                                <b>QUESTION</b> and its number, so please don’t
                                                forget to give them clear instructions. In case a
                                                viewer wants to write several answers to one
                                                question, he should write:
                                            </p>
                                            <p className="block my-[10px]">
                                                Word “question”(and its number right after), one
                                                space and answer “Russell Crowe”, then space again
                                                and the second answer “Paul Bettany”.
                                            </p>
                                        </td>
                                        <td className="py-[8px] w-[40%] align-top">
                                            <p className="block mb-[10px]">
                                                <b>Single answer question:</b>
                                            </p>
                                            <p className="block my-[10px]">
                                                Question1 Russell Crowe
                                            </p>
                                            <p className="block my-[10px]">
                                                <b>Multiple answers questions:</b>
                                            </p>
                                            <p className="block my-[10px]">
                                                Question1 Russell Crowe|Paul Bettany
                                            </p>
                                            <p className="block my-[10px]">
                                                <b>
                                                    Example of the viewer’s comment with one answer:
                                                </b>
                                            </p>
                                            <p className="block my-[10px]">
                                                Question1 Russell Crowe
                                            </p>
                                            <p className="block my-[10px]">
                                                <b>
                                                    Example of the viewer’s comment with several
                                                    answers:
                                                </b>
                                            </p>
                                            <p className="block my-[10px]">
                                                Question1 Russell Crowe Paul Bettany
                                            </p>
                                        </td>
                                    </tr>
                                    <tr
                                        style={{
                                            borderBottom: 'solid 1px #EEF1F7'
                                        }}>
                                        <td className="py-[8px] font-bold align-top">
                                            Max answer count
                                        </td>
                                        <td className="py-[8px] align-top">
                                            Here you can point how many correct answers will be
                                            accepted.
                                        </td>
                                        <td className="py-[8px] align-top">
                                            <p className="block mb-[10px]">
                                                If you have 3 gifts to 3 winners, you should choose
                                                number 3 in the dropdown.
                                            </p>
                                            <p className="block my-[10px]">
                                                Then first 3 people who’d write correct answer
                                                (Russell Crowe) will receive a message and a link to
                                                your gift (product in the system).
                                            </p>
                                        </td>
                                    </tr>
                                    <tr
                                        style={{
                                            borderBottom: 'solid 1px #EEF1F7'
                                        }}>
                                        <td className="py-[8px] font-bold align-top">Product</td>
                                        <td className="py-[8px] align-top">
                                            <p className="block mb-[10px]">
                                                Here you may choose a product that will be attached
                                                to this specific scenario and will be sent to the
                                                winner of your quiz.
                                            </p>
                                            <p className="block my-[10px]">
                                                You may add <b>only one</b> product
                                            </p>
                                        </td>
                                        <td className="py-[8px] align-top">
                                            <p className="block mb-[10px]">
                                                If you have 3 gifts to 3 winners, you should choose
                                                number 3 in the dropdown.
                                            </p>
                                            <p className="block my-[10px]">
                                                Then first 3 people who’d write correct answer
                                                (Russell Crowe) will receive a message and a link to
                                                your gift (product in the system).
                                            </p>
                                        </td>
                                    </tr>
                                    <tr
                                        style={{
                                            borderBottom: 'solid 1px #EEF1F7'
                                        }}>
                                        <td className="py-[8px] font-bold align-top">Discount</td>
                                        <td className="py-[8px] align-top">
                                            Here you may define a discount for your product
                                            manually. And this discount will be applied to the
                                            product price.
                                        </td>
                                        <td className="py-[8px] align-top">
                                            <p className="block mb-[10px]">
                                                You have added a t-shirt with Russell Crowe print on
                                                it and costs $20. And you want to give it as a gift
                                                to the first person who answered your question
                                                correctly. You should type100 in the 100 in the
                                                discount field and the system will put a price of $0
                                                for this
                                            </p>
                                            <p className="block my-[10px]">
                                                Or you may just make a regular discount of 20%, 30%,
                                                etc.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr
                                        style={{
                                            borderBottom: 'solid 1px #EEF1F7'
                                        }}>
                                        <td className="py-[8px] font-bold align-top">
                                            French - English
                                            <br />
                                            message field
                                        </td>
                                        <td className="py-[8px] align-top">
                                            Here you can write a message that winner will receive in
                                            French or English version
                                        </td>
                                        <td className="py-[8px] align-top">
                                            <p className="block mb-[10px]">
                                                Hey, you’ve just won a quiz!
                                            </p>
                                            <p className="block my-[10px]">
                                                Here’s the link to your gift (system will
                                                automatically insert the link)
                                            </p>
                                            <p className="block my-[10px]">
                                                You need to pay for shipping only
                                            </p>
                                            <p className="block my-[10px]">Have a nice day!</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="dark-blue-header block mb-[20px]">So, what is a Scenario?</h2>
                </>
            )}
        </>
    );
};
export default Scenario;
