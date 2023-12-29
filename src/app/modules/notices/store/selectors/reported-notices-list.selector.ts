import { createSelector } from "@ngrx/store";

import * as fromFeature from '../reducers/reported-notices-list.reducer';

export const selectReportedNoticesPageModel = createSelector(
    fromFeature.selectReportedNoticesListFeatureState,
    state => state.result,
);

export const selectPaging = createSelector(
    fromFeature.selectReportedNoticesListFeatureState,
    state => state.paging,
);

export const selectSorting = createSelector(
    fromFeature.selectReportedNoticesListFeatureState,
    state => state.sorting,
);

export const selectFilters = createSelector(
    fromFeature.selectReportedNoticesListFeatureState,
    state => state.filters,
);