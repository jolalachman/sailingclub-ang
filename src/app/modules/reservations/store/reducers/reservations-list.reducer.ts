import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as AppState from '../../../../core/state/app.state';
import { FiltersModel, PaginationOptions, SortOptions, ReservationsPageModel } from "../../models/reservation.model";
import { ReservationsListActions } from '../actions';

export const STATE_KEY = 'reservations-list';

export const defaultFilters: FiltersModel[] = [];

export const defaultPaging: PaginationOptions = {
    skip: 0,
    pageSize: 10,
};

export const defaultSorting: SortOptions = {
    dir: undefined,
};

export interface ReservationsListState {
    result: ReservationsPageModel | null;
    filters: FiltersModel[];
    paging: PaginationOptions;
    sorting: SortOptions;
    error?: string;
    loading: boolean;
}

const initialState: ReservationsListState = {
    result: null,
    filters: defaultFilters,
    paging: defaultPaging,
    sorting: defaultSorting,
    error: undefined,
    loading: true,
};

export interface State extends AppState.RootState {
    ReservationsList: ReservationsListState;
}

export const selectReservationsListFeatureState =
    createFeatureSelector<ReservationsListState>(STATE_KEY);

export const reducers = createReducer<ReservationsListState>(
    initialState,
    on(ReservationsListActions.load, (state): ReservationsListState => {
        return {
            ...state,
            paging: {
                ...state.paging,
                skip: defaultPaging.skip,
            },
            loading: true,
        };
    }),

    on(ReservationsListActions.loadSuccess, (state, {model}): ReservationsListState => {
        return {
            ...state,
            result: model,
            loading: false,
        };
    }),

    on(ReservationsListActions.loadFailure, (state, {error}): ReservationsListState => {
        return {
            ...state,
            error,
            loading: false,
        };
    }),

    on(ReservationsListActions.paging, (state, {p}): ReservationsListState => {
        const { paging } = state;
        return {
            ...state,
            paging: {
                ...paging,
                ...p,
            },
        };
    }),

    on(ReservationsListActions.sorting, (state, {s: sorting}): ReservationsListState => {
        return {
            ...state,
            sorting,
        };
    }),
    on(ReservationsListActions.filters, (state, {f: filters}): ReservationsListState => {
        return {
            ...state,
            filters,
        };
    }),
);