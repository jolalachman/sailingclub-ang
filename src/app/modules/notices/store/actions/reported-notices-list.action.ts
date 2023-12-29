import { createAction, props } from "@ngrx/store";
import { FiltersModel, PaginationOptions, ReportedNoticesPageModel, SortOptions } from "../../models/reported-notice.model";

const LOAD = '[ReportedNotices] Result';
const LOAD_SUCCESS = '[ReportedNotices] Success';
const LOAD_FAIL = '[ReportedNotices] Fail';

const PAGING = '[ReportedNotices] Paging';
const SORTING = '[ReportedNotices] Sorting';
const FILTERING = '[ReportedNotices] Filtering';

export const load = createAction(LOAD);
export const loadSuccess = createAction(LOAD_SUCCESS, props<{model: ReportedNoticesPageModel}>());
export const loadFailure = createAction(LOAD_FAIL, props<{error: string}>());

export const paging = createAction(PAGING, props<{p: Partial<PaginationOptions>}>());
export const sorting = createAction(SORTING, props<{s: SortOptions}>());
export const filters = createAction(FILTERING, props<{f: FiltersModel[]}>());