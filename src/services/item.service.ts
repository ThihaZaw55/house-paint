import api from "./api";
import type {
  Item,
  CreateItemRequest,
  UpdateItemRequest,
} from "../types/item";

export const ItemService = {

  getAll: async (): Promise<Item[]> => {
    const response = await api.get<Item[]>("/item");

    return response.data;
  },

  getById: async (id: number): Promise<Item> => {
    const response = await api.get<Item>(
      `/item/${id}`
    );

    return response.data;
  },

  createItem: async (
    data: CreateItemRequest
  ): Promise<Item> => {

    const response = await api.post<Item>(
      "/item",
      data
    );

    return response.data;
  },

  updateItem: async (
    id: number,
    data: UpdateItemRequest
  ): Promise<Item> => {

    const response = await api.put<Item>(
      `/item/${id}`,
      data
    );

    return response.data;
  },

  deleteItem: async (
    id: number
  ): Promise<void> => {

    await api.delete(`/item/${id}`);
  },
};