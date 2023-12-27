import { createSelector } from "@ngrx/store";

import * as fromFeature from '../reducers/club-members-list.reducer';

export const selectClubMembersPageModel = createSelector(
    fromFeature.selectClubMembersListFeatureState,
    state => state.result,
);

export const selectPaging = createSelector(
    fromFeature.selectClubMembersListFeatureState,
    state => state.paging,
);

export const selectSorting = createSelector(
    fromFeature.selectClubMembersListFeatureState,
    state => state.sorting,
);

export const selectFilters = createSelector(
    fromFeature.selectClubMembersListFeatureState,
    state => state.filters,
);