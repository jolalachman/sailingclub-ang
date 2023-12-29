import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, combineLatest, map } from "rxjs";
import { FiltersModel, PaginationOptions, SortOptions, YachtShortDataModel, YachtsPageModel } from "../models/yacht.model";
import { YachtsListSelector } from "../store/selectors";
import { YachtsListActions } from "../store/actions";

@Injectable()
export class YachtsFacade {
    constructor(private store : Store) {}

    private allYachtsList$: Observable<YachtsPageModel | null> =
        this.store.select(YachtsListSelector.selectYachtsPageModel);
    paging$: Observable<PaginationOptions> =
        this.store.select(YachtsListSelector.selectPaging);
    sort$: Observable<SortOptions> =
        this.store.select(YachtsListSelector.selectSorting);
    filters$: Observable<FiltersModel[]> =
        this.store.select(YachtsListSelector.selectFilters);

    yachtList$: Observable<{
        data: YachtShortDataModel[];
        totalCount: number;
        availableItems: YachtShortDataModel[];
        totalCountAvailableItems: number;
    }> = combineLatest([
        this.paging$,
        this.allYachtsList$,
        this.sort$,
        this.filters$,
    ]).pipe(
        map(([{pageSize, skip}, yacht, sort, filters]) => {
            const {items, totalCount} = yacht ?? {items: [], totalCount: 0};
            return {pageSize, skip, items, sort, filters, totalCount};            
        }),
        map(({pageSize, skip, items, sort, filters, totalCount}) => {
            let filteredItems = items ? [...items] : [];
            let availableItems: YachtShortDataModel[] = [];

            const value = filters.find(x => x.field === 'name')?.value;
            if (value && typeof value === 'string' && value !== 'null') {
                filteredItems = filteredItems.filter(x => x.name.toLowerCase().includes(value.toLowerCase()));
            }

            const cabinValue = filters.find(x => x.field === 'cabin')?.value;
            if (cabinValue && typeof cabinValue === 'number') {
                filteredItems = filteredItems.filter(x => x.cabinNum >= cabinValue);
            }

            const peopleValue = filters.find(x => x.field === 'people')?.value;
            if (peopleValue && typeof peopleValue === 'number') {
                filteredItems = filteredItems.filter(x => x.peopleNum >= peopleValue);
            }

            const pickupValue = filters.find(x => x.field === 'pickup')?.value;
            if (pickupValue && typeof pickupValue === 'object') {
                filteredItems = filteredItems.filter(x => {
                    return !(x.reservations.find(y => {
                        const yDate = new Date(y.pickup);
                        const zDate = new Date(y.dropoff);
                        return yDate.getTime() <= pickupValue.getTime() && pickupValue.getTime() <= zDate.getTime();
                    }))
                });
            }

            const dropoffValue = filters.find(x => x.field === 'dropoff')?.value;
            
            if (dropoffValue && typeof dropoffValue === 'object') {
                filteredItems = filteredItems.filter(x => {
                    return !(x.reservations.find(y => {
                        const yDate = new Date(y.pickup);
                        const zDate = new Date(y.dropoff);
                        return yDate.getTime() <= dropoffValue.getTime() && dropoffValue.getTime() <= zDate.getTime()
                    }))
                });
            }

            const typeValue = filters.find(x => x.field === 'type')?.value;
            if (typeValue && typeof typeValue === 'string' && typeValue !== 'null') {
                filteredItems = filteredItems.filter(x => x.type?.toLowerCase() === typeValue.toLowerCase());
            }

            const statusValue = filters.find(x => x.field === 'status')?.value;
            if (statusValue && typeof statusValue === 'string' && statusValue !== 'null') {
                filteredItems = filteredItems.filter(x => x.currentStatus.toLowerCase() === statusValue.toLowerCase());
            }

            if (dropoffValue && typeof dropoffValue === 'object' && pickupValue && typeof pickupValue === 'object') {
                availableItems = filteredItems.filter(x => {
                    return (x.reservations.find(y => {
                        const yDate = new Date(y.pickup);
                        const zDate = new Date(y.dropoff);
                        return pickupValue.getTime() <= yDate.getTime() && zDate.getTime() <= dropoffValue.getTime()
                    }))
                });
                filteredItems = filteredItems.filter(x => {
                    return !(x.reservations.find(y => {
                        const yDate = new Date(y.pickup);
                        const zDate = new Date(y.dropoff);
                        return pickupValue.getTime() <= yDate.getTime() && zDate.getTime() <= dropoffValue.getTime()
                    }))
                });
            }

            return {pageSize, skip, items: filteredItems, availableItems: availableItems, sort, totalCount: filteredItems.length, totalCountAvailableItems: availableItems.length};
        }),
        map(({pageSize, skip, items, availableItems, sort, totalCount, totalCountAvailableItems}) => {
            let sortedItems = items ? [...items] : [];
            let sortedAvailableItems = availableItems ? [...availableItems] : [];
            if (sort.dir === 'asc') {
                sortedItems.sort((a, b) => (a.name.localeCompare(b.name)));
                sortedAvailableItems.sort((a, b) => (a.name.localeCompare(b.name)));
            }
            else if (sort.dir === 'desc') {
                sortedItems.sort((a, b) => (b.name.localeCompare(a.name)));
                sortedAvailableItems.sort((a, b) => (b.name.localeCompare(a.name)));
            }

            return {pageSize, skip, items: sortedItems, availableItems: sortedAvailableItems, totalCount, totalCountAvailableItems};
        }),
        map(({pageSize, skip, items, availableItems, totalCount, totalCountAvailableItems}) => {
            return {data: items?.slice(skip, skip + pageSize), availableItems: availableItems?.slice(skip, skip + pageSize), totalCount: totalCount, totalCountAvailableItems: totalCountAvailableItems};
        }),
    )

    loadAll() {
        this.store.dispatch(YachtsListActions.load());
    }

    pageChange({skip, pageSize}: {skip: number; pageSize?: number}) {
        this.store.dispatch(
            YachtsListActions.paging({p: {skip, pageSize}})
        );
    }

    sortChange(value: SortOptions) {
        this.store.dispatch(
            YachtsListActions.sorting({s: value})
        );
    }

    filterChange(value: FiltersModel[]) {
        this.store.dispatch(
            YachtsListActions.filters({f: value})
        );
    }
}