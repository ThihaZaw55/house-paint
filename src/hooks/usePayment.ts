import { useState } from "react";
import type { AxiosError } from "axios";
import {
  PaymentService,
  type CompleteSaleRequest,
} from "../services/payment.service";

export default function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const completePayment = async (payload: CompleteSaleRequest) => {
    try {
      setError(null);
      setMessage(null);
      setIsLoading(true);

      const response = await PaymentService.completeSale(payload);
      setMessage(response.message || "Payment completed successfully.");
      return response;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to complete payment";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    message,
    setError,
    setMessage,
    completePayment,
  };
}
