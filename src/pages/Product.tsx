import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  item: string;
  unit: string;
  category: string;
  quantity: number | string;
  price: number | string;
  description: string;
  createdDate: string;
}

interface PaintItemOption {
  id: number;
  item: string;
}

interface PaintUnitOption {
  id: number;
  unit: string;
}

const Product: React.FC = () => {
  // 1. Load available dropdown items from localStorage
 // Initialize state directly from localStorage
const [paintOptions, setPaintOptions] = useState<PaintItemOption[]>(() => {
  const savedItems = localStorage.getItem("paint_items");
  return savedItems ? JSON.parse(savedItems) : [];
});

const [UnitOptions, setUnitOptions] = useState<PaintUnitOption[]>(() => {
  const savedItems = localStorage.getItem("paint_units");
  return savedItems ? JSON.parse(savedItems) : [];
});

  // 2. Load product table state (persisted or default)
  const [items, setItems] = useState<Product[]>(() => {
    const saved = localStorage.getItem("products");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            item: "Premium Wall Paint",
            unit: "Gallon",
            category: "Interior",
            quantity: 100,
            price: 4500,
            description: "Smooth finish interior wall paint",
            createdDate: "2026-03-05",
          },
        ];
  });

  const [form, setForm] = useState<Product>({
    id: 0,
    item: "",
    unit: "",
    category: "",
    quantity: "",
    price: "",
    description: "",
    createdDate: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // // Fetch options from localStorage on component mount
  // useEffect(() => {
  //   const savedItems = localStorage.getItem("paint_items");
  //   if (savedItems) {
  //     setPaintOptions(JSON.parse(savedItems));
  //   }
  // }, []);

  // Save Products to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(items));
  }, [items]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNew = () => {
    setForm({
      id: 0,
      item: "",
      unit: "",
      category: "",
      quantity: 0,
      price: 0,
      description: "",
      createdDate: "",
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!form.item) return; // Basic validation check

    if (isEditing) {
      setItems(items.map((item) => (item.id === form.id ? form : item)));
    } else {
      setItems([
        ...items,
        {
          ...form,
          id: Date.now(),
          createdDate: new Date().toISOString().split("T")[0],
        },
      ]);
    }
    handleNew();
  };

  const handleEdit = (item: Product) => {
    setForm(item);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        House Paint Product
      </h1>
      <form 
        onSubmit={(e) => e.preventDefault()} 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {/* Dynamic Dropdown from localStorage */}
        <select
          name="item"
          value={form.item}
          onChange={handleChange}
          className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-md 
                     text-slate-900 outline-none transition-all
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="" disabled>
            Select an item
          </option>

          {/* Render items retrieved from Item component's localStorage */}
          {paintOptions.map((option) => (
            <option key={option.id} value={option.item}>
              {option.item}
            </option>
          ))}
        </select>

         {/* Dynamic Dropdown from localStorage */}
        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-md 
                     text-slate-900 outline-none transition-all
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="" disabled>
            Select an Unit
          </option>

          {/* Render items retrieved from Item component's localStorage */}
          {UnitOptions.map((option) => (
            <option key={option.id} value={option.unit}>
              {option.unit}
            </option>
          ))}
        </select>

        <input
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-md 
                     text-slate-900 outline-none transition-all
                     placeholder:text-slate-400
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-md 
                     text-slate-900 outline-none transition-all
                     placeholder:text-slate-400
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-md 
                     text-slate-900 outline-none transition-all
                     placeholder:text-slate-400
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </form>

      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={handleNew}
          className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg cursor-pointer"
        >
          New
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg cursor-pointer"
        >
          Save
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3">ID</th>
              <th className="p-3">Item Name</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Category</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Price</th>
              <th className="p-3">Description</th>
              <th className="p-3">Created Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.item}</td>
                <td className="p-3">{item.unit}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{item.price} K</td>
                <td className="p-3">{item.description}</td>
                <td className="p-3">{item.createdDate}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;