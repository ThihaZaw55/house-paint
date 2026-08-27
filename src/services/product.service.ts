import api from "./api";
import type {
  Product,
  PaintItemOption,
  PaintUnitOption,
} from "../types/product";

// If you have separate DTO types for create/update, you can import them here:
export type CreateProductRequest = Omit<Product, "id">;
export type UpdateProductRequest = Partial<CreateProductRequest>;

export const ProductService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>("/admin/products");
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/admin/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await api.post<Product>("/admin/products", data);
    return response.data;
  },

  update: async (
    id: number,
    data: UpdateProductRequest
  ): Promise<Product> => {
    const response = await api.put<Product>(`/admin/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },

  // Dropdown options endpoints
  getPaintOptions: async (): Promise<PaintItemOption[]> => {
    const response = await api.get<PaintItemOption[]>("/paint-items");
    return response.data;
  },

  getUnitOptions: async (): Promise<PaintUnitOption[]> => {
    const response = await api.get<PaintUnitOption[]>("/paint-units");
    return response.data;
  },
};