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
      buyPrice: Number(form.costPrice),
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

  return (
    <div className="max-w-7xl mx-auto">
      <PageTitle title="Products" />

      <ErrorPopup error={error} setError={setError} />
      <SuccessPopup message={message} setMessage={setMessage} />

      {/* Product Form Grid */}
      <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-200 mb-6">
        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Paint Item</span>
            <select
              name="itemId"
              value={form.itemId ?? ""}
              onChange={handleChange}
              className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
              className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select a unit</option>
              {unitOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.unit}
                </option>
              ))}
            </select>
          </label>

          {/* 3. name="stockQuantity" သို့ ပြောင်းထားပါသည် */}
          <Input
            label="Quantity"
            name="stockQuantity"
            type="number"
            value={form.stockQuantity ?? ""}
            onChange={handleChange}
            placeholder="Quantity"
          />

          <Input
            label="Description"
            name="description"
            type="text"
            value={form.description ?? ""}
            onChange={handleChange}
            placeholder="Description"
          />

          <InputPrice
            label="Buy Price"
            name="costPrice"
            type="number"
            value={form.costPrice ?? ""}
            onChange={handleChange}
            placeholder="Buy Price"
          />

          <InputPrice
            label="Sale Price"
            name="salePrice"
            type="number"
            value={form.salePrice ?? ""}
            onChange={handleChange}
            placeholder="Sale Price"
          />

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Direct File Trigger Button */}
          <div className="flex items-center gap-2 h-12 md:col-span-4">
            <button
              type="button"
              onClick={handleChooseImageClick}
              className="h-12 px-5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              Choose Image
            </button>
            {image ? (
              <div className="flex items-center justify-between h-12 px-4 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-700 w-full overflow-hidden">
                <span className="truncate font-medium flex items-center gap-1.5" title={image.name}>
                  📁 <span>{image.name}</span>
                </span>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="text-red-500 hover:text-red-700 font-bold ml-2 shrink-0 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center h-12 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs text-slate-400 w-full">
                No file selected
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Form Action Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          type="button"
          onClick={handleNew}
          className="bg-slate-500 hover:bg-slate-600 text-white text-sm font-medium px-5 py-2 rounded-md cursor-pointer transition-colors"
        >
          New
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-md cursor-pointer transition-colors"
        >
          {isEditing ? "Update" : "Save"}
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <th className="p-3 text-slate-500 w-20">ID</th>
              <th className="p-3 font-medium text-slate-800">Item Name</th>
              <th className="p-3 text-slate-600">Unit</th>
              <th className="p-3 font-mono text-xs text-indigo-600">Image Path</th>
              <th className="p-3 text-slate-600">Quantity</th>
              <th className="p-3 text-slate-600">Buy Price</th>
              <th className="p-3 text-slate-600">Sale Price</th>
              <th className="p-3 text-slate-600">Description</th>
              <th className="p-3 text-center w-36">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {isTableLoading && products.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No products added yet.
                </td>
              </tr>
            ) : (
              products.map((item) => {
                const row = item as Product & { itemName?: string; unitName?: string };

                return (
                  <tr key={item.productId} className="transition-colors hover:bg-slate-50">
                    <td className="p-3 text-slate-500 w-20">{item.productId}</td>
                    <td className="p-3 font-medium text-slate-800">{row.itemName ?? item.itemId}</td>
                    <td className="p-3 text-slate-600">{row.unitName ?? item.unitId}</td>
                    <td className="p-3 font-mono text-xs text-indigo-600">{item.imagePath || "—"}</td>
                    <td className="p-3 text-slate-600">{item.stockQuantity}</td>
                    <td className="p-3 text-slate-600">{item.costPrice} K</td>
                    <td className="p-3 text-slate-600">{item.salePrice} K</td>
                    <td className="p-3 text-slate-600">{item.description}</td>
                    <td className="p-3 text-center w-36">
                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.productId)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors cursor-pointer"
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
  );
};

export default ProductComponent;