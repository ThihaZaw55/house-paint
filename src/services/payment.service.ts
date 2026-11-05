import api from "./api";
import type { ApiResponse } from "./apiResponse";

export interface CheckoutSaleItemRequest {
  productId: number;
  quantity: number;
  unitCostPrice: number;
  unitSalesPrice: number;
  discountPrice?: number;
}

export interface CompleteSaleRequest {
  customerName: string;
  phone?: string;
  paymentMethod: string;
  status: string;
  note?: string;
  totalAmount: number;
  amountPaid: number;
  changeAmount: number;
  items: CheckoutSaleItemRequest[];
}

export interface CompleteSaleResponse {
  saleId?: string | number;
  paymentId?: string | number;
  invoiceUuid?: string;
  totalAmount?: number;
  changeAmount?: number;
}

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
