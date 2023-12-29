import { DictionaryModel } from "src/app/shared/service/dictionary.service";

export type ClubMemberShortDataModel = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roleName: string;
    clubStatus: string;
    sailingLicense: DictionaryModel;
};

export type ClubMembersPageModel = {
    items: ClubMemberShortDataModel[];
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