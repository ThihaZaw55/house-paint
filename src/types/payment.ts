export interface CheckoutSaleItemRequest {
  productId: number;
  quantity: number;
  unitCostPrice: number;
  unitSalesPrice: number;
  discountPrice?: number;
}

export interface CompleteSaleRequest {
  invoiceNumber?: string;
  saleDate?: string;
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