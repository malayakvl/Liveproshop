export function parseTranslation(option: any, field: string, locale: string) {
    if (!option) return;
    if (option.translations) {
        const findedOption = option.translations.find(
            (data: any) => Object.keys(data)[0] === locale
        );
        if (findedOption) {
            return findedOption[locale][field];
        } else {
            return option[field];
        }
    } else {
        return option[field];
    }
}

export function prepareAdditionalDropdown(dataArr: any, locale: string) {
    const _data: any = [];
    if (dataArr) {
        dataArr.forEach((data: any) => {
            _data.push({ label: parseTranslation(data, 'name', locale), value: data.id });
        });
    }
    return _data;
}

export function prepareCountriesDropdown(dataArr: any, locale: string) {
    const _data: any = [];
    if (dataArr) {
        dataArr.forEach((data: any) => {
            _data.push({ label: parseTranslation(data, 'nicename', locale), value: data.id });
        });
    }
    return _data;
}

export function prepareTagsDropdown(dataArr: any, locale: string) {
    const _data: any = [];
    if (dataArr) {
        dataArr.forEach((data: any) => {
            _data.push({ name: parseTranslation(data, 'name', locale), id: data.id });
        });
    }

    return _data;
}

export function authHeader(email: string) {
    const token = Buffer.from(
        `${email}:c0P1JUlc-aKiH4qun-Cvapfn60-F7cG9NUM-knCw0x9e-6PWxPEjf-7mtEJZzC-q0mxxn0D`,
        'utf8'
    ).toString('base64');
    return { Authorization: `Bearer ${token}` };
}

export const toggleModalConfirmation = () => {
    // const body = document.querySelector('body');
    const modal = document.querySelector('.modal-confirmation');
    (modal as any).classList.toggle('opacity-0');
    (modal as any).classList.toggle('pointer-events-none');
    (modal as any).classList.toggle('modal-active');
};
export const toggleCalendlyModalConfirmation = () => {
    // const body = document.querySelector('body');
    const modal = document.querySelector('.modal-calendly');
    (modal as any).classList.toggle('opacity-0');
    (modal as any).classList.toggle('pointer-events-none');
    (modal as any).classList.toggle('modal-active');
};
export const toggleModalPopup = (element: any) => {
    // const body = document.querySelector('body');
    const modal = document.querySelector(element);
    (modal as any).classList.toggle('opacity-0');
    (modal as any).classList.toggle('pointer-events-none');
    (modal as any).classList.toggle('modal-active');
};

// export const isNumeric = (str: any) => {
//     if (typeof str != 'string') return false;
//     return (
//         !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
//         !isNaN(parseFloat(str));
// }
export function isNumber(value: string | number): boolean {
    return value != null && value !== '' && !isNaN(Number(value.toString()));
}

// export function formatCurrency(value: number): string {
//     return typeof value === 'number' ? +value.toFixed(2) + ' €' : ;
// }

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
}
