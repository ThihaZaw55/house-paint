import { PurchaseService } from "@/services/purchase.service";
import type { CreatePurchase, Purchase } from "@/types/purchase";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";

export default function usePurchase() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string | null>(null);

    const fetchPurchases = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await PurchaseService.getAll();
            setPurchases(response.data || []);

        }catch (err) {
            console.log(err);
            const axiosError = err as AxiosError<{ message?: string }>;
            const errorMessage = axiosError.response?.data?.message || "Failed to fetch purchases";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPurchases();
    }, []);

    const createPurchase = async (data: CreatePurchase) => {
        try{
            setError(null);
            setMessage(null);
            setIsLoading(true);
            const response = await PurchaseService.create(data);
            setMessage(response.message);
            await fetchPurchases();
            return true;
        }catch(err){
            const axiosError = err as AxiosError<{ message?: string }>;
            const errorMessage = axiosError.response?.data?.message || "Failed to create purchase";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return { purchases, createPurchase, error, isLoading, message };
}