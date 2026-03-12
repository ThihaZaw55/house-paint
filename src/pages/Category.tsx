import React, { useState } from "react";

interface PaintItem {
  id: number;
  category: string;
}
const Category: React.FC = () => {
  const [items, setItems] = React.useState<PaintItem[]>([
    {
      id: 1,
      category: "Colorful",
    },
  ]);

  const [form, setForm] = useState<PaintItem>({
    id: 0,
    category: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNew = () => {
    setForm({
      id: 0,
      category: "",
    });
    setIsEditing(false);
  };

  const [errors, setErrors] = useState({
    category: "",
  });

  const handleSave = () => {
    if (!form.category.trim()) {
      setErrors({ category: "Category is required" });
      return;
    }

    setErrors({ category: "" });

    if (isEditing) {
      setItems(items.map((item) => (item.id === form.id ? form : item)));
    } else {
      setItems([...items, { ...form, id: Date.now() }]);
    }

    handleNew();
  };

  const handleEdit = (item: PaintItem) => {
    setForm(item);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          House Paint Category
        </h1>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder={errors.category ? errors.category : "Category"}
            className={`px-4 py-2 bg-slate-50 border rounded-md
  text-slate-900 outline-none transition-all
  placeholder:text-slate-400
  focus:ring-2
  ${
    errors.category
      ? "border-red-500 focus:ring-red-200"
      : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
  }`}
          />
        </form>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleNew}
            className="bg-gray-500 hover:bg-gray-600 active:bg-gray-500 cursor-pointer text-white px-5 py-2 rounded-lg"
          >
            New
          </button>
          <button
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
                <th className="p-3">category</th>
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
                  <td className="p-3">{item.category}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-500 cursor-pointer text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
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
    </>
  );
};

export default Category;
