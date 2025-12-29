import { api } from "./axios";
import type { Comic, CreateComicData, UpdateComicData } from "../types/comic";

export const getComics = async (limit?: number): Promise<Comic[]> => {
  const response = await api.get<Comic[]>("/comics", {
    params: limit ? { limit } : undefined
  });
  return response.data;
};

export const getComicById = async (id: string): Promise<Comic> => {
  const response = await api.get<Comic>(`/comics/${id}`);
  return response.data;
};

export const getComicsBySeries = async (seriesId: string): Promise<Comic[]> => {
  const response = await api.get<Comic[]>(`/series/${seriesId}/comics`);
  return response.data;
};

export const createComic = async (data: CreateComicData): Promise<Comic> => {
  const response = await api.post<{ success: boolean; data: Comic; message: string }>("/comics", data);
  return response.data.data;
};

export const updateComic = async (id: string, data: UpdateComicData): Promise<Comic> => {
  const response = await api.put<{ success: boolean; data: Comic; message: string }>(`/comics/${id}`, data);
  return response.data.data;
};

export const deleteComic = async (id: string): Promise<void> => {
  await api.delete(`/comics/${id}`);
};

