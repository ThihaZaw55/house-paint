import api from "./api";
import type {
  Item,
  CreateItemRequest,
  UpdateItemRequest,
} from "../types/item";
import type { ApiResponse } from "./apiResponse";

export const ItemService = {

  // Axios response wrapper ပါဝင်အောင် AxiosResponse<ApiResponse<Item[]>> သို့မဟုတ် ApiResponse<Item[]> ပေးပါ
getItems: async  (): Promise<ApiResponse<Item[]>> => {
  const response = await api.get<ApiResponse<Item[]>>('/items');
  return response.data; // ဒါဆိုရင် { message, data: Item[], success } ကို return ပြန်ပါလိမ့်မည်
},

  getById: async (id: number): Promise<ApiResponse<Item>> => {
    const response = await api.get<ApiResponse<Item>>(`/items/${id}`);
    
    return response.data;
  },

  createItem: async (data: CreateItemRequest): Promise<ApiResponse<Item>> => {

    const response = await api.post<ApiResponse<Item>>(
      "/items",
      data
    );

    return response.data;
  },

  updateItem: async (
    id: number,
    data: UpdateItemRequest
  ): Promise<ApiResponse<Item>> => {

    const response = await api.put<ApiResponse<Item>>(
      `/items/${id}`,
      data
    );

    return response.data;
  },

  deleteItem: async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/items/${id}`);
  return response.data;
  }
};