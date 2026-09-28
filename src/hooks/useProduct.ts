import { useEffect, useState } from "react";
import { ProductService } from "../services/product.service";
import type { CreateProduct, Product } from "../types/product";
import type { AxiosError } from "axios";

export default function useProduct(){
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string | null>(null);

    const fetchProducts = async () => {
        try{
            setError(null);
            setIsLoading(true);
            const response = await ProductService.getAll();
            setProducts(response.data || []);
        }catch(err){
            const axiosError = err as AxiosError<{ message?: string}>;
            const errorMessage = axiosError.response?.data?.message || "Failed to get products";
            setError(errorMessage);
        }finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    const saveProduct = async (productId: number | null, data: CreateProduct) => {
        try{
            setError(null);
            setIsLoading(true);
            let response;
            if(productId !== null){
                response = await ProductService.update(productId, data);
            }else {
                response = await ProductService.create(data);   
            }
            setMessage(response.message);
            await fetchProducts();
            return true;
        }catch(err){
            const axiosError = err as AxiosError<{ message?: string}>;
            setError(
                axiosError.response?.data?.message || "Failed to save product"
            );
            return false;
        }finally{
            setIsLoading(false);
        }
    }

    const deleteProduct = async (productId: number) => {
        try{
            setError(null);
            setIsLoading(true);
            const response = await ProductService.delete(productId);
            if(response && response.message){
                setMessage(response.message);
            }
            await fetchProducts();
        }catch(err){
            const axiosError = err as AxiosError<{ message?: string}>;
            setError(
                axiosError.response?.data?.message || "Failed to delete product"
            );
        }finally{
            setIsLoading(false);
        }
    }

    return {
        products,
        error,
        isLoading,
        message,
        fetchProducts,
        saveProduct,
        deleteProduct
    }
}