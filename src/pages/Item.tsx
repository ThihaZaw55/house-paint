import React, { useState, useEffect } from "react";

interface PaintItem {
  id: number;
  item: string;
}

const DEFAULT_ITEMS: PaintItem[] = [
  { id: 1, item: "Proshell PR77 Red" },
  { id: 2, item: "UE-9000" },
];

const STORAGE_KEY = "paint_items";

const Item: React.FC = () => {
  // 1. READ (Initial Load from localStorage)
  const [items, setItems] = useState<PaintItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
  });

  const [form, setForm] = useState<PaintItem>({
    id: 0,
    item: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({ item: "" });

  // 2. AUTO-SAVE (Persists Create, Update, and Delete operations)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNew = () => {
    setForm({ id: 0, item: "" });
    setIsEditing(false);
  };

  // CREATE & UPDATE
  const handleSave = () => {
    if (!form.item.trim()) {
      setErrors({ item: "item is required" });
      return;
    }

    setErrors({ item: "" });

    if (isEditing) {
      // UPDATE: Replaces the matching item in state
      setItems(items.map((i) => (i.id === form.id ? form : i)));
    } else {
      // CREATE: Appends new item to state
      setItems([...items, { ...form, id: Date.now() }]);
    }

    handleNew();
  };

  const handleEdit = (item: PaintItem) => {
    setForm(item);
    setIsEditing(true);
  };

  // DELETE
  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        House Paint Item
      </h1>
      
      <form 
        onSubmit={(e) => e.preventDefault()} 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <input
          name="item"
          value={form.item}
          onChange={handleChange}
          placeholder={errors.item ? errors.item : "item"}
          className={`px-4 py-2 bg-slate-50 border rounded-md text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-2 ${
            errors.item
              ? "border-red-500 focus:ring-red-200"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
        />
      </form>

      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={handleNew}
          className="bg-gray-500 hover:bg-gray-600 active:bg-gray-500 cursor-pointer text-white px-5 py-2 rounded-lg"
        >
          New
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-500 cursor-pointer text-white px-5 py-2 rounded-lg"
        >
          Save
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3">ID</th>
              <th className="p-3">item</th>
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
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-500 cursor-pointer text-white px-3 py-1 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 active:bg-red-500 cursor-pointer text-white px-3 py-1 rounded-md text-sm"
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

export default Item;    