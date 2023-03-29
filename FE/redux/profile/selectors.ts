import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.profile,
    (profile: State.Profile): State.Profile => profile
);

export const profileSelector = createSelector(
    rootSelector,
    (profile: State.Profile): Profile.Profile => profile.profile
);
export const profilePhotoSelector = createSelector(
    rootSelector,
    (profile: State.Profile): Profile.Profile => profile.profilePhoto
);
export const validEmailSelector = createSelector(
    rootSelector,
    (profile: State.Profile): any => profile.validEmail
);
export const isPasswordChangedSelector = createSelector(
    rootSelector,
    (profile: State.Profile): any => profile.isPasswordChanged
);
