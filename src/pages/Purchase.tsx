
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { AxiosError } from "axios";
import PageTitle from "../components/ui/PageTitle";
import ErrorPopup from "../components/ui/ErrorPopup";
import SuccessPopup from "../components/ui/SuccessPopup";
import InputPrice from "../components/ui/InputPrice";
import useItem from "../hooks/useItem";
import useProduct from "../hooks/useProduct";
import { useUnits } from "../hooks/useUnit";
import { PurchaseService } from "../services/purchase.service";
import type { Purchase, CreatePurchase } from "../types/purchase";
import type { Product } from "../types/product";

type ProductWithNames = Product & {
  itemName?: string;
  unitName?: string;
};

const fieldClassName =
  "h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60";

const today = () => new Date().toISOString().slice(0, 10);

export default function PurchasePage() {
  const { products, isLoading: productsLoading } = useProduct();
  const { items, loading: itemLoading, error: itemError, setError: setItemError } = useItem();
  const { units, loading: unitLoading, error: unitError, setError: setUnitError } = useUnits();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [itemId, setItemId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [costPrice, setCostPrice] = useState<number | string>("");
  const [salePrice, setSalePrice] = useState<number | string>("");
  const [quantity, setQuantity] = useState<number | string>("");
  const [purchaseDate, setPurchaseDate] = useState(today());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const catalogProducts = products as ProductWithNames[];
  const productsForItem = catalogProducts.filter(
    (product) => String(product.itemId) === itemId,
  );
  const availableItemIds = new Set(catalogProducts.map((product) => String(product.itemId)));
  const selectedProduct = productsForItem.find(
    (product) => String(product.unitId) === unitId,
  );

  const getProduct = (productId: number) =>
    catalogProducts.find((product) => product.productId === productId);

  const getItemName = (id: string) =>
    catalogProducts.find((product) => String(product.itemId) === id)?.itemName ??
    items.find((item) => String(item.itemId) === id)?.itemName ??
    id;

  const getUnitName = (product: ProductWithNames | undefined) => {
    if (!product) return "Unknown unit";
    return (
      product.unitName ??
      units.find((unit) => String(unit.unitId) === String(product.unitId))?.unitName ??
      String(product.unitId)
    );
  };

  const loadPurchases = useCallback(async () => {
    try {
      setError(null);
      const response = await PurchaseService.getAll();
      setPurchases(response.data ?? []);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || "Failed to load purchases");
    } finally {
      setPurchaseLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPurchases();
  }, [loadPurchases]);

  const resetForm = () => {
    setItemId("");
    setUnitId("");
    setCostPrice("");
    setSalePrice("");
    setQuantity("");
    setPurchaseDate(today());
    setEditingId(null);
  };

  const handleItemChange = (nextItemId: string) => {
    const nextProduct = catalogProducts.find(
      (product) => String(product.itemId) === nextItemId,
    );
    setItemId(nextItemId);
    setUnitId(nextProduct ? String(nextProduct.unitId) : "");
    setCostPrice(nextProduct?.costPrice ?? "");
    setSalePrice(nextProduct?.salePrice ?? "");
  };

  const handleUnitChange = (nextUnitId: string) => {
    const nextProduct = productsForItem.find(
      (product) => String(product.unitId) === nextUnitId,
    );
    setUnitId(nextUnitId);
    setCostPrice(nextProduct?.costPrice ?? "");
    setSalePrice(nextProduct?.salePrice ?? "");
  };

  const handleEdit = (purchase: Purchase) => {
    const product = getProduct(purchase.productId);
    if (!product) {
      setError("This purchase's product is not available in the product catalog.");
      return;
    }
    setEditingId(purchase.purchaseId);
    setItemId(String(product.itemId));
    setUnitId(String(product.unitId));
    setCostPrice(purchase.costPrice);
    setSalePrice(purchase.salePrice);
    setQuantity(purchase.quantity);
    setPurchaseDate(purchase.purchaseDate?.slice(0, 10) || today());
    setError(null);
    setMessage(null);
  };

  const handleSave = async () => {
    if (!selectedProduct) {
      setError("Select a paint item and unit before saving.");
      return;
    }
    if (quantity === "" || Number(quantity) <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    const payload: CreatePurchase = {
      productId: selectedProduct.productId,
      costPrice: Number(costPrice),
      salePrice: Number(salePrice),
      quantity: Number(quantity),
      purchaseDate,
      createdDate: editingId
        ? purchases.find((purchase) => purchase.purchaseId === editingId)?.createdDate ?? new Date().toISOString()
        : new Date().toISOString(),
    };

    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      const response = editingId
        ? await PurchaseService.update(editingId, payload)
        : await PurchaseService.create(payload);
      setMessage(response.message || (editingId ? "Purchase updated" : "Purchase created"));
      resetForm();
      setPurchaseLoading(true);
      await loadPurchases();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || "Failed to save purchase");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (purchaseId: number) => {
    if (!window.confirm("Are you sure you want to delete this purchase?")) return;

    try {
      setError(null);
      setMessage(null);
      const response = await PurchaseService.delete(purchaseId);
      setMessage(response.message || "Purchase deleted");
      if (editingId === purchaseId) resetForm();
      setPurchaseLoading(true);
      await loadPurchases();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || "Failed to delete purchase");
    }
  };

  const loading = productsLoading || itemLoading || unitLoading;
  const setPopupError: Dispatch<SetStateAction<string | null>> = (nextError) => {
    setError(nextError);
    setItemError(nextError);
    setUnitError(nextError);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <PageTitle title="Purchase" />
          <p className="mt-2 text-sm text-slate-500">
            Record paint purchases and review your purchase history.
          </p>
        </div>

        <ErrorPopup error={error ?? itemError ?? unitError} setError={setPopupError} />
        <SuccessPopup message={message} setMessage={setMessage} />

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-slate-800">
              {editingId ? "Edit purchase" : "New purchase"}
            </h2>
            <div className="flex gap-2">
              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving || loading}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update purchase" : "Save purchase"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Paint item</span>
              <select
                value={itemId}
                onChange={(event) => handleItemChange(event.target.value)}
                disabled={loading}
                className={fieldClassName}
              >
                <option value="">{loading ? "Loading products..." : "Select an item"}</option>
                {items
                  .filter((item) => availableItemIds.has(String(item.itemId)))
                  .map((item) => (
                    <option key={item.itemId} value={item.itemId}>{item.itemName}</option>
                  ))}
                {Array.from(availableItemIds)
                  .filter((id) => !items.some((item) => String(item.itemId) === id))
                  .map((id) => (
                    <option key={id} value={id}>{getItemName(id)}</option>
                  ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Unit</span>
              <select
                value={unitId}
                onChange={(event) => handleUnitChange(event.target.value)}
                disabled={!itemId || loading}
                className={fieldClassName}
              >
                <option value="">{itemId ? "Select a unit" : "Choose an item first"}</option>
                {Array.from(new Map(productsForItem.map((product) => [String(product.unitId), product])).values()).map((product) => (
                  <option key={product.unitId} value={product.unitId}>{getUnitName(product)}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Purchase date</span>
              <input
                type="date"
                value={purchaseDate}
                onChange={(event) => setPurchaseDate(event.target.value)}
                className={fieldClassName}
              />
            </label>

            <InputPrice label="Cost price" name="costPrice" type="number" value={costPrice} onChange={(event) => setCostPrice(event.target.value)} placeholder="Cost price" />
            <InputPrice label="Sale price" name="salePrice" type="number" value={salePrice} onChange={(event) => setSalePrice(event.target.value)} placeholder="Sale price" />
            <InputPrice label="Quantity" name="quantity" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Quantity" />
          </div>

          {selectedProduct && (
            <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-500">
              Product: <span className="font-medium text-slate-700">{getItemName(itemId)} / {getUnitName(selectedProduct)}</span>
            </p>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-800">Purchase history</h2>
            <span className="text-sm text-slate-500">{purchases.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Paint item</th>
                  <th className="px-4 py-3 font-semibold">Unit</th>
                  <th className="px-4 py-3 text-right font-semibold">Quantity</th>
                  <th className="px-4 py-3 text-right font-semibold">Cost price</th>
                  <th className="px-4 py-3 text-right font-semibold">Sale price</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {purchaseLoading ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">Loading purchases...</td></tr>
                ) : purchases.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No purchases recorded yet.</td></tr>
                ) : purchases.map((purchase) => {
                  const product = getProduct(purchase.productId);
                  return (
                    <tr key={purchase.purchaseId} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-3">{purchase.purchaseDate?.slice(0, 10) || "-"}</td>
                      <td className="px-4 py-3 font-medium">{product ? getItemName(String(product.itemId)) : `Product #${purchase.productId}`}</td>
                      <td className="px-4 py-3">{getUnitName(product)}</td>
                      <td className="px-4 py-3 text-right">{purchase.quantity}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">{Number(purchase.costPrice).toLocaleString()} Ks</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">{Number(purchase.salePrice).toLocaleString()} Ks</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => handleEdit(purchase)} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100">Edit</button>
                          <button type="button" onClick={() => void handleDelete(purchase.purchaseId)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

