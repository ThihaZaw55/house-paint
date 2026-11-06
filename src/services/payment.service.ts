import type { CompleteSaleRequest, CompleteSaleResponse } from "@/types/payment";
import api from "./api";
import type { ApiResponse } from "./apiResponse";

export const PaymentService = {
  completeSale: async (
    payload: CompleteSaleRequest
  ): Promise<ApiResponse<CompleteSaleResponse>> => {
    const response = await api.post<ApiResponse<CompleteSaleResponse>>(
      "/payments",
      payload
    );

    return response.data;
  },
};

export default PaymentService;
