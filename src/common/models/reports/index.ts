export interface ReportsPostData {
    itemUID?: string;
    data?: Record<string, string> | any;
    format?: string;
    columns?: string[];
}
