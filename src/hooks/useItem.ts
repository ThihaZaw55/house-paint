import { ItemService } from "../services/item.service";
import type { Item } from "../types/item";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";

export default function useItem() {
  const [items, setItems] = useState<Item[]>([]);
  const [message, setMessage] = useState<string | null>(null); // Success Message အတွက်
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await ItemService.getItems();
      setItems(response.data || []);
      // success ဖြစ်စဉ် error state ထဲ မထည့်ဘဲ error ကို clear လုပ်ရပါမည်
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to fetch items";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // CREATE / UPDATE
  const saveItem = async (id: number | null, data: { itemName: string }) => {
    try {
      setError(null);
      setMessage(null);
      
      let res;
      if (id !== null) {
        res = await ItemService.updateItem(id, data);
      } else {
        res = await ItemService.createItem(data);
      }

      setMessage(res.message); // Success message ထည့်ခြင်း
      await fetchItems(); // Auto Refresh
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message || "Failed to save item"
      );
      return false;
    }
  };

  // DELETE
  const deleteItem = async (id: number) => {
    try {
      setError(null);
      setMessage(null);
      
      const res = await ItemService.deleteItem(id);
      
      // deleteItem က response ပြန်ပေးပါက message ထည့်ပါ
      if (res && res.message) {
        setMessage(res.message);
      }

      await fetchItems(); // Auto Refresh
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message || "Failed to delete item"
      );
      return false;
    }
  };

  return {
    items,
    loading,
    setLoading,
    error,
    setError,
    message,
    setMessage,
    fetchItems,
    saveItem,
    deleteItem,
  };
}