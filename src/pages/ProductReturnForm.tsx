import React, { useState } from "react";


export default function ProductReturnForm() {
  const [invoiceId, setInvoiceId] = useState<ProductReturn[]>([]);
  const [invoiceData, setInvoiceData] = useState(null);
  const [returnItems, setReturnItems] = useState({});
  const [reason, setReason] = useState("Damaged");

  // ၁။ Invoice ရှာဖွေသည့် Function (Dummy Fetch)
  const handleSearchInvoice = (e) => {
    e.preventDefault();
    // API Call လုပ်ပြီး Invoice ဆွဲထုတ်မည့်နေရာ
    setInvoiceData({
      saleId: invoiceId,
      customerName: "ဦးဘ",
      saleDate: "2026-08-04",
      items: [
        { productId: 1, name: "UE-9000 Gallon", maxQty: 2, price: 6000 },
        { productId: 2, name: "UE-9206 Liter", maxQty: 1, price: 5000 },
      ],
    });
  };

  // ၂။ ပြန်အပ်မည့် အရေအတွက် ပြောင်းလဲခြင်း
  const handleQtyChange = (productId, qty) => {
    setReturnItems((prev) => ({
      ...prev,
      [productId]: Math.max(0, qty),
    }));
  };

  // စုစုပေါင်း ပြန်ပေးရမည့် ငွေပမာဏ တွက်ချက်ခြင်း
  const calculateTotalRefund = () => {
    if (!invoiceData) return 0;
    return invoiceData.items.reduce((sum, item) => {
      const qty = returnItems[item.productId] || 0;
      return sum + qty * item.price;
    }, 0);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-slate-800 border-b pb-3">
        🔄 Sales Return Process (ပစ္စည်းပြန်အပ်/ပြန်လဲ)
      </h2>

      {/* Step 1: Search Invoice Form */}
      <form onSubmit={handleSearchInvoice} className="flex gap-3">
        <input
          type="text"
          placeholder="Enter Invoice / Sale ID (e.g. 101)"
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          Search Invoice
        </button>
      </form>

      {/* Step 2: Display Invoice & Select Return Items */}
      {invoiceData && (
        <div className="space-y-4 pt-2">
          <div className="p-3 bg-slate-50 rounded-xl flex justify-between text-sm text-slate-600">
            <span>Customer: <b>{invoiceData.customerName}</b></span>
            <span>Date: <b>{invoiceData.saleDate}</b></span>
          </div>

          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2">Item Name</th>
                <th className="py-2">Bought Qty</th>
                <th className="py-2">Price</th>
                <th className="py-2 w-32">Return Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoiceData.items.map((item) => (
                <tr key={item.productId}>
                  <td className="py-3 font-medium text-slate-800">{item.name}</td>
                  <td className="py-3">{item.maxQty}</td>
                  <td className="py-3">{item.price.toLocaleString()} MMK</td>
                  <td className="py-3">
                    <input
                      type="number"
                      min="0"
                      max={item.maxQty}
                      value={returnItems[item.productId] || 0}
                      onChange={(e) =>
                        handleQtyChange(item.productId, parseInt(e.target.value) || 0)
                      }
                      className="w-20 px-2 py-1 border rounded-lg text-center"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Step 3: Reason & Refund Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Return Reason (အကြောင်းအရင်း)
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 border rounded-xl text-sm"
              >
                <option value="Damaged">Damaged / Defective (ပျက်စီးနေခြင်း)</option>
                <option value="Wrong Item">Wrong Item Delivered (အမျိုးအစား မှားခြင်း)</option>
                <option value="Customer Mind Change">Customer Changed Mind</option>
              </select>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl text-right">
              <span className="text-xs text-blue-600 font-semibold uppercase">Total Refund Amount</span>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                {calculateTotalRefund().toLocaleString()} MMK
              </div>
            </div>
          </div>

          {/* Step 4: Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={calculateTotalRefund() === 0}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-sm transition-all"
            >
              Confirm & Refund
            </button>
          </div>
        </div>
      )}
    </div>
  );
}