import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, combineLatest, map } from "rxjs";
import { FiltersModel, PaginationOptions, ReportedNoticeShortDataModel, ReportedNoticesPageModel, SortOptions } from "../models/reported-notice.model";
import { ReportedNoticesListSelector } from "../store/selectors";
import { ReportedNoticesListActions } from "../store/actions";


@Injectable()
export class ReportedNoticesFacade {
    constructor(private store : Store) {}

    private allReportedNoticesList$: Observable<ReportedNoticesPageModel | null> =
        this.store.select(ReportedNoticesListSelector.selectReportedNoticesPageModel);
     paging$: Observable<PaginationOptions> =
        this.store.select(ReportedNoticesListSelector.selectPaging);
    sort$: Observable<SortOptions> =
        this.store.select(ReportedNoticesListSelector.selectSorting);
    filters$: Observable<FiltersModel[]> =
        this.store.select(ReportedNoticesListSelector.selectFilters);

    reportedNoticesList$: Observable<{
        data: ReportedNoticeShortDataModel[];
        totalCount: number
    }> = combineLatest([
        this.paging$,
        this.allReportedNoticesList$,
        this.sort$,
        this.filters$,
    ]).pipe(
        map(([{pageSize, skip}, notice, sort, filters]) => {
            const {items, totalCount} = notice ?? {items: [], totalCount: 0};
            return {pageSize, skip, items, sort, filters, totalCount};            
        }),
        map(({pageSize, skip, items, sort, filters, totalCount}) => {
            let filteredItems = items ? [...items] : [];

            const value = filters.find(x => x.field === 'name')?.value;
            if (value && typeof value === 'string' && value !== 'null') {
                filteredItems = filteredItems.filter(x => {
                    const fullName = '#' + x.id;
                    return fullName.toLowerCase().includes(value.toLowerCase())
                });
            }

            const closedValue = filters.find(x => x.field === 'closed')?.value;
            if (!closedValue && typeof closedValue === 'boolean') {
                filteredItems = filteredItems.filter(x => 
                    x.currentStatus.name !== 'COMPLETED'
                );
            }

            const yachtValue = filters.find(x => x.field === 'yacht')?.value;
            if (yachtValue && typeof yachtValue === 'string' && yachtValue !== 'null') {
                filteredItems = filteredItems.filter(x => x.yacht.id.toString().toLowerCase() === yachtValue.toLowerCase());
            }

            const reservationValue = filters.find(x => x.field === 'reservationId')?.value;
            if (reservationValue && typeof reservationValue === 'string' && reservationValue !== 'null') {
                filteredItems = filteredItems.filter(x => x.reservationId.toString().toLowerCase() === reservationValue.toLowerCase());
            }

            const statusValue = filters.find(x => x.field === 'currentStatus')?.value;
            if (statusValue && typeof statusValue === 'string' && statusValue !== 'null') {
                filteredItems = filteredItems.filter(x => x.currentStatus.id.toString().toLowerCase() === statusValue.toLowerCase());
            }

            const dateValue = filters.find(x => x.field === 'reportedAt')?.value;
            if (dateValue && typeof dateValue === 'string' && dateValue !== 'null') {
                filteredItems = filteredItems.filter(x => {
                    const reportedDate = new Date(x.reportedAt);
                    const filterDate = new Date(dateValue);
                    reportedDate.setHours(0, 0, 0, 0);
                    return reportedDate.getTime() === filterDate.getTime();
                });
            }

            const clubMemberValue = filters.find(x => x.field === 'clubMember')?.value;
            if (clubMemberValue && typeof clubMemberValue === 'string' && clubMemberValue !== 'null') {
                filteredItems = filteredItems.filter(x => x.clubMember.id.toString().toLowerCase() === clubMemberValue.toLowerCase());
            }

            return {pageSize, skip, items: filteredItems, sort, totalCount: filteredItems.length};
        }),
        map(({pageSize, skip, items, sort, totalCount}) => {
            let sortedItems = items ? [...items] : [];
            if (sort.dir === 'asc') {
                sortedItems.sort((a, b) => {
                    const aDate = new Date(a.reportedAt)
                    const bDate = new Date(b.reportedAt)
                    return aDate.getTime() - bDate.getTime()
                });
            }
            else if (sort.dir === 'desc') {
                sortedItems.sort((a, b) => {
                    const aDate = new Date(a.reportedAt)
                    const bDate = new Date(b.reportedAt)
                    return bDate.getTime() - aDate.getTime()
                });
            }

            return {pageSize, skip, items: sortedItems, totalCount};
        }),
        map(({pageSize, skip, items, totalCount}) => {
            return {data: items?.slice(skip, skip + pageSize), totalCount: totalCount};
        }),
    )

    loadAll() {
        this.store.dispatch(ReportedNoticesListActions.load());
    }

    pageChange({skip, pageSize}: {skip: number; pageSize?: number}) {
        this.store.dispatch(
            ReportedNoticesListActions.paging({p: {skip, pageSize}})
        );
    }

    sortChange(value: SortOptions) {
        this.store.dispatch(
            ReportedNoticesListActions.sorting({s: value})
        );
    }

    filterChange(value: FiltersModel[]) {
        this.store.dispatch(
            ReportedNoticesListActions.filters({f: value})
        );
    }
}