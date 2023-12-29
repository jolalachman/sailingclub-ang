import { createSelector } from "@ngrx/store";
import * as fromFeature from '../reducers/my-reservations-list.reducer';


export const selectMyReservationsPageModel = createSelector(
    fromFeature.selectMyReservationsListFeatureState,
    state => state.result,
);

export const selectPaging = createSelector(
    fromFeature.selectMyReservationsListFeatureState,
    state => state.paging,
);

export const selectSorting = createSelector(
    fromFeature.selectMyReservationsListFeatureState,
    state => state.sorting,
);

export const selectFilters = createSelector(
    fromFeature.selectMyReservationsListFeatureState,
    state => state.filters,
);