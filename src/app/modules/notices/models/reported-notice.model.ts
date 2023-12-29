import { DictionaryModel } from "../../auth/services/auth-dictionary.service";

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