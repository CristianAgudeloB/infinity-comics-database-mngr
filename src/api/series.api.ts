import { api } from "./axios";
import type { Series, CreateSeriesData, UpdateSeriesData } from "../types/series";

export const getSeries = async (): Promise<Series[]> => {
  const response = await api.get<Series[]>("/series");
  return response.data;
};

export const getSeriesById = async (id: string): Promise<Series> => {
  const response = await api.get<Series>(`/series/${id}`);
  return response.data;
};

export const createSeries = async (data: CreateSeriesData): Promise<Series> => {
  const response = await api.post<{ success: boolean; data: Series; message: string }>("/series", data);
  return response.data.data;
};

export const updateSeries = async (id: string, data: UpdateSeriesData): Promise<Series> => {
  const response = await api.put<{ success: boolean; data: Series; message: string }>(`/series/${id}`, data);
  return response.data.data;
};

export const deleteSeries = async (id: string): Promise<void> => {
  await api.delete(`/series/${id}`);
};

export const searchSeries = async (query: string): Promise<Series[]> => {
  const response = await api.get<Series[]>("/series/search", {
    params: { q: query }
  });
  return response.data;
};

