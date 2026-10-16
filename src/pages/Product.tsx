import React, { useState, useEffect, useRef, type ChangeEvent } from "react";
import PageTitle from "../components/ui/PageTitle";
import Input from "../components/forms/Input";
import useItem from "../hooks/useItem";
import { useUnits } from "../hooks/useUnit";
import type {
  Product,
  StoredImageData,
} from "../types/product";
import InputPrice from "../components/ui/InputPrice";
import useProduct from "@/hooks/useProduct";
import ErrorPopup from "../components/ui/ErrorPopup";
import SuccessPopup from "../components/ui/SuccessPopup";

// 1. Value များအားလုံးကို null / undefined မဟုတ်ဘဲ Empty String သို့မဟုတ် 0 ဖြင့် စတင်ပေးပါ
const INITIAL_FORM_STATE: Product = {
  productId: 0,
  itemId: "",
  unitId: "",
  category: "",
  stockQuantity: "",
  costPrice: "",
  salePrice: "",
  description: "",
  createdDate: "",
  imagePath: "",
};

const ProductComponent: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    products,
    isLoading,
    error,
    setError,
    message,
    setMessage,
    fetchProducts,
    saveProduct,
    deleteProduct,
  } = useProduct();

  const { items, loading: itemLoading } = useItem();
  const { units, loading: unitLoading } = useUnits();
  
  const paintOptions = items.map((item) => ({ id: item.itemId, item: item.itemName }));
  const unitOptions = units.map((unit) => ({ id: unit.unitId, unit: unit.unitName }));
  
  //const [products, setproducts] = useState<Product[]>([]);
  //const [isLoading, setIsLoading] = useState<boolean>(true);

  const [form, setForm] = useState<Product>(INITIAL_FORM_STATE);
  const [isEditing, setIsEditing] = useState(false);

  const [image, setImage] = useState<StoredImageData | null>(null);
  const [tempFile, setTempFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNew = () => {
    setForm(INITIAL_FORM_STATE);
    setImage(null);
    setTempFile(null);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    const payload = {
      itemId: String(form.itemId),
      unitId: String(form.unitId),
      category: form.category,
      stockQuantity: Number(form.stockQuantity),
      costPrice: Number(form.costPrice),
      salePrice: Number(form.salePrice),
      description: form.description || "",
      createdDate: form.createdDate || new Date().toISOString(),
      imagePath: form.imagePath || "",
    };

    const success = await saveProduct(isEditing ? form.productId : null, payload, tempFile);
    if (success) {
      handleNew();
    }
  };

  // 2. handleEdit တွင် DB မှ null / undefined ပါလာပါက empty string ("") သို့ မဖြစ်မနေ ပြောင်းပေးပါ
  const handleEdit = (item: Product) => {
    setForm({
      productId: item.productId ?? 0,
      itemId: item.itemId ?? "",
      unitId: item.unitId ?? "",
      category: item.category ?? "",
      stockQuantity: item.stockQuantity ?? "",
      costPrice: item.costPrice ?? "",
      salePrice: item.salePrice ?? "",
      description: item.description ?? "",
      createdDate: item.createdDate ?? "",
      imagePath: item.imagePath ?? "",
    });
    setIsEditing(true);
    if (item.imagePath) {
      setImage({ name: item.imagePath, dataUrl: "" });
    } else {
      setImage(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const success = await deleteProduct(id);
    if (success && isEditing) {
      handleNew();
    }
  };

  const handleChooseImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      setTempFile(file);
      setImage({
        name: file.name,
        dataUrl: dataUrl,
      });
      setForm((prev) => ({ ...prev, imagePath: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImage(null);
    setTempFile(null);
    setForm((prev) => ({ ...prev, imagePath: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isTableLoading = isLoading || itemLoading || unitLoading;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (item) => Number(item.stockQuantity ?? 0) <= 10
  ).length;
  const inventoryValue = products.reduce((sum, item) => {
    const stock = Number(item.stockQuantity ?? 0);
    const cost = Number(item.costPrice ?? 0);
    return sum + stock * cost;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <PageTitle title="Products" />
            <p className="mt-2 text-sm text-slate-500">
              Manage your paint catalog, pricing, stock levels, and product media.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Total</p>
              <p className="mt-1 text-lg font-bold text-slate-800">{totalProducts}</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-2 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-amber-600">Low stock</p>
              <p className="mt-1 text-lg font-bold text-amber-700">{lowStockProducts}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-600">Inventory</p>
              <p className="mt-1 text-lg font-bold text-emerald-700">{inventoryValue.toLocaleString()} Ks</p>
            </div>
          </div>
        </div>

        <ErrorPopup error={error} setError={setError} />
        <SuccessPopup message={message} setMessage={setMessage} />

        <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] md:p-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">Product details</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-800">
                {isEditing ? "Update product" : "Add new product"}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleNew}
                className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                New
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                {isEditing ? "Update" : "Save product"}
              </button>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Paint Item</span>
              <select
                name="itemId"
                value={form.itemId ?? ""}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select an item</option>
                {paintOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.item}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Unit</span>
              <select
                name="unitId"
                value={form.unitId ?? ""}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select a unit</option>
                {unitOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.unit}
                  </option>
                ))}
              </select>
            </label>

            <div className="md:col-span-2 xl:col-span-2">
              <Input
                label="Description"
                name="description"
                type="text"
                value={form.description ?? ""}
                onChange={handleChange}
                placeholder="Short description or finish detail"
              />
            </div>

            <InputPrice
              label="Sale Price"
              name="salePrice"
              type="number"
              value={form.salePrice ?? ""}
              onChange={handleChange}
              placeholder="Sale Price"
            />

            <InputPrice
              label="Cost Price"
              name="costPrice"
              type="number"
              value={form.costPrice ?? ""}
              onChange={handleChange}
              placeholder="Cost Price"
            />

            <InputPrice
              label="Stock Quantity"
              name="stockQuantity"
              type="number"
              value={form.stockQuantity ?? ""}
              onChange={handleChange}
              placeholder="Quantity"
            />

            <div className="md:col-span-2 xl:col-span-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-lg">🖼️</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Product image</p>
                      <p className="text-xs text-slate-500">Upload a product shot for catalog display</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleChooseImageClick}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
                    >
                      Choose image
                    </button>
                    {image && (
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {image ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr]">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                      <img
                        className="h-28 w-full rounded-xl object-cover"
                        src={image.dataUrl || `http://localhost:8080${form.imagePath}`}
                        alt={image.name}
                        onError={(event) => {
                          event.currentTarget.src = "https://placehold.co/500x500/f1f5f9/64748b?text=No+Image";
                        }}
                      />
                    </div>

                    <div className="flex h-full flex-col justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Selected file</p>
                      <p className="mt-2 text-base font-semibold text-slate-700">{image.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {tempFile ? `${(tempFile.size / 1024).toFixed(0)} KB` : "Stored product asset"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">
                    No image selected yet
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Inventory</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-800">Product list</h3>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
              {products.length} items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-[0.12em]">
                  <th className="p-3 text-center text-[11px] font-semibold">ID</th>
                  <th className="p-3 text-[11px] font-semibold">Image</th>
                  <th className="p-3 text-[11px] font-semibold">Item</th>
                  <th className="p-3 text-[11px] font-semibold">Unit</th>
                  <th className="p-3 text-[11px] font-semibold">Qty</th>
                  <th className="p-3 text-[11px] font-semibold">Cost</th>
                  <th className="p-3 text-[11px] font-semibold">Sale</th>
                  <th className="p-3 text-[11px] font-semibold">Description</th>
                  <th className="p-3 text-center text-[11px] font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-slate-700">
                {isTableLoading && products.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400">
                      No products added yet.
                    </td>
                  </tr>
                ) : (
                  products.map((item) => {
                    const row = item as Product & { itemName?: string; unitName?: string };
                    const stock = Number(item.stockQuantity ?? 0);
                    const hasLowStock = stock <= 10;

                    return (
                      <tr key={item.productId} className="transition-colors hover:bg-slate-50">
                        <td className="p-3 text-center text-slate-500">{item.productId}</td>
                        <td className="p-3">
                          {item.imagePath ? (
                            <img
                              className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200"
                              src={item.imagePath.startsWith("http") ? item.imagePath : `http://localhost:8080${item.imagePath}`}
                              alt={item.imagePath.split("/").pop() || "Product image"}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                                (event.currentTarget.nextElementSibling as HTMLElement | null)?.classList.remove("hidden");
                              }}
                            />
                          ) : null}
                          <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-xs font-medium text-slate-500 ${item.imagePath ? "hidden" : ""}`}>
                            No image
                          </div>
                        </td>
                        <td className="p-3 font-medium text-slate-800">{row.itemName ?? item.itemId}</td>
                        <td className="p-3 text-slate-600">{row.unitName ?? item.unitId}</td>
                        <td className="p-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              hasLowStock
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {stock}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">{item.costPrice} Ks</td>
                        <td className="p-3 text-slate-600">{item.salePrice} Ks</td>
                        <td className="p-3 text-slate-600">{item.description || "—"}</td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-600"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.productId)}
                              className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductComponent;