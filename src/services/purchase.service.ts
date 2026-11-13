import api from "./api";
import type { ApiResponse } from "./apiResponse";
import type { CreatePurchase, Purchase, UpdatePurchase } from "../types/purchase";

export const PurchaseService = {
  getAll: async (): Promise<ApiResponse<Purchase[]>> => {
    const response = await api.get<ApiResponse<Purchase[]>>("/admin/purchase");
    return response.data;
  },

  create: async (data: CreatePurchase): Promise<ApiResponse<CreatePurchase>> => {
    const response = await api.post<ApiResponse<CreatePurchase>>("/admin/purchase", data);
    return response.data;
  },

  update: async (id: number, data: CreatePurchase): Promise<ApiResponse<UpdatePurchase>> => {
    const response = await api.put<ApiResponse<Purchase>>(`/admin/purchase/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/admin/purchase/${id}`);
    return response.data;
  },
};