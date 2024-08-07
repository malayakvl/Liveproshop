/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import moment from "moment";

const OrderCounter: React.FC<any> = ({ endDate }) => {
    const [timerValueDays, setTimerValueDays] = useState(0);
    const [timerValueHours, setTimerValueHours] = useState(0);
    const [timerValueMunites, setTimerValueMinutes] = useState(0);
    const [timerValueSeconds, setTimerValueSeconds] = useState(0);

    // console.log('Order period from db', endDate);
    // const userTimezoneOffset = new Date(endDate);
    const _now = new Date().getTime();
    const _tmpDateToLocale = new Date(endDate).toLocaleString();
    const _tmpDateToIco = new Date(new Date(endDate).toISOString());
    // console.log('To Locale String', _tmpDateToLocale);
    // console.log('To Locale String', new Date(_tmpDateToIco));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // console.log('Diff', _tmpDateToIco - _now);

    const x = setInterval(function () {
        // Get today's date and time
        const now = new Date().getTime();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const countDownDate = new Date(endDate).toLocaleString();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // const distance = new Date(countDownDate) - now;
        // const distance = countDownDate - now;
        const distance = _tmpDateToIco - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimerValueDays(days);
        setTimerValueHours(hours);
        setTimerValueMinutes(minutes);
        setTimerValueSeconds(seconds);
    }, 1000);

    return (
        <>
            <div className="float-left mt-[-9px] ml-[10px]">
                <div className="countdown-value countdown-value countdown-small">
                    <span className="red-yellow-gradient-text counter-caption-time-small">
                        {timerValueDays >= 0 ? timerValueDays : 0}
                    </span>
                </div>
                <div className="countdown-value countdown-value countdown-small">
                    <span className="red-yellow-gradient-text counter-caption-time-small">
                        {timerValueHours >= 0 ? timerValueHours : 0}
                    </span>
                </div>
                <div className="countdown-value countdown-value countdown-small">
                    <span className="red-yellow-gradient-text counter-caption-time-small">
                        {timerValueMunites >= 0 ? timerValueMunites : 0}
                    </span>
                </div>
                <div className="countdown-value countdown-value countdown-small">
                    <span className="red-yellow-gradient-text counter-caption-time-small">
                        {timerValueSeconds >= 0 ? timerValueSeconds : 0}
                    </span>
                </div>
            </div>
        </>
    );
};

export default OrderCounter;
