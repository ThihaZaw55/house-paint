import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

type InvoiceItem = {
  productId: number;
  name: string;
  maxQty: number;
  price: number;
};

type InvoiceData = {
  saleId: string;
  customerName: string;
  saleDate: string;
  items: InvoiceItem[];
};

type ReturnItems = Record<number, number>;

export default function ProductReturnForm() {
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItems>({});
  const [reason, setReason] = useState("Damaged");

  const handleSearchInvoice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

  const handleQtyChange = (productId: number, qty: number) => {
    setReturnItems((prev) => ({
      ...prev,
      [productId]: Math.max(0, qty),
    }));
  };

  const calculateTotalRefund = useMemo(() => {
    if (!invoiceData) return 0;

    return invoiceData.items.reduce((sum, item) => {
      const qty = returnItems[item.productId] || 0;
      return sum + qty * item.price;
    }, 0);
  }, [invoiceData, returnItems]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="border-b border-slate-200 pb-3 text-lg font-bold text-slate-800">
        🔄 Sales Return Process (ပစ္စည်းပြန်အပ်/ပြန်လဲ)
      </h2>

      <form onSubmit={handleSearchInvoice} className="flex gap-3">
        <input
          type="text"
          placeholder="Enter Invoice / Sale ID (e.g. 101)"
          value={invoiceId}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setInvoiceId(event.target.value)}
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Search Invoice
        </button>
      </form>

      {invoiceData && (
        <div className="space-y-4 pt-2">
          <div className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            <span>
              Customer: <b>{invoiceData.customerName}</b>
            </span>
            <span>
              Date: <b>{invoiceData.saleDate}</b>
            </span>
          </div>

          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2">Item Name</th>
                <th className="py-2">Bought Qty</th>
                <th className="py-2">Price</th>
                <th className="w-32 py-2">Return Qty</th>
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
                      onChange={(event) =>
                        handleQtyChange(item.productId, Number.parseInt(event.target.value, 10) || 0)
                      }
                      className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-center"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid grid-cols-1 gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Return Reason (အကြောင်းအရင်း)
              </label>
              <select
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm"
              >
                <option value="Damaged">Damaged / Defective (ပျက်စီးနေခြင်း)</option>
                <option value="Wrong Item">Wrong Item Delivered (အမျိုးအစား မှားခြင်း)</option>
                <option value="Customer Mind Change">Customer Changed Mind</option>
              </select>
            </div>

            <div className="rounded-xl bg-blue-50 p-4 text-right">
              <span className="text-xs font-semibold uppercase text-blue-600">Total Refund Amount</span>
              <div className="mt-1 text-2xl font-bold text-blue-900">
                {calculateTotalRefund.toLocaleString()} MMK
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={calculateTotalRefund === 0}
              className="rounded-xl bg-red-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-red-700 disabled:opacity-50"
            >
              Confirm & Refund
            </button>
          </div>
        </div>
      )}
    </div>
  );
}