import type { AxiosRequestConfig } from "axios";

export interface IHttpClient {
  get<T>(url: string): Promise<{data: T}>;
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<{ data: T }>;
  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<{ data: T }>;
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<{ data: T }>;
}