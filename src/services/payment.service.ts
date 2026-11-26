import type { CompleteSaleRequest, CompleteSaleResponse, VoucherResponse } from "@/types/payment";
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

  getVoucher: async (reference: string): Promise<ApiResponse<VoucherResponse> | VoucherResponse> => {
    const response = await api.get<ApiResponse<VoucherResponse> | VoucherResponse>(
      `/payments/voucher/${encodeURIComponent(reference)}`
    );

    return response.data;
  },
};

export default PaymentService;
