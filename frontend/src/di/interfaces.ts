export interface IHttpClient {
  get<T>(url: string): Promise<{data: T}>;
  post<T>(url: string, data?: any, config?: any): Promise<{ data: T }>;
  patch<T>(url: string, data?: any, config?: any): Promise<{ data: T }>;
}