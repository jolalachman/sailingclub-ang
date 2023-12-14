import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as AppState from '../../../../core/state/app.state';
import { FiltersModel, PaginationOptions, SortOptions, YachtShortDataModel, YachtsPageModel } from "../../models/yacht.model";
import { YachtsListActions } from '../actions';

export const STATE_KEY = 'yachts-list';

export const defaultFilters: FiltersModel = {
    filter: 1,
};

export const defaultPaging: PaginationOptions = {
    skip: 0,
    pageSize: 10,
};

export const defaultSorting: SortOptions = {
    dir: undefined,
};

export interface YachtsListState {
    result: YachtsPageModel | null;
    filters: FiltersModel;
    paging: PaginationOptions;
    sorting: SortOptions;
    error?: string;
    loading: boolean;
}

const initialState: YachtsListState = {
    result: null,
    filters: defaultFilters,
    paging: defaultPaging,
    sorting: defaultSorting,
    error: undefined,
    loading: true,
};

export interface State extends AppState.RootState {
    yachtsList: YachtsListState;
}

export const selectYachtsListFeatureState =
    createFeatureSelector<YachtsListState>(STATE_KEY);

export const reducers = createReducer<YachtsListState>(
    initialState,
    on(YachtsListActions.load, (state): YachtsListState => {
        return {
            ...state,
            paging: {
                ...state.paging,
                skip: defaultPaging.skip,
            },
            loading: true,
        };
    }),

    on(YachtsListActions.loadSuccess, (state, {model, filters}): YachtsListState => {
        return {
            ...state,
            result: model,
            filters: filters,
            loading: false,
        };
    }),

    on(YachtsListActions.loadFailure, (state, {error}): YachtsListState => {
        return {
            ...state,
            error,
            loading: false,
        };
    }),

    on(YachtsListActions.paging, (state, {p}): YachtsListState => {
        const { paging } = state;
        return {
            ...state,
            paging: {
                ...paging,
                ...p,
            },
        };
    }),

    on(YachtsListActions.sorting, (state, {s: sorting}): YachtsListState => {
        const { paging } = state;
        return {
            ...state,
            sorting,
        };
    }),
);