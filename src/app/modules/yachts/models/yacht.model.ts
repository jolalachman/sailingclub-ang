import { DictionaryModel } from "src/app/shared/service/dictionary.service";

export type YachtShortDataModel = {
    id: number;
    name: string;
    type: DictionaryModel;
    registrationNumber: string;
    currentStatus: DictionaryModel;
    photo: string;
    cabinNum: number;
    peopleNum: number;
    reservations: YachtReservation[];
};

export type YachtReservation = {
    reservationId: number;
    pickup: string,
    dropoff: string,
    reservingPerson: string,
};

export type YachtDetailsReservation = {
    id: number;
    pickupDate: string,
    dropoffDate: string,
    clientInfo: string,
    currentStatus: string
};

export type YachtsPageModel = {
    items: YachtShortDataModel[];
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