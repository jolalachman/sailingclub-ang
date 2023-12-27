import { createSelector } from "@ngrx/store";

import * as fromFeature from '../reducers/users-list.reducer';

export const selectUsersPageModel = createSelector(
    fromFeature.selectUsersListFeatureState,
    state => state.result,
);

export const selectPaging = createSelector(
    fromFeature.selectUsersListFeatureState,
    state => state.paging,
);

export const selectSorting = createSelector(
    fromFeature.selectUsersListFeatureState,
    state => state.sorting,
);

export const selectFilters = createSelector(
    fromFeature.selectUsersListFeatureState,
    state => state.filters,
);