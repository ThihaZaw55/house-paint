import React, { useMemo, useState } from "react";
import PageTitle from "../components/ui/PageTitle";
import useProduct from "@/hooks/useProduct";
import type { Product } from "@/types/product";

type PurchaseFormState = {
  itemId: string;
  unitId: string;
  quantity: string;
  buyPrice: string;
  salePrice: string;
};

type ProductOption = {
  itemId: string;
  itemName: string;
};

type UnitOption = {
  unitId: string;
  unitName: string;
};

type PurchaseLine = {
  id: string;
  productKey: string;
  itemId: string;
  itemName: string;
  unitId: string;
  unitName: string;
  quantity: number;
  buyPrice: number;
  salePrice: number;
  subtotal: number;
  purchasedAt: string;
};

const INITIAL_FORM_STATE: PurchaseFormState = {
  itemId: "",
  unitId: "",
  quantity: "",
  buyPrice: "",
  salePrice: "",
};

const formatMoney = (value: number) => `${Number(value || 0).toLocaleString()} Ks`;

const PurchasePage: React.FC = () => {
  const { products, isLoading } = useProduct();

  const itemOptions = useMemo<ProductOption[]>(() => {
    const itemMap = new Map<string, string>();

    products.forEach((product) => {
      const typedProduct = product as Product & {
        itemName?: string;
      };

      const itemId = String(product.itemId ?? "");
      if (!itemId) return;

      const itemName = typedProduct.itemName ?? `Paint Item ${itemId}`;
      if (!itemMap.has(itemId)) {
        itemMap.set(itemId, itemName);
      }
    });

    return Array.from(itemMap.entries())
      .map(([itemId, itemName]) => ({ itemId, itemName }))
      .sort((a, b) => a.itemName.localeCompare(b.itemName));
  }, [products]);

  const unitOptions = useMemo<UnitOption[]>(() => {
    const unitMap = new Map<string, string>();

    products.forEach((product) => {
      const typedProduct = product as Product & {
        unitName?: string;
      };

      const unitId = String(product.unitId ?? "");
      if (!unitId) return;

      const unitName = typedProduct.unitName ?? `Unit ${unitId}`;
      if (!unitMap.has(unitId)) {
        unitMap.set(unitId, unitName);
      }
    });

    return Array.from(unitMap.entries())
      .map(([unitId, unitName]) => ({ unitId, unitName }))
      .sort((a, b) => a.unitName.localeCompare(b.unitName));
  }, [products]);

  const [form, setForm] = useState<PurchaseFormState>(INITIAL_FORM_STATE);
  const [purchaseBatch, setPurchaseBatch] = useState<PurchaseLine[]>([]);

  const visibleUnitOptions = useMemo<UnitOption[]>(() => {
    if (!form.itemId) return unitOptions;

    const selectedUnitIds = new Set(
      products
        .filter((product) => String(product.itemId ?? "") === form.itemId)
        .map((product) => String(product.unitId ?? ""))
        .filter(Boolean)
    );

    const filtered = unitOptions.filter((unit) => selectedUnitIds.has(unit.unitId));
    return filtered.length > 0 ? filtered : unitOptions;
  }, [form.itemId, products, unitOptions]);

  const subtotal = useMemo(() => {
    const quantity = Number(form.quantity) || 0;
    const buyPrice = Number(form.buyPrice) || 0;
    return quantity * buyPrice;
  }, [form.buyPrice, form.quantity]);

  const todayKey = new Date().toLocaleDateString();

  const todayPurchases = useMemo(
    () =>
      purchaseBatch.filter(
        (entry) => new Date(entry.purchasedAt).toLocaleDateString() === todayKey
      ),
    [purchaseBatch, todayKey]
  );

  const totalPurchaseAmount = todayPurchases.reduce(
    (sum, entry) => sum + entry.subtotal,
    0
  );
  const totalQuantityPurchasedToday = todayPurchases.reduce(
    (sum, entry) => sum + entry.quantity,
    0
  );
  const totalUniqueItemsBoughtToday = new Set(
    todayPurchases.map((entry) => entry.productKey)
  ).size;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => {
      if (name !== "itemId") {
        return { ...prev, [name]: value };
      }

      const matchingUnits = products
        .filter((product) => String(product.itemId ?? "") === value)
        .map((product) => String(product.unitId ?? ""))
        .filter(Boolean);

      const nextUnitId = matchingUnits.includes(prev.unitId)
        ? prev.unitId
        : matchingUnits[0] ?? "";

      return {
        ...prev,
        itemId: value,
        unitId: nextUnitId,
      };
    });
  };

  const handleAddPurchase = () => {
    const itemId = form.itemId;
    const unitId = form.unitId;
    const quantity = Number(form.quantity);
    const buyPrice = Number(form.buyPrice);
    const salePrice = Number(form.salePrice);

    if (!itemId || !unitId) {
      alert("Please select both the paint item and the unit.");
      return;
    }

    if (!quantity || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (!buyPrice || buyPrice <= 0) {
      alert("Please enter a valid buy price.");
      return;
    }

    const selectedItem = itemOptions.find((option) => option.itemId === itemId);
    const selectedUnit = unitOptions.find((option) => option.unitId === unitId);

    if (!selectedItem || !selectedUnit) {
      alert("Selected item or unit is invalid.");
      return;
    }

    const productKey = `${itemId}-${unitId}`;
    const currentDate = new Date().toISOString();

    setPurchaseBatch((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.productKey === productKey);

      if (existingIndex >= 0) {
        const updated = [...prev];
        const existingEntry = updated[existingIndex];
        const mergedQuantity = existingEntry.quantity + quantity;

        updated[existingIndex] = {
          ...existingEntry,
          quantity: mergedQuantity,
          buyPrice,
          salePrice,
          subtotal: mergedQuantity * buyPrice,
          purchasedAt: currentDate,
        };

        return updated;
      }

      return [
        ...prev,
        {
          id: `${Date.now()}`,
          productKey,
          itemId,
          itemName: selectedItem.itemName,
          unitId,
          unitName: selectedUnit.unitName,
          quantity,
          buyPrice,
          salePrice,
          subtotal: quantity * buyPrice,
          purchasedAt: currentDate,
        },
      ];
    });

    setForm(INITIAL_FORM_STATE);
  };

  const handleClearPurchaseList = () => {
    setPurchaseBatch([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <PageTitle title="Purchase Stock" />
            <p className="mt-2 text-sm text-slate-500">
              Record stock-in purchases and track today&apos;s buying activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Total Purchases Today
              </p>
              <p className="mt-1 text-lg font-bold text-slate-800">
                {formatMoney(totalPurchaseAmount)}
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-indigo-600">
                Total Quantity
              </p>
              <p className="mt-1 text-lg font-bold text-indigo-700">
                {totalQuantityPurchasedToday}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-600">
                Unique Items
              </p>
              <p className="mt-1 text-lg font-bold text-emerald-700">
                {totalUniqueItemsBoughtToday}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] md:p-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">
                Purchase details
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-800">
                Add stock-in item
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setForm(INITIAL_FORM_STATE)}
                className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleAddPurchase}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                Add to Purchase List
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="space-y-2 text-sm text-slate-700 xl:col-span-2">
              <span className="font-medium">Paint Item</span>
              <select
                name="itemId"
                value={form.itemId}
                onChange={handleChange}
                disabled={isLoading}
                className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Select a product</option>
                {itemOptions.map((item) => (
                  <option key={item.itemId} value={item.itemId}>
                    {item.itemName}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Unit</span>
              <select
                name="unitId"
                value={form.unitId}
                onChange={handleChange}
                disabled={isLoading || !form.itemId}
                className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">{form.itemId ? "Select unit" : "Choose a product first"}</option>
                {visibleUnitOptions.map((unit) => (
                  <option key={unit.unitId} value={unit.unitId}>
                    {unit.unitName}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Quantity</span>
              <input
                type="number"
                name="quantity"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Qty"
                className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Buy Price</span>
              <input
                type="number"
                name="buyPrice"
                min="0"
                step="0.01"
                value={form.buyPrice}
                onChange={handleChange}
                placeholder="Buy price"
                className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-700 xl:col-span-2">
              <span className="font-medium">Sale Price</span>
              <input
                type="number"
                name="salePrice"
                min="0"
                step="0.01"
                value={form.salePrice}
                onChange={handleChange}
                placeholder="Sale price"
                className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <div className="flex items-end xl:col-span-3">
              <div className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-600">
                  Subtotal
                </p>
                <p className="mt-2 text-xl font-bold text-emerald-700">
                  {formatMoney(subtotal)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Today
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-800">
                Today&apos;s Purchases
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClearPurchaseList}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Clear batch
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-[0.12em]">
                  <th className="p-3 text-[11px] font-semibold">Product</th>
                  <th className="p-3 text-[11px] font-semibold">Unit</th>
                  <th className="p-3 text-[11px] font-semibold">Qty</th>
                  <th className="p-3 text-[11px] font-semibold">Buy Price</th>
                  <th className="p-3 text-[11px] font-semibold">Total Amount</th>
                  <th className="p-3 text-[11px] font-semibold">Sale Price</th>
                  <th className="p-3 text-[11px] font-semibold">Date / Time</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-slate-700">
                {todayPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      No purchases recorded for today yet.
                    </td>
                  </tr>
                ) : (
                  todayPurchases.map((entry) => (
                    <tr key={entry.id} className="transition-colors hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800">
                        {entry.itemName}
                      </td>
                      <td className="p-3 text-slate-600">{entry.unitName}</td>
                      <td className="p-3 text-slate-600">{entry.quantity}</td>
                      <td className="p-3 text-slate-600">{formatMoney(entry.buyPrice)}</td>
                      <td className="p-3 font-semibold text-slate-800">
                        {formatMoney(entry.subtotal)}
                      </td>
                      <td className="p-3 text-slate-600">{formatMoney(entry.salePrice)}</td>
                      <td className="p-3 text-slate-600">
                        {new Date(entry.purchasedAt).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;