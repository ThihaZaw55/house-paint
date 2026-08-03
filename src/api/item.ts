import axios from 'axios';

// 1. Define the Unit DTO type matching your Spring Boot backend
export interface ItemDTO {
  ItemID?: number;
  ItemName: string;
}

// 2. Assign the custom instance to a variable so you can use it below
const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
});

export default api;

// 3. Add explicit types to parameters
export const unitService = {
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

  // POST create unit
  create: async (unitData: ItemDTO): Promise<ItemDTO> => {
    const response = await api.post<ItemDTO>('/api/item', unitData);
    return response.data;
  },

  // PUT update unit
  update: async (id: number, unitData: ItemDTO): Promise<ItemDTO> => {
    const response = await api.put<ItemDTO>(`/api/item/${id}`, unitData);
    return response.data;
  },

  // DELETE unit
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/item/${id}`);
  },
};