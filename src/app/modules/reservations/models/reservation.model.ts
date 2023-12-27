export type ReservationShortDataModel = {
    id: number;
    pickupDate: Date;
    dropoffDate: Date;
    yachtName: string;
    yachtId: number;
    reservingPerson: string;
    clientInfo: string;
    currentStatus: string;
    photo: string;
};

export type ReservationsPageModel = {
    items: ReservationShortDataModel[];
    pageInfo: PageInfo;
    totalCount: number;
};

export type FiltersModel = {
    field: string
    value: Date | string | number | null;
};

export type PageInfo = {
    offset: number;
    limit: number;
};

export type PaginationOptions = {
    pageSize: number;
    skip: number;
};

export type SortOptions = {
    dir?: string;
};