import { createAction, props } from "@ngrx/store";
import { FiltersModel, PaginationOptions, SortOptions, UsersPageModel } from "../../models/user.model";

const LOAD = '[Users] Result';
const LOAD_SUCCESS = '[Users] Success';
const LOAD_FAIL = '[Users] Fail';

const PAGING = '[Users] Paging';
const SORTING = '[Users] Sorting';
const FILTERING = '[Users] Filtering';

export const load = createAction(LOAD);
export const loadSuccess = createAction(LOAD_SUCCESS, props<{model: UsersPageModel}>());
export const loadFailure = createAction(LOAD_FAIL, props<{error: string}>());

export const paging = createAction(PAGING, props<{p: Partial<PaginationOptions>}>());
export const sorting = createAction(SORTING, props<{s: SortOptions}>());
export const filters = createAction(FILTERING, props<{f: FiltersModel[]}>());