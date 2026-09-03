import type { Unit } from "../types/unit";
import api from "./api";
import type { CreateUnitRequest, UpdateUnitRequest } from "../types/unit";
import type { ApiResponse } from "./apiResponse";

export const UnitService = {
    getUnits: async () => {
        const response = await api.get<ApiResponse<Unit[]>>("/units");
        return response.data;
    },

    getByID: async (id: number): Promise<ApiResponse<Unit>> => {
        const response = await api.get<ApiResponse<Unit>>(`/units/${id}`);
        return response.data;
    },

    createUnit: async (data: CreateUnitRequest) : Promise<ApiResponse<Unit>> => {
        const response = await api.post<ApiResponse<Unit>>("/units", data);
        return response.data;
    },

    updateUnit: async (id: number, data: UpdateUnitRequest): Promise<ApiResponse<Unit>> => {
        const response = await api.put(`/units/${id}`, data);
        return response.data;
    },

    deleteUnit: async (id: number): Promise<ApiResponse<null>> => {
       const response = await api.delete(`/units/${id}`);
       return response.data;
    }
}