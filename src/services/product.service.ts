import api from "./api";
import type {
  Product,
  PaintItemOption,
  PaintUnitOption,
  CreateProduct,
  UpdateProduct,
} from "../types/product";
import type { ApiResponse } from "./apiResponse";

export type CreateProductRequest = Omit<CreateProduct, "ProductId">;
export type UpdateProductRequest = Partial<CreateProductRequest>;

export const ProductService = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    const response = await api.get<ApiResponse<Product[]>>("/admin/products");
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Product>> => {
    const response = await api.get<ApiResponse<Product>>(`/admin/products/${id}`);
    return response.data;
  },

  // 1. CREATE METHOD (FormData ဖြင့် JSON Data + File ပို့ခြင်း)
  create: async (
    payload: any,
    imageFile?: File | null
  ): Promise<ApiResponse<Product>> => {
    const formData = new FormData();

    // Backend ၏ @RequestPart("data") အတွက် JSON Blob ထည့်ခြင်း
    const jsonBlob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    formData.append("data", jsonBlob);

    // Backend ၏ @RequestPart("imageFile") အတွက် File ထည့်ခြင်း
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    const response = await api.post<ApiResponse<Product>>("/admin/products", formData,
      {
        headers: {
          "Content-Type" : "multipart/form-data",
        }
      });
      
    return response.data;
  },

  // 2. UPDATE METHOD (FormData ဖြင့် JSON Data + File ပို့ရန် ပြင်ဆင်ထားပါသည်)
  update: async (
    productId: number,
    data: any,
    imageFile?: File | null
  ): Promise<ApiResponse<UpdateProduct>> => {
    const formData = new FormData();

    // Backend ၏ @RequestPart("data") အတွက် JSON Blob ထည့်ခြင်း
    const jsonBlob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    formData.append("data", jsonBlob);

    // Image File အသစ်ပါက ထည့်ပေးခြင်း
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    const response = await api.put<ApiResponse<UpdateProduct>>(
      `/admin/products/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
    );
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/admin/products/${id}`);
    return response.data;
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