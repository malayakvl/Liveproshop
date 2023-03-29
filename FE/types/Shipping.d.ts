interface Shipping {
    countries: Array<{ id: number; price: number; iso: string; country_name: any }>;
    id: number;
    name: string;
    image: string;
    status: boolean;
    status__customer_disabled_shipping: boolean;
}

interface ShippingMethod {
    id: number;
    name: string;
    price: number;
    image: string;
    status: boolean;
}
