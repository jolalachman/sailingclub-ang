import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, combineLatest, map } from "rxjs";
import { CalendarEvent } from "angular-calendar";
import { FiltersModel, MyReservationShortDataModel, MyReservationsPageModel, PaginationOptions, SortOptions } from "../models/my-reservation.model";
import { MyReservationsListSelector } from "../store/selectors";
import { CALENDAR_COLORS } from "../../reservations/constants/color.constant";
import { MyReservationsListActions } from "../store/actions";

@Injectable()
export class MyReservationsFacade {
    constructor(private store : Store) {}

    private allReservationsList$: Observable<MyReservationsPageModel | null> =
        this.store.select(MyReservationsListSelector.selectMyReservationsPageModel);
    paging$: Observable<PaginationOptions> =
        this.store.select(MyReservationsListSelector.selectPaging);
    sort$: Observable<SortOptions> =
        this.store.select(MyReservationsListSelector.selectSorting);
    filters$: Observable<FiltersModel[]> =
        this.store.select(MyReservationsListSelector.selectFilters);

    reservationList$: Observable<{
        data: MyReservationShortDataModel[];
        totalCount: number
    }> = combineLatest([
        this.paging$,
        this.allReservationsList$,
        this.sort$,
        this.filters$,
    ]).pipe(
        map(([{pageSize, skip}, reservation, sort, filters]) => {
            const {items, totalCount} = reservation ?? {items: [], totalCount: 0};
            return {pageSize, skip, items, sort,filters, totalCount};            
        }),
        map(({pageSize, skip, items, sort, filters, totalCount}) => {
            const value = filters.find(x => x.field === 'name')?.value;
            let filteredItems = items ? [...items] : [];
            if (value && typeof value === 'string') {
                filteredItems = filteredItems.filter(x => x.yachtName.toLowerCase().includes(value.toLowerCase()));
            }
            const pickupValue = filters.find(x => x.field === 'pickup')?.value;
            if (pickupValue && typeof pickupValue === 'object') {
                filteredItems = filteredItems.filter(x => {
                    const yDate = new Date(x.pickupDate);
                    if (pickupValue.getHours() === 0) {
                        const zDate = new Date(
                            yDate.getFullYear(),
                            yDate.getMonth(),
                            yDate.getDate()
                            );
                        return (zDate.getTime() === pickupValue.getTime());
                    }
                    return (yDate.getTime() === pickupValue.getTime());
                });
            }

            const dropoffValue = filters.find(x => x.field === 'dropoff')?.value;
            if (dropoffValue && typeof dropoffValue === 'object') {
                filteredItems = filteredItems.filter(x => {
                    const zDate = new Date(x.dropoffDate);
                    if (dropoffValue.getHours() === 0) {
                        const yDate = new Date(
                            zDate.getFullYear(),
                            zDate.getMonth(),
                            zDate.getDate()
                            );
                        return (yDate.getTime() === dropoffValue.getTime());
                    }
                    return (dropoffValue.getTime() === zDate.getTime());
                });
            }

            const yachtValue = filters.find(x => x.field === 'yacht')?.value;
            if (yachtValue && typeof yachtValue === 'string' && yachtValue !== 'null') {
                filteredItems = filteredItems.filter(x => x.yachtId.toString() === yachtValue);
            }

            const statusValue = filters.find(x => x.field === 'status')?.value;
            if (statusValue && typeof statusValue === 'string' && statusValue !== 'null') {
                filteredItems = filteredItems.filter(x => x.currentStatus.id.toString().toLowerCase() === statusValue.toLowerCase());
            }

            return {pageSize, skip, items: filteredItems, sort, totalCount: filteredItems.length};
        }),
        map(({pageSize, skip, items, sort, totalCount}) => {
            let sortedItems = items ? [...items] : [];
            if (sort.dir === 'asc') {
                sortedItems.sort((a, b) => (a.yachtName.localeCompare(b.yachtName)));
            }
            else if (sort.dir === 'desc') {
                sortedItems.sort((a, b) => (b.yachtName.localeCompare(a.yachtName)));
            }
            else if (sort.dir === 'closest') {
                sortedItems.sort((a, b) => {
                    const dateA = new Date(a.pickupDate).getTime();
                    const dateB = new Date(b.pickupDate).getTime();
            
                    return dateA - dateB;
                });
            }
            else if (sort.dir === 'furthest') {
                sortedItems.sort((a, b) => {
                    const dateA = new Date(a.pickupDate).getTime();
                    const dateB = new Date(b.pickupDate).getTime();
            
                    return dateB - dateA;
                });
            }

            return {pageSize, skip, items: sortedItems, totalCount};
        }),
        map(({pageSize, skip, items, totalCount}) => {
            return {data: items?.slice(skip, skip + pageSize), totalCount: totalCount};
        }),
    )

    reservationCalendar$: Observable<CalendarEvent[]> = this.reservationList$.pipe(
        map(items => {
            const startEndArray = items.data.map((item: MyReservationShortDataModel) => ({
                title: '#'+item.id + ' - ' + item.yachtName,
                start: new Date(item.pickupDate),
                end: new Date(item.dropoffDate),
                color: {
                    primary: this.getColor(item.currentStatus.name, item.yachtId),
                    secondary: this.getColor(item.currentStatus.name, item.yachtId),
                },
                meta: item.id
            }));
    
            return startEndArray;
        })
    );

    loadAll() {
        this.store.dispatch(MyReservationsListActions.load());
    }

    pageChange({skip, pageSize}: {skip: number; pageSize?: number}) {
        this.store.dispatch(
            MyReservationsListActions.paging({p: {skip, pageSize}})
        );
    }

    sortChange(value: SortOptions) {
        this.store.dispatch(
            MyReservationsListActions.sorting({s: value})
        );
    }

    filterChange(value: FiltersModel[]) {
        this.store.dispatch(
            MyReservationsListActions.filters({f: value})
        );
    }

    getColor(statusName: string, yachtId: number): string {
        if (statusName === 'PENDING')
        {
            return "orange";
        }
        else if (statusName === 'CANCELLED')
        {
            return "lightgray";
        }
        else if (statusName === 'REJECTED')
        {
            return "red";
        }
        return CALENDAR_COLORS[yachtId % CALENDAR_COLORS.length];
    }
}