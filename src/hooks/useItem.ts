import { ItemService } from "../services/item.service";
import type { Item } from "../types/item";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";

export default function useItem(){
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = async () => {
        try{
            setLoading(true);
            const data = await ItemService.getAll();
            setItems(data);
        } catch (error) {
            const axiosError = error as AxiosError<{message?: string}>;
            const errorMessage = axiosError.response?.data?.message || "Failed to fetch items";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    useEffect (() => {
        fetchItems();
    }, []);

    // CREATE / UPDATE
      const saveUnit = async (id: number | null, data: { itemName: string }) => {
        try {
          setError(null);
          if (id !== null) {
            await ItemService.updateItem(id, data);
          } else {
            await ItemService.createItem(data);
          }
          await fetchItems(); // Auto Refresh
          return true; // Success status ပြန်ပေးရန်
        } catch (err) {
          const axiosError = err as AxiosError<{ message?: string }>;
          setError(axiosError.response?.data?.message || "Failed to save item");
          return false;
        }
      };
    
      // DELETE
      const deleteUnit = async (id: number) => {
        try {
          setError(null);
          await ItemService.deleteItem(id);
          await fetchItems(); // Auto Refresh
          return true;
        } catch (err) {
          const axiosError = err as AxiosError<{ message?: string }>;
          setError(axiosError.response?.data?.message || "Failed to delete unit");
          return false;
        }
      };
    
      return {
        items,
        loading,
        setLoading,
        error,
        setError,
        fetchItems,
        saveUnit,
        deleteUnit,
      };
}