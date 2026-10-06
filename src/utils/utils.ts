export type ToastType = "success" | "error" | "warning" | "info";

export type ToastT = {
  description?: string;
  type?: ToastType;
};

export type ClientError = {
  status: number;
  messages: string[] | string;
};

export async function safeCall(action: () => Promise<void>) {
  try {
    await action();
  } catch (error: unknown) {
    let message = "Something went wrong.";

    if (error instanceof Error) {
      message = error.message;
    }

    try {
      const parsedError = JSON.parse(message) as Partial<ClientError>;
      const errorMessages = Array.isArray(parsedError.messages)
        ? parsedError.messages.join(", ")
        : typeof parsedError.messages === "string"
          ? parsedError.messages
          : message;

      const toast: ToastT = {
        description: errorMessages,
        type: parsedError.status === 500 ? "error" : "warning",
      };

      console.warn("Client error:", toast);
      window.alert(toast.description ?? "Something went wrong.");
    } catch {
      console.error(error);
      window.alert(message);
    }
  }
}