import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '../../lib/functions';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/user/selectors';

const Totals: React.FC<{ totals: Dashboard.Totals; roleId: number }> = ({
    totals = {},
    roleId = {}
}) => {
    const t = useTranslations();
    const user = useSelector(userSelector);

    return (
        <>
            <div className="w-full border-b md:border-b-0 mb-4 md:mb-0 flex flex-col w-full md:w-full  lg:w-1/4 xl:w-1/5 justify-center align-middle">
                <span className="font-bold text-sm text-blue-350">
                    {user.role_id == 2 ? t('Total Revenue') : t('Total Spent')}
                </span>
                <div className="">
                    <Image src="/images/dashboard-card.svg" width={20} height={18} />
                    <span className="ml-3 font-bold text-gray-350 text-2xl">
                        {formatCurrency(totals.total_amount ?? 0)}
                    </span>
                </div>
            </div>
            {roleId !== 1 && (
                <div className="w-full border-b md:border-b-0 mb-4 md:mb-0 flex flex-col md:w-full lg:w-1/4 xl:w-1/5 justify-center align-middle md:mb-0 md:pl-4 md:border-l">
                    <span className="font-bold text-sm text-blue-350">{t('Shoppers')}</span>
                    <div className="">
                        <Image src="/images/dashboard-customers.svg" width={20} height={18} />
                        <span className="ml-3 font-bold text-gray-350 text-2xl">
                            {totals.total_buyers}
                        </span>
                    </div>
                </div>
            )}
            <div className="w-full border-b md:border-b-0 mb-4 md:mb-0 flex flex-col md:w-full lg:w-1/4 xl:w-1/5 justify-center align-middle md:pl-4 md:border-l">
                <span className="font-bold text-sm text-blue-350">{t('Pending orders')}</span>
                <div className="">
                    <Image src="/images/dashboard-invoices.svg" width={20} height={20} />
                    <span className="ml-3 font-bold text-gray-350 text-2xl">
                        {totals.total_pending}
                    </span>
                </div>
            </div>
        </>
    );
};

export default Totals;
