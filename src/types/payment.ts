export interface CheckoutSaleItemRequest {
  productId: number;
  quantity: number;
  costPrice: number;
  salesPrice: number;
  discountPrice?: number;
}

export interface CompleteSaleRequest {
  invoice?: string;
  saleDate?: string;
  paymentDate?: string;
  customerName: string;
  phone?: string;
  paymentMethod: string;
  status: string;
  note?: string;
  totalAmount: number;
  amount: number;
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

export interface PaymentMethod {
  paymentMethodID: string | number;
  pyamentMethod: string
}

export interface VoucherItemResponse {
  productId: number;
  itemName: string;
  unitName: string;
  quantity: number;
  salesPrice: number;
  discountPrice: number;
  lineTotal: number;
}

export interface VoucherResponse {
  paymentId: number;
  saleId: string;
  invoice: string;
  customerName: string;
  phone: string;
  saleDate: string;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  amountPaid: number;
  changeAmount: number;
  note: string;
  items: VoucherItemResponse[];
}