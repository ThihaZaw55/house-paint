import { useMemo, useState } from "react";
import ErrorPopup from "../components/ui/ErrorPopup";
import SuccessPopup from "../components/ui/SuccessPopup";
import useItem from "../hooks/useItem";
import useProduct from "../hooks/useProduct";
import { useUnits } from "../hooks/useUnit";
import usePurchase from "@/hooks/usePurchase";
import type { CreatePurchase, PurchaseSearch } from "@/types/purchase";
import PageTitle from "@/components/ui/PageTitle";

type PurchaseCartItem = {
  id: string;
  productId: number;
  itemName: string;
  unitName: string;
  quantity: number;
  costPrice: number;
  salePrice: number;
  purchaseDate: string;
};

const fieldClassName =
  "h-11 w-full rounded-xl border border-slate-500 px-3 text-sm placeholder:text-slate-500 outline-none transition focus:border-blue-400  focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60";

const today = () => new Date().toISOString().slice(0, 10);

export default function PurchasePage() {
  const { products, isLoading: productsLoading } = useProduct();
  const { items, loading: itemLoading, error: itemError, setError: setItemError } = useItem();
  const { units, loading: unitLoading, error: unitError, setError: setUnitError } = useUnits();
  const {
    createPurchase,
    search,
    searchResults = [],
    isLoading: purchaseListLoading,
    error: purchaseError,
  } = usePurchase();

  const [purchaseDate, setPurchaseDate] = useState(today());
  const [supplierName, setSupplierName] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [purchaseIdFilter, setpurchaseIdFilter] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [costPrice, setCostPrice] = useState<number | string>("");
  const [salePrice, setSalePrice] = useState<number | string>("");
  const [quantity, setQuantity] = useState<number | string>("");
  const [cart, setCart] = useState<PurchaseCartItem[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () =>
      products.find(
        (product) =>
          String(product.itemId) === selectedItemId && String(product.unitId) === selectedUnitId,
      ),
    [products, selectedItemId, selectedUnitId],
  );

  const itemUnitOptions = useMemo(
    () => products.filter((product) => String(product.itemId) === selectedItemId),
    [products, selectedItemId],
  );

  const totalCost = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.costPrice, 0),
    [cart],
  );

  const getItemName = (itemId: string | number) =>
    items.find((item) => String(item.itemId) === String(itemId))?.itemName ??
    products.find((product) => String(product.itemId) === String(itemId))?.itemId ??
    String(itemId);

  const getUnitName = (unitId: string | number) =>
    units.find((unit) => String(unit.unitId) === String(unitId))?.unitName ?? String(unitId);

  const resetEntryForm = () => {
    setSelectedItemId("");
    setSelectedUnitId("");
  };

  const handleItemChange = (nextItemId: string) => {
    setSelectedItemId(nextItemId);
    const firstProductForItem = products.find((product) => String(product.itemId) === nextItemId);
    const nextUnitId = firstProductForItem ? String(firstProductForItem.unitId) : "";
    setSelectedUnitId(nextUnitId);

    if (firstProductForItem) {
      setCostPrice(firstProductForItem.costPrice ?? "");
      setSalePrice(firstProductForItem.salePrice ?? "");
      setQuantity(firstProductForItem.stockQuantity ?? "");
    } else {
      setCostPrice("");
      setSalePrice("");
      setQuantity("");
    }
  };

  const handleUnitChange = (nextUnitId: string) => {
    setSelectedUnitId(nextUnitId);
    const product = products.find(
      (entry) => String(entry.itemId) === selectedItemId && String(entry.unitId) === nextUnitId,
    );

    if (product) {
      setCostPrice(product.costPrice ?? "");
      setSalePrice(product.salePrice ?? "");
    }
  };

  const addItemToCart = () => {
    setError(null);
    setMessage(null);

    if (!selectedItemId || !selectedUnitId) {
      setError("Please select a paint item and unit before adding to the list.");
      return;
    }

    const parsedCostPrice = Number(costPrice);
    const parsedSalePrice = Number(salePrice);
    const parsedQuantity = Number(quantity);

    if (!Number.isFinite(parsedCostPrice) || parsedCostPrice < 0) {
      setError("Cost price must be a valid number.");
      return;
    }

    if (!Number.isFinite(parsedSalePrice) || parsedSalePrice < 0) {
      setError("Sale price must be a valid number.");
      return;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    const product = products.find(
      (entry) => String(entry.itemId) === selectedItemId && String(entry.unitId) === selectedUnitId,
    );

    if (!product) {
      setError("The selected paint item and unit combination is not available.");
      return;
    }

    const itemName = getItemName(product.itemId);
    const unitName = getUnitName(product.unitId);

    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex(
        (item) => item.productId === product.productId,
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + parsedQuantity,
          costPrice: parsedCostPrice,
          salePrice: parsedSalePrice,
        };
        return updatedCart;
      }

      return [
        ...currentCart,
        {
          id: `${product.productId}-${Date.now()}`,
          productId: product.productId,
          itemName,
          unitName,
          quantity: parsedQuantity,
          costPrice: parsedCostPrice,
          salePrice: parsedSalePrice,
          purchaseDate,
        },
      ];
    });

    setMessage("Item added to purchase list.");
    resetEntryForm();
  };

  const removeItemFromCart = (id: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
    setError(null);
  };

  const handleSearchPurchase = async () => {
    setError(null);

    const payload: PurchaseSearch = {
      purchaseDate: dateFilter || "",
      supplierName: supplierFilter.trim() || "",
      purchaseId: purchaseIdFilter.trim() || "",
    };

    const response = await search(payload);
    console.log("Search response:", response);
    setIsSearchModalOpen(true);
  };

  const handleSavePurchase = async () => {
    const cleanedSupplierName = supplierName.trim();

    if (!purchaseDate) {
      setError("Please select a purchase date.");
      return;
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      setError("Your purchase list is empty. Add at least one item before saving.");
      return;
    }

    const payload: CreatePurchase = {
      supplierName: cleanedSupplierName || "SUPPLIER-N/A",
      totalCost: Number(totalCost.toFixed(2)),
      purchaseDate,
      purchaseItems: cart.map((item) => ({
        productId: item.productId,
        buyQuantity: item.quantity,
        costPrice: Number(item.costPrice),
        salePrice: Number(item.salePrice),
      })),
    };

    try {
      const success = await createPurchase(payload);
      if (success) {
        setMessage("Purchase saved successfully.");
        setCart([]);
        setSupplierName("");
        resetEntryForm();
      }
    } catch (err) {
      console.error("Error saving purchase:", err);
      setError("An error occurred while saving the purchase. Please try again.");
    }
  };

  const loading = productsLoading || itemLoading || unitLoading;

  return (
    <main className="min-h-screen px-2 py-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <PageTitle title="Products" />
        </div>

        <ErrorPopup
          error={error ?? itemError ?? unitError ?? purchaseError}
          setError={(nextValue) => {
            setError(nextValue);
            setItemError(nextValue);
            setUnitError(nextValue);
          }}
        />
        <SuccessPopup message={message} setMessage={setMessage} />

        {/* Filters Section */}
        <section className="rounded-2xl border border-slate-300 shadow-2xl shadow-slate-950/30">
          <div className="px-5 py-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold">Filters</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDateFilter("");
                  setSupplierFilter("");
                  setpurchaseIdFilter("");
                }}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium hover:border-slate-700"
              >
                Clear All
              </button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <label className="space-y-2 text-sm">
                <span className="font-medium">Date</span>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  className={fieldClassName}
                />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Supplier Name</span>
                <input
                  type="text"
                  value={supplierFilter}
                  onChange={(event) => setSupplierFilter(event.target.value)}
                  placeholder="Search supplier"
                  className={fieldClassName}
                />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Purchase ID</span>
                <input
                  type="text"
                  value={purchaseIdFilter}
                  onChange={(event) => setpurchaseIdFilter(event.target.value)}
                  placeholder="Search Purchase ID"
                  className={fieldClassName}
                />
              </label>

              <div className="flex items-end xl:col-span-1">
                <button
                  type="button"
                  onClick={handleSearchPurchase}
                  disabled={purchaseListLoading}
                  className="h-11 w-full rounded-xl bg-blue-500 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {purchaseListLoading ? "Searching..." : "Search Purchases"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Purchase Entry Section */}
        <section className="rounded-2xl border border-slate-800 p-5 shadow-2xl shadow-slate-950/30 md:p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Purchase Entry</h2>
            </div>
            <div className="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-green-500">
              {cart.length} item(s) in cart
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="space-y-2 text-sm xl:col-span-1">
              <span className="font-medium">Purchase Date</span>
              <input
                type="date"
                value={purchaseDate}
                onChange={(event) => setPurchaseDate(event.target.value)}
                className={fieldClassName}
              />
            </label>

            <label className="space-y-2 text-sm xl:col-span-1">
              <span className="font-medium">Supplier Name</span>
              <input
                value={supplierName}
                onChange={(event) => setSupplierName(event.target.value)}
                placeholder="Supplier name"
                className={fieldClassName}
              />
            </label>

            <label className="space-y-2 text-sm xl:col-span-1">
              <span className="font-medium">Paint Item</span>
              <select
                value={selectedItemId}
                onChange={(event) => handleItemChange(event.target.value)}
                disabled={loading}
                className={fieldClassName}
              >
                <option value="">{loading ? "Loading items..." : "Select an item"}</option>
                {items.map((item) => (
                  <option key={item.itemId} value={item.itemId}>
                    {item.itemName}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm xl:col-span-1">
              <span className="font-medium">Unit</span>
              <select
                value={selectedUnitId}
                onChange={(event) => handleUnitChange(event.target.value)}
                disabled={!selectedItemId || loading}
                className={fieldClassName}
              >
                <option value="">{selectedItemId ? "Select a unit" : "Choose item first"}</option>
                {itemUnitOptions.map((product) => (
                  <option key={product.unitId} value={product.unitId}>
                    {getUnitName(product.unitId)}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium">Cost Price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={costPrice}
                onChange={(event) => setCostPrice(event.target.value)}
                placeholder="0.00"
                className={fieldClassName}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium">Sale Price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={salePrice}
                onChange={(event) => setSalePrice(event.target.value)}
                placeholder="0.00"
                className={fieldClassName}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium">Quantity</span>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="1"
                className={fieldClassName}
              />
            </label>

            <div className="flex items-end xl:col-span-1">
              <button
                type="button"
                onClick={addItemToCart}
                className="h-11 w-full rounded-xl bg-blue-500 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
          </div>

          {selectedProduct && (
            <div className="mt-5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
              Selected product:{" "}
              <span className="font-semibold">
                {getItemName(selectedProduct.itemId)} / {getUnitName(selectedProduct.unitId)}
              </span>
            </div>
          )}
        </section>

        {/* Purchase Cart Section */}
        <section className="rounded-2xl border border-slate-800 p-5 shadow-2xl shadow-slate-950/30">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Purchase Cart</h2>
            <span className="text-sm text-slate-400">{cart.length} item(s)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Item</th>
                  <th className="px-4 py-3 font-semibold">Unit</th>
                  <th className="px-4 py-3 text-right font-semibold">Qty</th>
                  <th className="px-4 py-3 text-right font-semibold">Cost</th>
                  <th className="px-4 py-3 text-right font-semibold">Sale</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                      No items added yet. Add products to begin the purchase.
                    </td>
                  </tr>
                ) : (
                  cart.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40">
                      <td className="px-4 py-3 whitespace-nowrap">{item.purchaseDate}</td>
                      <td className="px-4 py-3 font-medium">{item.itemName}</td>
                      <td className="px-4 py-3">{item.unitName}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">
                        {Number(item.costPrice).toLocaleString()} Ks
                      </td>
                      <td className="px-4 py-3 text-right">
                        {Number(item.salePrice).toLocaleString()} Ks
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeItemFromCart(item.id)}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-400">Total cost</div>
            <div className="text-2xl font-bold text-green-500">
              {Number(totalCost).toLocaleString()} Ks
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setCart([])}
              className="rounded-xl border border-slate-500 px-4 py-2.5 text-sm font-medium hover:border-slate-700"
            >
              Clear Cart
            </button>
            <button
              type="button"
              onClick={handleSavePurchase}
              className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-blue-700"
            >
              Save Purchase
            </button>
          </div>
        </section>
      </div>

      {/* Search Results Popup Modal */}
      {isSearchModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs"
          onClick={() => setIsSearchModalOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold">Purchase Search Results</h3>
                <p className="text-xs text-slate-400">{searchResults.length} record(s) found</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="rounded-xl border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto p-6">
              <table className="w-full min-w-[750px] border-collapse text-left text-sm">
                <thead className="sticky top-0 bg-slate-950 text-xs uppercase tracking-[0.16em] text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Item</th>
                    <th className="px-4 py-3 font-semibold">Unit</th>
                    <th className="px-4 py-3 text-right font-semibold">Qty</th>
                    <th className="px-4 py-3 text-right font-semibold">Cost</th>
                    <th className="px-4 py-3 text-right font-semibold">Sale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {searchResults.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                        No purchase items found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    searchResults.map((item, index) => (
                      <tr
                        key={item.purchaseItemId ?? `${item.itemName}-${item.purchaseDate}-${index}`}
                        className="hover:bg-slate-800/50"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">{item.purchaseDate}</td>
                        <td className="px-4 py-3 font-medium">{item.itemName}</td>
                        <td className="px-4 py-3">{item.unitName}</td>
                        <td className="px-4 py-3 text-right">{item.buyQuantity}</td>
                        <td className="px-4 py-3 text-right">
                          {Number(item.costPrice).toLocaleString()} Ks
                        </td>
                        <td className="px-4 py-3 text-right">
                          {Number(item.salePrice).toLocaleString()} Ks
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-6 py-4">
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}