import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
export const countriesSelector = createSelector(
    (state: State.Root) => state.countries,
    (countries: State.Countries): State.Countries => countries
);
