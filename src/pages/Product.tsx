import React, { useState, useEffect, type ChangeEvent } from "react";
import PageTitle from "../components/ui/PageTitle";
import { ProductService } from "../services/product.service";
import Input from "../components/forms/Input";
import type {
  PaintItemOption,
  PaintUnitOption,
  Product,
  StoredImageData,
} from "../types/product";

const INITIAL_FORM_STATE: Product = {
  id: 0,
  item: "",
  unit: "",
  category: "",
  quantity: "",
  buyPrice: "",
  salePrice: "",
  description: "",
  createdDate: "",
  imagePath: "",
};

const ProductComponent: React.FC = () => {
  // 1. Dropdown & Items State
  const [paintOptions, setPaintOptions] = useState<PaintItemOption[]>([]);
  const [unitOptions, setUnitOptions] = useState<PaintUnitOption[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 2. Form State
  const [form, setForm] = useState<Product>(INITIAL_FORM_STATE);
  const [isEditing, setIsEditing] = useState(false);

  // 3. Image & Popup Modal State
  const [image, setImage] = useState<StoredImageData | null>(null);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [tempDataUrl, setTempDataUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch initial data via ProductService
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [paintRes, unitRes, productRes] = await Promise.all([
          ProductService.getPaintOptions(),
          ProductService.getUnitOptions(),
          ProductService.getAll(),
        ]);
        setPaintOptions(paintRes);
        setUnitOptions(unitRes);
        setItems(productRes);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Form Field Handling
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
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!form.item || !form.unit) {
      alert("Please select item and unit");
      return;
    }

    try {
      if (isEditing) {
        // UPDATE via API
        const updatedProduct = await ProductService.update(form.id, form);
        setItems((prev) =>
          prev.map((item) => (item.id === form.id ? updatedProduct : item))
        );
      } else {
        // CREATE via API
        const { id, ...createPayload } = form;
        const createdProduct = await ProductService.create(createPayload);
        setItems((prev) => [...prev, createdProduct]);
      }
      handleNew();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleEdit = (item: Product) => {
    setForm(item);
    setIsEditing(true);
    if (item.imagePath) {
      setImage({ name: item.imagePath, dataUrl: "" });
    } else {
      setImage(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await ProductService.delete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  // Popup & File Handlers
  const handleOpenModal = () => {
    setErrorMsg(null);
    setTempFile(null);
    setTempDataUrl(null);
    setIsModalOpen(true);
  };

  const handleFileSelection = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;
      setTempFile(file);
      setTempDataUrl(dataUrl);
    };
    reader.onerror = () => setErrorMsg("Failed to read image file.");
    reader.readAsDataURL(file);
  };

  const handleSaveImageFromModal = () => {
    if (!tempFile || !tempDataUrl) {
      setErrorMsg("Please select an image first.");
      return;
    }

    const imageData: StoredImageData = {
      name: tempFile.name,
      dataUrl: tempDataUrl,
    };

    setImage(imageData);
    setForm((prev) => ({ ...prev, imagePath: tempFile.name }));
    setIsModalOpen(false);
  };

  const handleClearImage = () => {
    setImage(null);
    setForm((prev) => ({ ...prev, imagePath: "" }));
    setErrorMsg(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageTitle title="Products" />

      {/* Product Form Grid */}
      <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-200 mb-6">
        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Paint Item</span>
            <select
              name="item"
              value={form.item}
              onChange={handleChange}
              className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select an item</option>
              {paintOptions.map((option) => (
                <option key={option.id} value={option.item}>
                  {option.item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Unit</span>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select a unit</option>
              {unitOptions.map((option) => (
                <option key={option.id} value={option.unit}>
                  {option.unit}
                </option>
              ))}
            </select>
          </label>

          {/* <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Quantity</span>
            <input
              name="quantity"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </label> */}

          <Input name="quantity" type="number" handleChange={handleChange} label="Quantity" placeholder="Quantity" />

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Description</span>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Buy Price</span>
            <input
              name="buyPrice"
              type="number"
              min={0}
              step={100}
              inputMode="numeric"
              value={form.buyPrice}
              onChange={handleChange}
              placeholder="Buy Price"
              className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Sale Price</span>
            <input
              name="salePrice"
              type="number"
              min={0}
              step={100}
              inputMode="numeric"
              value={form.salePrice}
              onChange={handleChange}
              placeholder="Sale Price"
              className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </label>

          {/* Compact Image Trigger Slot */}
          <div className="flex items-center gap-2 h-12 md:col-span-4">
            <button
              type="button"
              onClick={handleOpenModal}
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

      {/* Products Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
              <th className="p-3">ID</th>
              <th className="p-3">Item Name</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Image Path</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Buy Price</th>
              <th className="p-3">Sale Price</th>
              <th className="p-3">Description</th>
              <th className="p-3">Created Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={10} className="p-4 text-center text-slate-400">
                  Loading products...
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-3 text-slate-500">{item.id}</td>
                  <td className="p-3 font-medium text-slate-800">{item.item}</td>
                  <td className="p-3 text-slate-600">{item.unit}</td>
                  <td className="p-3 font-mono text-xs text-indigo-600">
                    {item.imagePath || "—"}
                  </td>
                  <td className="p-3 text-slate-600">{item.quantity}</td>
                  <td className="p-3 text-slate-600">{item.buyPrice} K</td>
                  <td className="p-3 text-slate-600">{item.salePrice} K</td>
                  <td className="p-3 text-slate-600">{item.description}</td>
                  <td className="p-3 text-slate-500">{item.createdDate}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan={10} className="p-4 text-center text-slate-400">
                  No products added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* POPUP MODAL FOR FILE UPLOAD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Upload Product Image</h2>

            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelection}
                className="block w-full text-xs text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-xs file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded">
                {errorMsg}
              </div>
            )}

            {tempFile && tempDataUrl && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs font-semibold text-slate-600 mb-2 truncate">
                  Selected File: <span className="text-indigo-600">{tempFile.name}</span>
                </p>
                <img
                  src={tempDataUrl}
                  alt="Preview"
                  className="w-full max-h-40 object-contain rounded-md border border-slate-200 bg-white"
                />
              </div>
            )}

            <div className="flex justify-end gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveImageFromModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Save Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductComponent;