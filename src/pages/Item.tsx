import React, { useState } from "react";

interface PaintItem {
  id: number;
  itemName: string;
  unit: string;
  category: string;
  price: number;
  description: string;
  createdDate: string;
}
const Item: React.FC = () => {
  const [items, setItems] = React.useState<PaintItem[]>([
    {
      id: 1,
      itemName: "Premium Wall Paint",
      unit: "Gallon",
      category: "Interior",
      price: 4500,
      description: "Smooth finish interior wall paint",
      createdDate: "2026-03-05",
    },
  ]);

  const [form, setForm] = useState<PaintItem>({
    id: 0,
    itemName: "",
    unit: "",
    category: "",
    price: 0,
    description: "",
    createdDate: "",
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
      itemName: "",
      unit: "",
      category: "",
      price: 0,
      description: "",
      createdDate: "",
    });
    setIsEditing(false);
  };

  const handleSave = () => {
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
        <div className="">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            House Paint Item
          </h1>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              placeholder="Item Name"
              className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-md 
                     text-slate-900 outline-none transition-all
                     placeholder:text-slate-400
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="Unit"
              className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-md 
                     text-slate-900 outline-none transition-all
                     placeholder:text-slate-400
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-md 
                     text-slate-900 outline-none transition-all
                     placeholder:text-slate-400
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <input
              name="price"
              type="number"
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
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:col-span-2"
            />
          </form>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleNew}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
            >
              New
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
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
                    <td className="p-3">{item.itemName}</td>
                    <td className="p-3">{item.unit}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">{item.price} K</td>
                    <td className="p-3">{item.description}</td>
                    <td className="p-3">{item.createdDate}</td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
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
      </div>
    </>
  );
};

export default Item;
