import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Payment() {
  const { cart, removeFromCart } = useCart();

  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [cash, setCash] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const tax = subtotal * 0.05;
  const total = subtotal + tax - discount;
  const change = cash - total;

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Payment</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.qty}</p>
              </div>

              <div className="flex items-center gap-4">
                <p>{item.price * item.qty} K</p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm cursor-pointer "
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
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
                onChange={(e) => setDiscount(Number(e.target.value))}
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
                onChange={(e) => setCash(Number(e.target.value))}
                className="border w-32 p-1 rounded text-right"
              />
            </div>

            <div className="flex justify-between font-semibold text-green-600">
              <span>Change</span>
              <span>{change > 0 ? change.toFixed(2) : "0.00"} K</span>
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 cursor-pointer active:bg-blue-500 transition">
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
}
