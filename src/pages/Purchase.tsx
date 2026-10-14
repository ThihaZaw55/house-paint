import React, { useState, useEffect, type ChangeEvent, useMemo } from "react";
import PageTitle from "../components/ui/PageTitle";

  // --- Types ---
  interface Product {
    id: number;
    name: string;
    unit: string;
    buyPrice?: number;
  }

  interface PurchaseItem {
    id: number;
    productId: number;
    name: string;
    unit: string;
    qty: number;
    costPrice: number;
    subtotal: number;
  }

  const STORAGE = {
    PRODUCTS: "products",
    PURCHASES: "purchases",
  } as const;

  const Purchase: React.FC = () => {
    // --- Products (mock / localStorage) ---
    const [products, setProducts] = useState<Product[]>(() => {
      try {
        const raw = localStorage.getItem(STORAGE.PRODUCTS);
        if (raw) return JSON.parse(raw) as Product[];
      } catch {
        console.error("Failed to load products from localStorage.");
      }

      return [
        { id: 1, name: "Premium Wall Paint", unit: "Gallon", buyPrice: 4500 },
        { id: 2, name: "Exterior Weathercoat", unit: "Gallon", buyPrice: 5200 },
        { id: 3, name: "Wood Primer", unit: "Litre", buyPrice: 2800 },
      ];
    });

    useEffect(() => {
      try {
        localStorage.setItem(STORAGE.PRODUCTS, JSON.stringify(products));
      } catch {
        console.error("Failed to save products to localStorage.")
      }
    }, [products]);

    // --- Suppliers (simple list) ---
    const [suppliers] = useState<string[]>(["Walk-in", "Supplier A", "Supplier B"]);

    // --- Purchase form state ---
    const [supplier, setSupplier] = useState<string>(suppliers[0]);
    const [selectedProductId, setSelectedProductId] = useState<number | "">("");
    const [unit, setUnit] = useState<string>("");
    const [qty, setQty] = useState<number>(1);
    const [costPrice, setCostPrice] = useState<number>(0);

    // --- Purchase list ---
    const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>(() => []);

    // --- Payment ---
    const [paidAmount, setPaidAmount] = useState<number>(0);

    // Autofill unit and costPrice when product changes
    useEffect(() => {
      // if (selectedProductId === "") {
      //   setUnit("");
      //   setCostPrice(0);
      //   return;
      // }
      const p = products.find((x) => x.id === selectedProductId);
      if (p) {
        setUnit(p.unit);
        setCostPrice(p.buyPrice ?? 0);
      }
    }, [selectedProductId, products]);

    const totalAmount = useMemo(() => purchaseItems.reduce((s, it) => s + it.subtotal, 0), [purchaseItems]);
    const dueAmount = Math.max(0, totalAmount - (paidAmount || 0));

    // --- Handlers ---
    const handleAddToList = () => {
      if (!supplier) return alert("Please select a supplier.");
      if (selectedProductId === "") return alert("Please select a product.");
      if (!qty || qty <= 0) return alert("Quantity must be greater than 0.");
      if (costPrice < 0) return alert("Cost price must be 0 or greater.");

      const prod = products.find((p) => p.id === selectedProductId);
      if (!prod) return;

      const newItem: PurchaseItem = {
        id: Date.now(),
        productId: prod.id,
        name: prod.name,
        unit: prod.unit,
        qty,
        costPrice,
        subtotal: Math.round(qty * costPrice),
      };

      setPurchaseItems((prev) => [...prev, newItem]);
      // reset entry fields except supplier
      setSelectedProductId("");
      setUnit("");
      setQty(1);
      setCostPrice(0);
    };

    const handleDeleteItem = (id: number) => setPurchaseItems((prev) => prev.filter((p) => p.id !== id));

    const handleConfirmSave = () => {
      if (purchaseItems.length === 0) return alert("No items to save.");
      if (paidAmount < 0) return alert("Paid amount cannot be negative.");
      if (paidAmount > totalAmount) return alert("Paid amount cannot exceed total.");

      try {
        const raw = localStorage.getItem(STORAGE.PURCHASES);
        const existing = raw ? JSON.parse(raw) : [];
        const record = {
          id: Date.now(),
          supplier,
          items: purchaseItems,
          total: totalAmount,
          paid: paidAmount,
          due: dueAmount,
          createdAt: new Date().toISOString(),
        };
        existing.push(record);
        localStorage.setItem(STORAGE.PURCHASES, JSON.stringify(existing));
        // clear
        setPurchaseItems([]);
        setPaidAmount(0);
        alert("Purchase saved successfully.");
      } catch (err) {
        console.error(err);
        alert("Failed to save purchase.");
      }
    };

    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <PageTitle title="Purchase / Stock In Entry" />
          <nav className="text-sm text-slate-500 mt-1">Home / Purchase / Stock In Entry</nav>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Left: Item Entry Form (span 2 cols) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Item Entry</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                <span className="font-medium">Supplier</span>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  {suppliers.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                <span className="font-medium">Product</span>
                <select
                  value={selectedProductId}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedProductId(e.target.value === "" ? "" : Number(e.target.value))}
                  className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Unit</span>
                <input readOnly value={unit} className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800" />
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Quantity</span>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value || 0))}
                  className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Cost Price</span>
                <input
                  type="number"
                  min={0}
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value || 0))}
                  className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800"
                />
              </label>

              <div className="md:col-span-2 flex gap-3 items-center">
                <button
                  type="button"
                  onClick={handleAddToList}
                  className="h-12 px-5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl"
                >
                  Add to Purchase List
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProductId("");
                    setUnit("");
                    setQty(1);
                    setCostPrice(0);
                  }}
                  className="h-12 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Right: Summary & Checkout */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Purchase Summary</h3>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-medium">
                    <th className="p-2">Product</th>
                    <th className="p-2">Unit</th>
                    <th className="p-2 text-right">Qty</th>
                    <th className="p-2 text-right">Cost</th>
                    <th className="p-2 text-right">Subtotal</th>
                    <th className="p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseItems.map((it) => (
                    <tr key={it.id} className="border-b border-slate-100">
                      <td className="p-2 font-medium text-slate-800">{it.name}</td>
                      <td className="p-2 text-slate-600">{it.unit}</td>
                      <td className="p-2 text-right">{it.qty}</td>
                      <td className="p-2 text-right">{it.costPrice}</td>
                      <td className="p-2 text-right">{it.subtotal}</td>
                      <td className="p-2 text-center">
                        <button onClick={() => handleDeleteItem(it.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {purchaseItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400">No items added.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-slate-600">Total Amount</div>
                <div className="text-lg font-semibold text-slate-800">{totalAmount}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <label className="space-y-1 text-sm text-slate-700">
                  <div className="font-medium">Paid Amount</div>
                  <input
                    type="number"
                    min={0}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value || 0))}
                    className="h-10 w-full px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800"
                  />
                </label>

                <div className="space-y-1 text-sm text-slate-700">
                  <div className="font-medium">Due Amount</div>
                  <div className="h-10 flex items-center px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800">{dueAmount}</div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button onClick={() => { setPurchaseItems([]); setPaidAmount(0); }} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md">Reset</button>
                <button onClick={handleConfirmSave} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Confirm & Save Purchase</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Purchase;