import React, { useState, useEffect, type ChangeEvent } from "react";
import PageTitle from "../components/PageTitle";

interface Product {
  id: number;
  item: string;
  unit: string;
  category: string;
  quantity: number | string;
  buyPrice: number | string;
  salePrice: number | string;
  description: string;
  createdDate: string;
  imagePath?: string;
}

interface PaintItemOption {
  id: number;
  item: string;
}

interface PaintUnitOption {
  id: number;
  unit: string;
}

interface StoredImageData {
  name: string;
  dataUrl: string;
}

const STORAGE_KEYS = {
  PRODUCTS: "products",
  PAINT_ITEMS: "paint_items",
  PAINT_UNITS: "paint_units",
  USER_IMAGE: "user_image",
} as const;

const ProductComponent: React.FC = () => {
  // 1. Dropdown options safely loaded from localStorage
  const [paintOptions] = useState<PaintItemOption[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAINT_ITEMS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [unitOptions] = useState<PaintUnitOption[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAINT_UNITS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. Product Table State
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 1,
              item: "Premium Wall Paint",
              unit: "Gallon",
              category: "Interior",
              quantity: 100,
              buyPrice: 4500,
              salePrice: 5500,
              description: "Smooth finish interior wall paint",
              createdDate: "2026-03-05",
            },
          ];
    } catch {
      return [];
    }
  });

  // Form State
  const [form, setForm] = useState<Product>({
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
  });
  const [isEditing, setIsEditing] = useState(false);

  // 3. Image & Popup Modal State
  const [image, setImage] = useState<StoredImageData | null>(null);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [tempDataUrl, setTempDataUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load saved image on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEYS.USER_IMAGE);
      if (savedData) {
        const parsed: StoredImageData = JSON.parse(savedData);
        if (parsed?.dataUrl) {
          setImage(parsed);
          setForm((prev) => ({ ...prev, imagePath: parsed.name }));
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.USER_IMAGE);
    }
  }, []);

  // Save products when table updates
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(items));
  }, [items]);

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
    setForm({
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
    });
    handleClearImage();
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!form.item || !form.unit) return;

    const safeProduct: Product = {
      ...form,
      quantity: Number(form.quantity) || 0,
      buyPrice: Number(form.buyPrice) || 0,
      salePrice: Number(form.salePrice) || 0,
      id: isEditing ? form.id : Math.floor(new Date().getTime()),
      createdDate: isEditing
        ? form.createdDate || new Date().toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    };

    if (isEditing) {
      setItems((prev) => prev.map((item) => (item.id === form.id ? safeProduct : item)));
    } else {
      setItems((prev) => [...prev, safeProduct]);
    }

    handleNew();
  };

  const handleEdit = (item: Product) => {
    setForm(item);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
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

    try {
      localStorage.setItem(STORAGE_KEYS.USER_IMAGE, JSON.stringify(imageData));
      setImage(imageData);
      setForm((prev) => ({ ...prev, imagePath: tempFile.name }));
      setIsModalOpen(false);
    } catch {
      setErrorMsg("Image exceeds LocalStorage quota (~5MB). Please use a smaller image.");
    }
  };

  const handleClearImage = () => {
    localStorage.removeItem(STORAGE_KEYS.USER_IMAGE);
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
              <option value="" disabled>Select an item</option>
              {paintOptions.map((option) => (
                <option key={option.id} value={option.item}>{option.item}</option>
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
              <option value="" disabled>Select a unit</option>
              {unitOptions.map((option) => (
                <option key={option.id} value={option.unit}>{option.unit}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
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
          </label>

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
            {items.map((item) => (
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
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={9} className="p-4 text-center text-slate-400">
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