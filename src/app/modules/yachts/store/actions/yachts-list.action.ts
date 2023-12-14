import { createAction, props } from "@ngrx/store";
import { FiltersModel, PaginationOptions, SortOptions, YachtsPageModel } from "../../models/yacht.model";

const LOAD = '[Yachts] Result';
const LOAD_SUCCESS = '[Yachts] Success';
const LOAD_FAIL = '[Yachts] Fail';

const PAGING = '[Yachts] Paging';
const SORTING = '[Yachts] Sorting';

export const load = createAction(LOAD, props<{filters: FiltersModel}>());
export const loadSuccess = createAction(LOAD_SUCCESS, props<{model: YachtsPageModel; filters: FiltersModel}>());
export const loadFailure = createAction(LOAD_FAIL, props<{error: string}>());

export const paging = createAction(PAGING, props<{p: Partial<PaginationOptions>}>());
export const sorting = createAction(SORTING, props<{s: SortOptions}>());