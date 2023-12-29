import { createAction, props } from "@ngrx/store";
import { FiltersModel, MyReservationsPageModel, PaginationOptions, SortOptions } from "../../models/my-reservation.model";

const LOAD = '[My Reservations] Result';
const LOAD_SUCCESS = '[My Reservations] Success';
const LOAD_FAIL = '[My Reservations] Fail';

const PAGING = '[My Reservations] Paging';
const SORTING = '[My Reservations] Sorting';
const FILTERING = '[My Reservations] Filtering';

export const load = createAction(LOAD);
export const loadSuccess = createAction(LOAD_SUCCESS, props<{model: MyReservationsPageModel}>());
export const loadFailure = createAction(LOAD_FAIL, props<{error: string}>());

export const paging = createAction(PAGING, props<{p: Partial<PaginationOptions>}>());
export const sorting = createAction(SORTING, props<{s: SortOptions}>());
export const filters = createAction(FILTERING, props<{f: FiltersModel[]}>());