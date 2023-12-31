import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, combineLatest, map } from "rxjs";
import { ClubMemberShortDataModel, ClubMembersPageModel, FiltersModel, PaginationOptions, SortOptions } from "../models/club-member.model";
import { ClubMembersListSelector } from "../store/selectors";
import { ClubMembersListActions } from "../store/actions";

@Injectable()
export class ClubMembersFacade {
    constructor(private store : Store) {}

    private allClubMembersList$: Observable<ClubMembersPageModel | null> =
        this.store.select(ClubMembersListSelector.selectClubMembersPageModel);
    paging$: Observable<PaginationOptions> =
        this.store.select(ClubMembersListSelector.selectPaging);
    sort$: Observable<SortOptions> =
        this.store.select(ClubMembersListSelector.selectSorting);
    filters$: Observable<FiltersModel[]> =
        this.store.select(ClubMembersListSelector.selectFilters);

    clubMembersList$: Observable<{
        data: ClubMemberShortDataModel[];
        totalCount: number
    }> = combineLatest([
        this.paging$,
        this.allClubMembersList$,
        this.sort$,
        this.filters$,
    ]).pipe(
        map(([{pageSize, skip}, yacht, sort, filters]) => {
            const {items, totalCount} = yacht ?? {items: [], totalCount: 0};
            return {pageSize, skip, items, sort, filters, totalCount};            
        }),
        map(({pageSize, skip, items, sort, filters, totalCount}) => {
            let filteredItems = items ? [...items] : [];

            const value = filters.find(x => x.field === 'name')?.value;
            if (value && typeof value === 'string' && value !== 'null') {
                filteredItems = filteredItems.filter(x => {
                    const fullName = x.firstName + ' ' + (x.lastName === '-' ? '' : x.lastName);
                    return fullName.toLowerCase().includes(value.toLowerCase())
                });
            }

            const roleValue = filters.find(x => x.field === 'role')?.value;
            if (roleValue && typeof roleValue === 'string' && roleValue !== 'null') {
                filteredItems = filteredItems.filter(x => x.role.id.toString().toLowerCase() === roleValue.toLowerCase());
            }

            const sailingLicenceValue = filters.find(x => x.field === 'sailingLicence')?.value;
            if (sailingLicenceValue && typeof sailingLicenceValue === 'string' && sailingLicenceValue !== 'null') {
                filteredItems = filteredItems.filter(x => x.sailingLicense.id.toString().toLowerCase() === sailingLicenceValue.toLowerCase());
            }

            return {pageSize, skip, items: filteredItems, sort, totalCount: filteredItems.length};
        }),
        map(({pageSize, skip, items, sort, totalCount}) => {
            let sortedItems = items ? [...items] : [];
            if (sort.dir === 'asc') {
                sortedItems.sort((a, b) => (a.firstName.localeCompare(b.firstName)));
            }
            else if (sort.dir === 'desc') {
                sortedItems.sort((a, b) => (b.firstName.localeCompare(a.firstName)));
            }

            return {pageSize, skip, items: sortedItems, totalCount};
        }),
        map(({pageSize, skip, items, totalCount}) => {
            return {data: items?.slice(skip, skip + pageSize), totalCount: totalCount};
        }),
    )

    loadAll() {
        this.store.dispatch(ClubMembersListActions.load());
    }

    pageChange({skip, pageSize}: {skip: number; pageSize?: number}) {
        this.store.dispatch(
            ClubMembersListActions.paging({p: {skip, pageSize}})
        );
    }

    sortChange(value: SortOptions) {
        this.store.dispatch(
            ClubMembersListActions.sorting({s: value})
        );
    }

    filterChange(value: FiltersModel[]) {
        this.store.dispatch(
            ClubMembersListActions.filters({f: value})
        );
    }
}