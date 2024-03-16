export interface Page<T> {
    records: T[];
    totalRecords: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
