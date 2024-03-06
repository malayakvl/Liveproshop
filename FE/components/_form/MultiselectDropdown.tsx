import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { Checkbox } from '@material-ui/core';

const MultiSelect = ({
    items,
    selectedValues,
    label,
    placeholder,
    selectAllLabel,
    noOptionsText,
    limitTags,
    onToggleOption,
    onClearOptions,
    onSelectAll,
    getOptionLabel
}: {
    items: any;
    selectedValues: any;
    label: any;
    placeholder: any;
    selectAllLabel: any;
    noOptionsText: any;
    limitTags: any;
    onToggleOption: any;
    onClearOptions: any;
    onSelectAll: any;
    getOptionLabel: any;
}) => {
    const allSelected = items.length === selectedValues.length;
    const handleToggleSelectAll = () => {
        onSelectAll && onSelectAll(!allSelected);
    };

    const handleChange = (event: any, selectedOptions: any, reason: any) => {
        if (reason === 'select-option' || reason === 'remove-option') {
            if (selectedOptions.find((option: any) => option.value === 'select-all')) {
                handleToggleSelectAll();
            } else {
                onToggleOption && onToggleOption(selectedOptions);
            }
        } else if (reason === 'clear') {
            onClearOptions && onClearOptions();
        }
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const optionRenderer = (option: any, { selected }) => {
        const selectAllProps =
            option.value === 'select-all' // To control the state of 'select-all' checkbox
                ? { checked: allSelected }
                : {};
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return (
            <>
                <Checkbox
                    color="primary"
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    {...selectAllProps}
                />
                <span
                    className="text-[12px] text-blue-450 font-bold"
                    style={{ fontFamily: 'Montserrat' }}>
                    {option.label}
                </span>
            </>
        );
    };
    const inputRenderer = (params: any) => (
        <TextField
            {...params}
            label={label}
            placeholder={`Select Shoppers`}
            style={{ fontSize: '10px !important', fontFamily: 'Montserrat' }}
        />
    );
    const getOptionSelected = (option: any, anotherOption: any) =>
        option.value === anotherOption.value;
    const filter = createFilterOptions();

    return (
        <Autocomplete
            multiple
            size="small"
            limitTags={limitTags}
            options={items}
            value={selectedValues}
            disableCloseOnSelect
            getOptionLabel={getOptionLabel}
            getOptionSelected={getOptionSelected}
            noOptionsText={noOptionsText}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                return [{ label: selectAllLabel, value: 'select-all' }, ...filtered];
            }}
            onChange={handleChange}
            renderOption={optionRenderer}
            renderInput={inputRenderer}
        />
    );
};

MultiSelect.defaultProps = {
    limitTags: 5,
    items: [],
    selectedValues: [],
    getOptionLabel: (value: any) => value
};

export default MultiSelect;
