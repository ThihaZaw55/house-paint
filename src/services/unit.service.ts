import type { Unit } from "../types/unit";
import api from "./api";
import type { CreateUnitRequest, UpdateUnitRequest } from "../types/unit";

export const UnitService = {
    getAll: async (): Promise<Unit[]> => {
        const response = await api.get<Unit[]>("/units");
        return response.data;
    },

    getByID: async (id: number): Promise<Unit> => {
        const response = await api.get<Unit>(`/units/${id}`);
        return response.data;
    },

    createUnit: async (data: CreateUnitRequest) : Promise<Unit> => {
        const response = await api.post<Unit>("/units", data);
        return response.data;
    },

    updateUnit: async (id: number, data: UpdateUnitRequest): Promise<Unit> => {
        const response = await api.put(`/units/${id}`, data);
        return response.data;
    },

    deleteUnit: async (id: number): Promise<void> => {
        await api.delete(`/item/${id}`);
    }
}