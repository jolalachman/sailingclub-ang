import { DictionaryModel } from "src/app/shared/service/dictionary.service";

export type MyReservationShortDataModel = {
    id: number;
    pickupDate: Date;
    dropoffDate: Date;
    yachtName: string;
    yachtId: number;
    currentStatus: DictionaryModel;
    photo: string;
    peopleNumber: number;
};

export type MyReservationsPageModel = {
    items: MyReservationShortDataModel[];
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