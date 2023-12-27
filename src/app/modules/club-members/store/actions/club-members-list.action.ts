import { createAction, props } from "@ngrx/store";
import { ClubMembersPageModel, FiltersModel, PaginationOptions, SortOptions } from "../../models/club-member.model";

const LOAD = '[ClubMembers] Result';
const LOAD_SUCCESS = '[ClubMembers] Success';
const LOAD_FAIL = '[ClubMembers] Fail';

const PAGING = '[ClubMembers] Paging';
const SORTING = '[ClubMembers] Sorting';
const FILTERING = '[ClubMembers] Filtering';

export const load = createAction(LOAD);
export const loadSuccess = createAction(LOAD_SUCCESS, props<{model: ClubMembersPageModel}>());
export const loadFailure = createAction(LOAD_FAIL, props<{error: string}>());

export const paging = createAction(PAGING, props<{p: Partial<PaginationOptions>}>());
export const sorting = createAction(SORTING, props<{s: SortOptions}>());
export const filters = createAction(FILTERING, props<{f: FiltersModel[]}>());