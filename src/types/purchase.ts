export interface Purchase {
    purchaseId: number;
    supplierName: string;
    totalCost: number | string;
    purchaseDate: string;
    createdDate?: string;
    purchaseItems?: PurchaseItem[];
}

export interface PurchaseItem {
    purchaseItemId?: number;
    productId: number;
    buyQuantity: number | string;
    costPrice: number | string;
    salePrice: number | string;
}

export interface PurchaseSearch{
    purchaseDate: string;
    supplierName: string;
    purchaseId: string;
}

export interface PurchaseItemTable {
    purchaseItemId?: number;
    productId: number;
    itemName: string;
    unitName: string;
    purchaseDate?: string;
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