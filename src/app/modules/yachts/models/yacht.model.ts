export type YachtShortDataModel = {
    id: number;
    name: string;
    type: string;
    registrationNumber: string;
    currentStatus: string;
    photo: string;
};

export type YachtsPageModel = {
    items: YachtShortDataModel[];
    pageInfo: PageInfo;
    totalCount: number;
};

export type FiltersModel = {
    filter: number;
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