// Each table pagination and controls meta stored to redux separately
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
export const baseApiUrl = publicRuntimeConfig.apiUrl;

export enum PaginationType {
    NOTIFICATIONS = 'notifications',
    PRODUCTS = 'products',
    CHATBOT = 'chatbot',
    SHIPPING = 'shipping',
    LIVESESSIONS = 'livesessions',
    PAYMENTS = 'payments',
    BUYERS = 'buyers',
    ORDERS = 'orders',
    WAITING = 'waiting',
    SELLERS = 'sellers',
    DASHBOARD = 'dashboard'
}

export const TableHeaders: { [key in PaginationType]: Type.DataTableHeader[] } = {
    [PaginationType.PRODUCTS]: [
        { titleKey: null, className: 'option-switcher' },
        { titleKey: 'Photo' },
        { sortKey: 'products.name', titleKey: 'Reference | Name | Description' },
        { titleKey: null, className: 'inventory-color' },
        { titleKey: null, className: 'inventory-size' },
        { titleKey: null, className: 'inventory-qty' },
        { titleKey: 'Price', className: 'inventory-price' },
        { titleKey: 'Actions', className: 'actions' }
    ],
    [PaginationType.NOTIFICATIONS]: [],
    [PaginationType.CHATBOT]: [
        { titleKey: null, className: 'option-switcher' },
        { sortKey: 'scenario', titleKey: 'Scenario', iconClass: 'scenario' },
        { titleKey: 'Trigger', iconClass: 'message' },
        { titleKey: 'Product' },
        { titleKey: 'Discount (%)' },
        { titleKey: 'Answers' },
        { titleKey: null, iconClass: 'eye', className: 'chat-eye' },
        { titleKey: null, className: 'actions' }
    ],
    [PaginationType.SHIPPING]: [
        { className: 'table-dropdown' },
        { className: 'table-number' },
        { titleKey: 'Shipping Method' },
        { className: 'shipping-logo' },
        { className: 'option-switcher' },
        { className: 'shipping-countries' },
        {}
    ],
    [PaginationType.LIVESESSIONS]: [
        { titleKey: null, iconClass: 'icon-tbl-date' },
        { titleKey: 'Start Time', iconClass: 'icon-tbl-time' },
        { titleKey: 'Duration Cart', iconClass: 'icon-tbl-cart' },
        { titleKey: null, iconClass: 'icon-tbl-status' }
        // { titleKey: 'Participants', iconClass: 'icon-tbl-users' },
        // { titleKey: 'Products' }
    ],
    [PaginationType.PAYMENTS]: [
        { titleKey: null, iconClass: 'icon-tbl-order' },
        { titleKey: null, iconClass: 'icon-tbl-date' },
        // { titleKey: null, iconClass: 'icon-tbl-order', className: 'flex justify-center' },
        { titleKey: 'Shopper', iconClass: 'icon-tbl-users' },
        { titleKey: null, iconClass: 'icon-tbl-amount' },
        { titleKey: 'Total', className: 'text-right' },
        { titleKey: null }
    ],
    [PaginationType.BUYERS]: [
        { iconClass: 'icon-tbl-triangle' },
        // { className: 'flex justify-center', iconClass: 'icon-tbl-index' },
        { iconClass: 'icon-tbl-users', titleKey: 'Shopper' },
        { className: 'flex justify-center', iconClass: 'icon-tbl-phone' },
        { iconClass: 'icon-tbl-address', titleKey: 'Address' },
        { className: 'flex justify-center', iconClass: 'icon-tbl-order', titleKey: 'Orders' },
        { className: 'text-right', titleKey: 'Total Spent' }
    ],
    [PaginationType.ORDERS]: [
        { iconClass: 'icon-tbl-triangle' },
        { sortKey: 'orders.order_number', iconClass: 'icon-tbl-order' },
        { sortKey: 'orders.status', iconClass: 'icon-tbl-status' },
        { sortKey: 'orders.created_at', iconClass: 'icon-tbl-date' },
        { sortKey: 'users__buyer.first_name', titleKey: 'Shopper', iconClass: 'icon-tbl-users' },
        { sortKey: 'countries.iso', iconClass: 'icon-tbl-country' },
        // { sortKey: 'orders.shipping_id', iconClass: 'icon-tbl-sh-cart' },
        { sortKey: 'shipping.name', iconClass: 'icon-tbl-sh-cart' },
        { sortKey: 'payments.name', iconClass: 'icon-tbl-card' },
        { titleKey: 'Products' },
        { sortKey: 'orders.order_amount', titleKey: 'Total' }
    ],
    [PaginationType.SELLERS]: [
        // { className: 'flex justify-center', iconClass: 'icon-tbl-index' },
        { iconClass: 'icon-tbl-users', titleKey: 'Seller' },
        { titleKey: 'Transaction Percent' },
        // { sortKey: 'users__seller.phone', className: '', iconClass: 'icon-tbl-phone' },
        // { sortKey: 'countries.name', iconClass: 'icon-tbl-country', titleKey: 'Country' },
        // { sortKey: 'full_address', iconClass: 'icon-tbl-address', titleKey: 'Address' },
        {
            className: 'justify-center',
            iconClass: 'scenario',
            titleKey: 'Live Sessions',
            sortKey: 'total_sessions'
        },
        { sortKey: 'total_buyers', iconClass: 'icon-tbl-order', titleKey: 'Shoppers' },
        { sortKey: 'total_orders', iconClass: 'icon-tbl-order', titleKey: 'Orders' },
        { sortKey: 'total_amount', titleKey: 'Total Revenue' },
        {
            sortKey: 'users__seller.created_at',
            titleKey: 'Creation Date',
            iconClass: 'icon-tbl-date'
        },
        { titleKey: 'Subscription End' },
        { iconClass: 'icon-tbl-keys', titleKey: '' },
        { iconClass: 'icon-tbl-keys', titleKey: 'LogIn' }
    ],
    [PaginationType.WAITING]: [
        { iconClass: 'icon-tbl-triangle' },
        { titleKey: 'Photo' },
        { titleKey: 'Reference | Name | Description' },
        { titleKey: null, className: 'inventory-color' },
        { titleKey: null, className: 'inventory-size' },
        { sortKey: 'oi.total_quantity', titleKey: null, className: 'inventory-qty' },
        { sortKey: 'oi.total_price', titleKey: 'Price', className: 'inventory-price' },
        // { sortKey: 'created_at', iconClass: 'icon-tbl-date' },
        {
            sortKey: 'order_items_waiting_list.id_cnt',
            titleKey: 'Shopper',
            iconClass: 'icon-tbl-users'
        },
        { titleKey: 'Change quantity' }
        // { titleKey: 'Run' }
        // { sortKey: 'country', iconClass: 'icon-tbl-sh-cart' },
        // { sortKey: 'payment', iconClass: 'icon-tbl-card' },
        // { titleKey: 'Products' },
        // { titleKey: 'Total' }
    ],
    [PaginationType.DASHBOARD]: []
};

export enum OrderStatus {
    NEW = 'new',
    PAYED = 'payed',
    SHIPPED = 'shipped',
    CANCELED = 'canceled'
}

export enum UserRole {
    ADMIN = 3,
    CUSTOMER = 2,
    BUYER = 1
}