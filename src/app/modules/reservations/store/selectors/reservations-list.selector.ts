import { createSelector } from "@ngrx/store";

import * as fromFeature from '../reducers/reservations-list.reducer';

export const selectReservationsPageModel = createSelector(
    fromFeature.selectReservationsListFeatureState,
    state => state.result,
);

export const selectPaging = createSelector(
    fromFeature.selectReservationsListFeatureState,
    state => state.paging,
);

export const selectSorting = createSelector(
    fromFeature.selectReservationsListFeatureState,
    state => state.sorting,
);

export const selectFilters = createSelector(
    fromFeature.selectReservationsListFeatureState,
    state => state.filters,
);