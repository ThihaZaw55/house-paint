import axios from 'axios';

// 1. Define the Unit DTO type matching your Spring Boot backend
export interface UnitDTO {
  unitID?: number;
  unitName: string;
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
  getAll: async (): Promise<UnitDTO[]> => {
    const response = await api.get<UnitDTO[]>('/api/units');
    return response.data;
  },

  // GET unit by ID
  getById: async (id: number): Promise<UnitDTO> => {
    const response = await api.get<UnitDTO>(`/api/units/${id}`);
    return response.data;
  },

  // POST create unit
  create: async (unitData: UnitDTO): Promise<UnitDTO> => {
    const response = await api.post<UnitDTO>('/api/units', unitData);
    return response.data;
  },

  // PUT update unit
  update: async (id: number, unitData: UnitDTO): Promise<UnitDTO> => {
    const response = await api.put<UnitDTO>(`/api/units/${id}`, unitData);
    return response.data;
  },

  // DELETE unit
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/units/${id}`);
  },
};