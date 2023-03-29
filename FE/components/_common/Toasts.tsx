import React, { memo, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';
import { useDispatch, useSelector } from 'react-redux';
import { toastsSelector } from '../../redux/layouts/selectors';
import { deleteToastAction } from '../../redux/layouts';
import { useTranslations } from 'next-intl';

const ToastClassNamesMap = {
    error: 'alert-danger',
    success: 'alert-success',
    info: 'alert-info'
};

const Toasts: React.FC = () => {
    const toasts = useSelector(toastsSelector);

    const transitions = useTransition(toasts, (item) => item.id, {
        from: { transform: 'translate(360px, 0)', opacity: 1 },
        enter: { transform: 'translate(0px, 0)' },
        leave: { opacity: 0 }
    });

    return (
        <div style={{ position: 'fixed', top: 5, right: 5, zIndex: 2000, overflow: 'hidden' }}>
            {transitions.map(({ item, props, key }) => (
                <animated.div key={key} style={props}>
                    <Toast {...item} />
                </animated.div>
            ))}
        </div>
    );
};

// eslint-disable-next-line react/display-name
const Toast: React.FC<Layouts.Toast> = memo(({ id, type, message }) => {
    const t = useTranslations();
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => dispatch(deleteToastAction(id)), 4000);
    }, [id, message, dispatch]);

    return (
        <div className={ToastClassNamesMap[type]} style={{ minWidth: 350, marginBottom: 10 }}>
            {/*<BootstrapToast.Header closeButton={false}>*/}
            {/*    <i className={ToastIconsMap[type]} />*/}
            {/*    <strong className="ml-2">{getIntl(ToastHeadersMap[type])}</strong>*/}
            {/*</BootstrapToast.Header>*/}
            <div className="text-sm flex-grow ml-3">
                {typeof message === 'object'
                    ? t(message.key, (message as any).options)
                    : t(message)}
            </div>
        </div>
    );
});

export default Toasts;
