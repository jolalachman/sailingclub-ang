import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as AppState from '../../../../core/state/app.state';
import { ClubMembersPageModel, FiltersModel, PaginationOptions, SortOptions } from '../../models/club-member.model';
import { ClubMembersListActions } from '../actions';

export const STATE_KEY = 'club-members-list';

export const defaultFilters: FiltersModel[] = [];

export const defaultPaging: PaginationOptions = {
    skip: 0,
    pageSize: 10,
};

export const defaultSorting: SortOptions = {
    dir: undefined,
};

export interface ClubMembersListState {
    result: ClubMembersPageModel | null;
    filters: FiltersModel[];
    paging: PaginationOptions;
    sorting: SortOptions;
    error?: string;
    loading: boolean;
}

const initialState: ClubMembersListState = {
    result: null,
    filters: defaultFilters,
    paging: defaultPaging,
    sorting: defaultSorting,
    error: undefined,
    loading: true,
};

export interface State extends AppState.RootState {
    clubMembersList: ClubMembersListState;
}

export const selectClubMembersListFeatureState =
    createFeatureSelector<ClubMembersListState>(STATE_KEY);

export const reducers = createReducer<ClubMembersListState>(
    initialState,
    on(ClubMembersListActions.load, (state): ClubMembersListState => {
        return {
            ...state,
            paging: {
                ...state.paging,
                skip: defaultPaging.skip,
            },
            loading: true,
        };
    }),

    on(ClubMembersListActions.loadSuccess, (state, {model}): ClubMembersListState => {
        return {
            ...state,
            result: model,
            loading: false,
        };
    }),

    on(ClubMembersListActions.loadFailure, (state, {error}): ClubMembersListState => {
        return {
            ...state,
            error,
            loading: false,
        };
    }),

    on(ClubMembersListActions.paging, (state, {p}): ClubMembersListState => {
        const { paging } = state;
        return {
            ...state,
            paging: {
                ...paging,
                ...p,
            },
        };
    }),

    on(ClubMembersListActions.sorting, (state, {s: sorting}): ClubMembersListState => {
        return {
            ...state,
            sorting,
        };
    }),

    on(ClubMembersListActions.filters, (state, {f: filters}): ClubMembersListState => {
        return {
            ...state,
            filters,
        };
    }),
);