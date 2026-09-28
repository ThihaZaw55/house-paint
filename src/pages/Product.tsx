import React, { useState, useEffect, useRef, type ChangeEvent } from "react";
import PageTitle from "../components/ui/PageTitle";
import { ProductService } from "../services/product.service";
import Input from "../components/forms/Input";
import useItem from "../hooks/useItem";
import { useUnits } from "../hooks/useUnit";
import type {
  Product,
  StoredImageData,
} from "../types/product";
import InputPrice from "../components/ui/InputPrice";
import Table, { type TableColumn } from "../components/ui/Table";

const INITIAL_FORM_STATE: Product = {
  productId: 0,
  itemId: "",
  unitId: "",
  category: "",
  quantity: "",
  buyPrice: "",
  salePrice: "",
  description: "",
  createdDate: "",
  imagePath: "",
};

const ProductComponent: React.FC = () => {
  // Hidden File Input ကို တိုက်ရိုက် လှမ်းခေါ်ရန် useRef သုံးထားပါသည်
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Dropdown & products State
  const { items, loading: itemLoading } = useItem();
  const { units, loading: unitLoading } = useUnits();
  
  const paintOptions = items.map((item) => ({ id: item.itemId, item: item.itemName }));
  const unitOptions = units.map((unit) => ({ id: unit.unitId, unit: unit.unitName }));
  
  const [products, setproducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 2. Form State
  const [form, setForm] = useState<Product>(INITIAL_FORM_STATE);
  const [isEditing, setIsEditing] = useState(false);

  // 3. Image State (Modal သုံးစရာ မလိုတော့ပါ)
  const [image, setImage] = useState<StoredImageData | null>(null);
  const [tempFile, setTempFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const productRes = await ProductService.getAll();
        console.log("Fetched products:", productRes.data);
        setproducts(productRes.data || []);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
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
      itemId: Number(form.itemId),
      unitId: Number(form.unitId),      
      colourId: form.category ? Number(form.category) : null,
      costPrice: Number(form.buyPrice),
      salesPrice: Number(form.salePrice),
      stockQuantity: Number(form.quantity),
      description: form.description || "",
    };

    try {
      if (isEditing) {
        await ProductService.update(form.productId, payload, tempFile);
      } else {
        await ProductService.create(payload, tempFile);
      }
      const productRes = await ProductService.getAll();
      setproducts(productRes.data || []);
      handleNew();
    } catch (error) {
      console.error("Error saving product:", error);
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
      setproducts((prev) => prev.filter((item) => item.productId !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  // Choose Image Button ကို နှိပ်ပါက hidden file input ၏ click event ကို ခေါ်ပေးမည်
  const handleChooseImageClick = () => {
    fileInputRef.current?.click();
  };

  // File ရွေးလိုက်သည်နှင့် Direct အလုပ်လုပ်မည့် Handler
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

  const productColumns: TableColumn<Product>[] = [
    {
      key: "ProductId",
      title: "ID",
      className: "p-3 text-slate-500 w-20",
      render: (item) => item.productId,
    },
    {
      key: "itemName",
      title: "Item Name",
      className: "p-3 font-medium text-slate-800",
    },
    {
      key: "unitName",
      title: "Unit",
      className: "p-3 text-slate-600",
    },
    {
      key: "imageUrl",
      title: "Image Path",
      className: "p-3 font-mono text-xs text-indigo-600",
      render: (item) => item.imagePath || "—",
    },
    {
      key: "stockQuantity",
      title: "Quantity",
      className: "p-3 text-slate-600",
    },
    {
      key: "costPrice",
      title: "Buy Price",
      className: "p-3 text-slate-600",
      render: (item) => `${item.buyPrice} K`,
    },
    {
      key: "salesPrice",
      title: "Sale Price",
      className: "p-3 text-slate-600",
      render: (item) => `${item.salePrice} K`,
    },
    {
      key: "description",
      title: "Description",
      className: "p-3 text-slate-600",
    },
    // {
    //   key: "createdDate",
    //   title: "Created Date",
    //   className: "p-3 text-slate-500",
    // },
    {
      key: "actions",
      title: "Actions",
      className: "p-3 text-center w-36",
      render: (item) => (
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
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <PageTitle title="Products" />

      {/* Product Form Grid */}
      <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-200 mb-6">
        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Paint Item</span>
            <select
              name="itemId"
              value={form.itemId}
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
              value={form.unitId}
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

          <Input
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
          />

          <Input
            label="Description"
            name="description"
            type="text"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <InputPrice
            label="Buy Price"
            name="buyPrice"
            type="number"
            value={form.buyPrice}
            onChange={handleChange}
            placeholder="Buy Price"
          />

          <InputPrice
            label="Sale Price"
            name="salePrice"
            type="number"
            value={form.salePrice}
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

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <Table
          columns={productColumns}
          data={products}
          rowKey={(item) => item.productId}
          loading={isTableLoading}
          loadingText="Loading products..."
          emptyState={<span>No products added yet.</span>}
        />
      </div>
    </div>
  );
};

export default ProductComponent;