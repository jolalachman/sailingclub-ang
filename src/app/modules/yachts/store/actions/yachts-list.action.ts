import { createAction, props } from "@ngrx/store";
import { FiltersModel, PaginationOptions, SortOptions, YachtsPageModel } from "../../models/yacht.model";

const LOAD = '[Yachts] Result';
const LOAD_SUCCESS = '[Yachts] Success';
const LOAD_FAIL = '[Yachts] Fail';

const PAGING = '[Yachts] Paging';
const SORTING = '[Yachts] Sorting';
const FILTERING = '[Yachts] Filtering';

export const load = createAction(LOAD);
export const loadSuccess = createAction(LOAD_SUCCESS, props<{model: YachtsPageModel}>());
export const loadFailure = createAction(LOAD_FAIL, props<{error: string}>());

export const paging = createAction(PAGING, props<{p: Partial<PaginationOptions>}>());
export const sorting = createAction(SORTING, props<{s: SortOptions}>());
export const filters = createAction(FILTERING, props<{f: FiltersModel[]}>());