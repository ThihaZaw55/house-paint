export interface Item {
  itemId: number;
  itemName: string;
}

export interface CreateItemRequest {
  itemName: string;
}

export interface UpdateItemRequest {
  itemName: string;
}