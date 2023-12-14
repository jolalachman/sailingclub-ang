import { createSelector } from "@ngrx/store";

import * as fromFeature from '../reducers/yachts-list.reducer';

export const selectYachtsPageModel = createSelector(
    fromFeature.selectYachtsListFeatureState,
    state => state.result,
);

export const selectPaging = createSelector(
    fromFeature.selectYachtsListFeatureState,
    state => state.paging,
);

export const selectSorting = createSelector(
    fromFeature.selectYachtsListFeatureState,
    state => state.sorting,
);

export const selectFilters = createSelector(
    fromFeature.selectYachtsListFeatureState,
    state => state.filters,
);