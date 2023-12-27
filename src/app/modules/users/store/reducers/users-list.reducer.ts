import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as AppState from '../../../../core/state/app.state';
import { UsersListActions } from '../actions';
import { FiltersModel, PaginationOptions, SortOptions, UsersPageModel } from '../../models/user.model';

export const STATE_KEY = 'users-list';

export const defaultFilters: FiltersModel[] = [];

export const defaultPaging: PaginationOptions = {
    skip: 0,
    pageSize: 10,
};

export const defaultSorting: SortOptions = {
    dir: undefined,
};

export interface UsersListState {
    result: UsersPageModel | null;
    filters: FiltersModel[];
    paging: PaginationOptions;
    sorting: SortOptions;
    error?: string;
    loading: boolean;
}

const initialState: UsersListState = {
    result: null,
    filters: defaultFilters,
    paging: defaultPaging,
    sorting: defaultSorting,
    error: undefined,
    loading: true,
};

export interface State extends AppState.RootState {
    usersList: UsersListState;
}

export const selectUsersListFeatureState =
    createFeatureSelector<UsersListState>(STATE_KEY);

export const reducers = createReducer<UsersListState>(
    initialState,
    on(UsersListActions.load, (state): UsersListState => {
        return {
            ...state,
            paging: {
                ...state.paging,
                skip: defaultPaging.skip,
            },
            loading: true,
        };
    }),

    on(UsersListActions.loadSuccess, (state, {model}): UsersListState => {
        return {
            ...state,
            result: model,
            loading: false,
        };
    }),

    on(UsersListActions.loadFailure, (state, {error}): UsersListState => {
        return {
            ...state,
            error,
            loading: false,
        };
    }),

    on(UsersListActions.paging, (state, {p}): UsersListState => {
        const { paging } = state;
        return {
            ...state,
            paging: {
                ...paging,
                ...p,
            },
        };
    }),

    on(UsersListActions.sorting, (state, {s: sorting}): UsersListState => {
        return {
            ...state,
            sorting,
        };
    }),

    on(UsersListActions.filters, (state, {f: filters}): UsersListState => {
        return {
            ...state,
            filters,
        };
    }),
);