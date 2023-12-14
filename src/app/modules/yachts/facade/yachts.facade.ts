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
    private sort$: Observable<SortOptions> =
        this.store.select(YachtsListSelector.selectSorting);

    yachtList$: Observable<{
        data: YachtShortDataModel[];
        totalCount: number
    }> = combineLatest([
        this.paging$,
        this.allYachtsList$,
        this.sort$,
    ]).pipe(
        map(([{pageSize, skip}, yacht, sort]) => {
            const {items, totalCount} = yacht ?? {items: [], totalCount: 0};
            return {pageSize, skip, items, sort, totalCount};            
        }),
        map(({pageSize, skip, items, sort, totalCount}) => {
            let sortedItems = items ? [...items] : [];
            if (sort.dir === 'asc') {
                sortedItems.sort((a, b) => (a.name.localeCompare(b.name)));
            }
            else if (sort.dir === 'desc') {
                sortedItems.sort((a, b) => (b.name.localeCompare(a.name)));
            }

            return {pageSize, skip, items: sortedItems, totalCount};
        }),
        map(({pageSize, skip, items, totalCount}) => {
            return {data: items?.slice(skip, skip + pageSize), totalCount: totalCount};
        }),
    )

    loadAll = (filters: FiltersModel = {filter: 0}) => {
        this.store.dispatch(YachtsListActions.load({filters}));
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
}