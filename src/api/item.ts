import axios from 'axios';

// 1. Define the Unit DTO type matching your Spring Boot backend
export interface ItemDTO {
  itemID?: number;
  itemName: string;
}

// 2. Assign the custom instance to a variable so you can use it below
const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
});

export default api;

// 3. Add explicit types to parameters
export const ItemService = {
  // GET all units
  getAll: async (): Promise<ItemDTO[]> => {
    const response = await api.get<ItemDTO[]>('/api/item');
    return response.data;
  },

  // GET unit by ID
  getById: async (id: number): Promise<ItemDTO> => {
    const response = await api.get<ItemDTO>(`/api/item/${id}`);
    return response.data;
  },

  // POST create item
  create: async (itemData: ItemDTO): Promise<ItemDTO> => {
    const response = await api.post<ItemDTO>('/api/item', itemData);
    return response.data;
  },

  // PUT update item
  update: async (id: number, itemData: ItemDTO): Promise<ItemDTO> => {
    const response = await api.put<ItemDTO>(`/api/item/${id}`, itemData);
    return response.data;
  },

  // DELETE unit
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/item/${id}`);
  },
};