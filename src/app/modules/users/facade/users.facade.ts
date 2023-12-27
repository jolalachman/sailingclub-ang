import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, combineLatest, map } from "rxjs";
import { FiltersModel, PaginationOptions, SortOptions, UserShortDataModel, UsersPageModel } from "../models/user.model";
import { UsersListSelector } from "../store/selectors";
import { UsersListActions } from "../store/actions";

@Injectable()
export class UsersFacade {
    constructor(private store : Store) {}

    private allUsersList$: Observable<UsersPageModel | null> =
        this.store.select(UsersListSelector.selectUsersPageModel);
    paging$: Observable<PaginationOptions> =
        this.store.select(UsersListSelector.selectPaging);
    sort$: Observable<SortOptions> =
        this.store.select(UsersListSelector.selectSorting);
    filters$: Observable<FiltersModel[]> =
        this.store.select(UsersListSelector.selectFilters);

    usersList$: Observable<{
        data: UserShortDataModel[];
        totalCount: number
    }> = combineLatest([
        this.paging$,
        this.allUsersList$,
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
                filteredItems = filteredItems.filter(x => x.roleName.toLowerCase() === roleValue.toLowerCase());
            }

            const sailingLicenceValue = filters.find(x => x.field === 'sailingLicence')?.value;
            if (sailingLicenceValue && typeof sailingLicenceValue === 'string' && sailingLicenceValue !== 'null') {
                filteredItems = filteredItems.filter(x => x.sailingLicenseName.toLowerCase() === sailingLicenceValue.toLowerCase());
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
        this.store.dispatch(UsersListActions.load());
    }

    pageChange({skip, pageSize}: {skip: number; pageSize?: number}) {
        this.store.dispatch(
            UsersListActions.paging({p: {skip, pageSize}})
        );
    }

    sortChange(value: SortOptions) {
        this.store.dispatch(
            UsersListActions.sorting({s: value})
        );
    }

    filterChange(value: FiltersModel[]) {
        this.store.dispatch(
            UsersListActions.filters({f: value})
        );
    }
}