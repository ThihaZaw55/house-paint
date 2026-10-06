import { useEffect, useState } from "react";
import type { Unit } from "../types/unit";
import { UnitService } from "../services/unit.service";
import type { AxiosError } from "axios";

export function useUnits() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // READ
  const fetchUnits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await UnitService.getUnits();
      setUnits(response.data || []);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || "Failed to fetch units");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  // CREATE / UPDATE
  const saveUnit = async (id: number | null, data: { unitName: string }) => {
    try {
      setError(null);
      if (id !== null) {
        await UnitService.updateUnit(id, data);
      } else {
        await UnitService.createUnit(data);
      }
      await fetchUnits(); // Auto Refresh
      return true; // Success status ပြန်ပေးရန်
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || "Failed to save unit");
      return false;
    }
  };

  // DELETE
  const deleteUnit = async (id: number) => {
    try {
      setError(null);
      await UnitService.deleteUnit(id);
      await fetchUnits(); // Auto Refresh
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || "Failed to delete unit");
      return false;
    }
  };

  return {
    units,
    loading,
    error,
    setError,
    fetchUnits,
    saveUnit,
    deleteUnit,
  };
}