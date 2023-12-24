import { createAction, props } from "@ngrx/store";
import { FiltersModel, PaginationOptions, SortOptions, ReservationsPageModel } from "../../models/reservation.model";

const LOAD = '[Reservations] Result';
const LOAD_SUCCESS = '[Reservations] Success';
const LOAD_FAIL = '[Reservations] Fail';

const PAGING = '[Reservations] Paging';
const SORTING = '[Reservations] Sorting';
const FILTERING = '[Reservations] Filtering';

export const load = createAction(LOAD);
export const loadSuccess = createAction(LOAD_SUCCESS, props<{model: ReservationsPageModel}>());
export const loadFailure = createAction(LOAD_FAIL, props<{error: string}>());

export const paging = createAction(PAGING, props<{p: Partial<PaginationOptions>}>());
export const sorting = createAction(SORTING, props<{s: SortOptions}>());
export const filters = createAction(FILTERING, props<{f: FiltersModel[]}>());