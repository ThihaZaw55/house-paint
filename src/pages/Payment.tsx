import { useState } from "react";
import { useCart } from "../context/CartContext";
import PageTitle from "../components/ui/PageTitle";
import usePayment from "../hooks/usePayment";

export default function Payment() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { completePayment, isLoading, error, message, setError, setMessage } = usePayment();

  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [cash, setCash] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax - discount;
  const change = Math.max(cash - total, 0);

  const handleCompletePayment = async () => {
    if (!cart.length) {
      setError("Please add at least one product before completing payment.");
      return;
    }

    if (cash < total) {
      setError("Cash received must be greater than or equal to the total amount.");
      return;
    }

    const payload = {
      customerName: customer.trim() || "Walk-in Customer",
      phone: phone.trim(),
      paymentMethod: "CASH",
      status: "COMPLETED",
      note: phone.trim() ? `Customer phone: ${phone.trim()}` : "Walk-in sale",
      totalAmount: Number(total.toFixed(2)),
      amountPaid: Number(cash.toFixed(2)),
      changeAmount: Number(change.toFixed(2)),
      items: cart.map((item) => ({
        productId: item.id,
        quantity: Number(item.qty),
        unitCostPrice: Number((item.costPrice ?? item.price ?? 0).toFixed(2)),
        unitSalesPrice: Number(item.price.toFixed(2)),
        discountPrice: 0,
      })),
    };

    const response = await completePayment(payload);

    if (response && response.success) {
      setCustomer("");
      setPhone("");
      setDiscount(0);
      setCash(0);
      clearCart();
      setMessage(response.message || "Payment completed successfully.");
    }
  };

  return (
    <div className="">
      <PageTitle title="Payments" />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>

          {cart.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              No items in cart yet.
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                </div>

                <div className="flex items-center gap-4">
                  <p>{(item.price * item.qty).toFixed(2)} K</p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm cursor-pointer "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold">Customer Info</h2>

          <input
            type="text"
            placeholder="Customer Name"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <hr />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} K</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Discount</span>
              <input
                type="number"
                value={discount}
                min={0}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                className="border w-24 p-1 rounded text-right"
              />
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{total.toFixed(2)} K</span>
            </div>
          </div>
          <hr />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Cash Received</span>
              <input
                type="number"
                value={cash}
                min={0}
                onChange={(e) => setCash(Number(e.target.value) || 0)}
                className="border w-32 p-1 rounded text-right"
              />
            </div>

            <div className="flex justify-between font-semibold text-green-600">
              <span>Change</span>
              <span>{change > 0 ? change.toFixed(2) : "0.00"} K</span>
            </div>
          </div>

          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={handleCompletePayment}
            disabled={isLoading || cart.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 cursor-pointer active:bg-blue-500 transition disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isLoading ? "Processing..." : "Complete Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
