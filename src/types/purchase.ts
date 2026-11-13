export interface PurchaseItem {
    purchaseItemId?: number;
    productId: number;
    buyQuantity: number | string;
    costPrice: number | string;
    salePrice: number | string;
}

export interface Purchase {
    purchaseId: number;
    supplierName: string;
    totalCost: number | string;
    purchaseDate: string;
    createdDate?: string;
    purchaseItems?: PurchaseItem[];
}

export interface CreatePurchase {
    supplierName: string;
    totalCost: number;
    purchaseItems: CreatePurchaseItem[];
    purchaseDate: string;
}

export interface CreatePurchaseItem {
    productId: number;
    buyQuantity: number | string;
    costPrice: number | string;
    salePrice: number | string;
}

export interface UpdatePurchase extends Partial<Purchase> {
    purchaseId: number;
}