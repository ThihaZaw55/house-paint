export interface Purchase {
    purchaseId: number;
    productId: number;
    costPrice: number | string;
    salePrice: number | string;
    quantity: number | string;
    purchaseDate: string;
    createdDate: string;
}

export interface CreatePurchase {
    productId: number;
    costPrice: number | string;
    salePrice: number | string;
    quantity: number | string;
    purchaseDate: string;
    createdDate: string;
}

