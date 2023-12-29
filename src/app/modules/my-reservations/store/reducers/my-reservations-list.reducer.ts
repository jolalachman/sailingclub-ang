import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as AppState from '../../../../core/state/app.state';
import { FiltersModel, PaginationOptions, SortOptions, MyReservationsPageModel } from "../../models/my-reservation.model";
import { MyReservationsListActions } from '../actions';

export const STATE_KEY = 'my-reservations-list';

export const defaultFilters: FiltersModel[] = [];

export const defaultPaging: PaginationOptions = {
    skip: 0,
    pageSize: 10,
};

export const defaultSorting: SortOptions = {
    dir: undefined,
};

export interface MyReservationsListState {
    result: MyReservationsPageModel | null;
    filters: FiltersModel[];
    paging: PaginationOptions;
    sorting: SortOptions;
    error?: string;
    loading: boolean;
}

const initialState: MyReservationsListState = {
    result: null,
    filters: defaultFilters,
    paging: defaultPaging,
    sorting: defaultSorting,
    error: undefined,
    loading: true,
};

export interface State extends AppState.RootState {
    MyReservationsList: MyReservationsListState;
}

export const selectMyReservationsListFeatureState =
    createFeatureSelector<MyReservationsListState>(STATE_KEY);

export const reducers = createReducer<MyReservationsListState>(
    initialState,
    on(MyReservationsListActions.load, (state): MyReservationsListState => {
        return {
            ...state,
            paging: {
                ...state.paging,
                skip: defaultPaging.skip,
            },
            loading: true,
        };
    }),

    on(MyReservationsListActions.loadSuccess, (state, {model}): MyReservationsListState => {
        return {
            ...state,
            result: model,
            loading: false,
        };
    }),

    on(MyReservationsListActions.loadFailure, (state, {error}): MyReservationsListState => {
        return {
            ...state,
            error,
            loading: false,
        };
    }),

    on(MyReservationsListActions.paging, (state, {p}): MyReservationsListState => {
        const { paging } = state;
        return {
            ...state,
            paging: {
                ...paging,
                ...p,
            },
        };
    }),

    on(MyReservationsListActions.sorting, (state, {s: sorting}): MyReservationsListState => {
        return {
            ...state,
            sorting,
        };
    }),
    on(MyReservationsListActions.filters, (state, {f: filters}): MyReservationsListState => {
        return {
            ...state,
            filters,
        };
    }),
);