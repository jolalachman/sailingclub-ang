import { DictionaryModel } from "src/app/shared/service/dictionary.service";

export type ReportedNoticeShortDataModel = {
    id: number;
    reportedAt: Date;
    yacht: DictionaryModel;
    reservationId: number;
    clubMember: DictionaryModel;
    currentStatus: DictionaryModel;
};

export type ReportedNoticesPageModel = {
    items: ReportedNoticeShortDataModel[];
    pageInfo: PageInfo;
    totalCount: number;
};

export type FiltersModel = {
    field: string
    value: Date | string | number | null | boolean;
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