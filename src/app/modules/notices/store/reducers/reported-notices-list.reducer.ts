import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as AppState from '../../../../core/state/app.state';
import { FiltersModel, PaginationOptions, ReportedNoticesPageModel, SortOptions } from '../../models/reported-notice.model';
import { ReportedNoticesListActions } from '../actions';

export const STATE_KEY = 'reported-notices-list';

export const defaultFilters: FiltersModel[] = [];

export const defaultPaging: PaginationOptions = {
    skip: 0,
    pageSize: 10,
};

export const defaultSorting: SortOptions = {
    dir: undefined,
};

export interface ReportedNoticesListState {
    result: ReportedNoticesPageModel | null;
    filters: FiltersModel[];
    paging: PaginationOptions;
    sorting: SortOptions;
    error?: string;
    loading: boolean;
}

const initialState: ReportedNoticesListState = {
    result: null,
    filters: defaultFilters,
    paging: defaultPaging,
    sorting: defaultSorting,
    error: undefined,
    loading: true,
};

export interface State extends AppState.RootState {
    reportedNoticesList: ReportedNoticesListState;
}

export const selectReportedNoticesListFeatureState =
    createFeatureSelector<ReportedNoticesListState>(STATE_KEY);

export const reducers = createReducer<ReportedNoticesListState>(
    initialState,
    on(ReportedNoticesListActions.load, (state): ReportedNoticesListState => {
        return {
            ...state,
            paging: {
                ...state.paging,
                skip: defaultPaging.skip,
            },
            loading: true,
        };
    }),

    on(ReportedNoticesListActions.loadSuccess, (state, {model}): ReportedNoticesListState => {
        return {
            ...state,
            result: model,
            loading: false,
        };
    }),

    on(ReportedNoticesListActions.loadFailure, (state, {error}): ReportedNoticesListState => {
        return {
            ...state,
            error,
            loading: false,
        };
    }),

    on(ReportedNoticesListActions.paging, (state, {p}): ReportedNoticesListState => {
        const { paging } = state;
        return {
            ...state,
            paging: {
                ...paging,
                ...p,
            },
        };
    }),

    on(ReportedNoticesListActions.sorting, (state, {s: sorting}): ReportedNoticesListState => {
        return {
            ...state,
            sorting,
        };
    }),

    on(ReportedNoticesListActions.filters, (state, {f: filters}): ReportedNoticesListState => {
        return {
            ...state,
            filters,
        };
    }),
);