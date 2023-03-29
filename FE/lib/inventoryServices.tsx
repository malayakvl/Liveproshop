import { parseTranslation } from './functions';

export function prepareConfigValues(values: any, selectedColors: any, selectedSizes: any) {
    const configurations: {
        color_id: number | null;
        size_id: number | null;
    }[] = [];
    const configData: {
        price: number | null;
        qty: number | null;
        sku: string | null;
    }[] = [];
    if (values.configured) {
        const _confColors =
            selectedColors.length > 0 ? selectedColors : [{ label: 'none', value: null }];
        const _confSizes =
            selectedSizes.length > 0 ? selectedSizes : [{ label: 'none', value: null }];
        for (let i = 0; i < _confColors.length; i++) {
            for (let j = 0; j < _confSizes.length; j++) {
                configurations.push({
                    color_id: _confColors[i].value,
                    size_id: _confSizes[j].value
                });
                configData.push({
                    price: values[`configurePrice_${_confColors[i].label}_${_confSizes[j].label}`],
                    qty: values[`configureQty_${_confColors[i].label}_${_confSizes[j].label}`],
                    sku: values[`configureSKU_${_confColors[i].label}_${_confSizes[j].label}`]
                });
            }
        }
    } else {
        configurations.push({
            color_id: selectedColors?.length
                ? (selectedColors[0] as any).value
                : (selectedColors as any).value || null,
            size_id: selectedSizes?.length
                ? (selectedSizes[0] as any).value
                : (selectedSizes as any).value || null
        });
        configData.push({
            price: values.price,
            qty: values.quantity,
            sku: values.sku
        });
    }

    return { config: configurations, configData: configData };
}

export function prepareAdditionalColorDropdown(dataArr: any, locale: string) {
    const _data: any = [];
    if (dataArr) {
        dataArr.forEach((data: any) => {
            _data.push({
                label: parseTranslation(data, 'name', locale),
                value: data.id,
                color: data.code
            });
        });
    }

    return _data;
}
