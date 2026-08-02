import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";

interface PaintUnit {
  id: number;
  unit: string;
}

const DEFAULT_UNITS: PaintUnit [] = [
  {
      id: 1, unit: "1 Gallon",
  },
] 
 const STORAGE_KEY = "paint_units"

const Unit: React.FC = () => {

  const [units, setunits] = React.useState<PaintUnit[]>( ()  => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : DEFAULT_UNITS
  });

  const [form, setForm] = useState<PaintUnit>({
    id: 0,
    unit: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({ item: "" });

    // 2. AUTO-SAVE (Persists Create, Update, and Delete operations)
    useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(units));
    }, [units]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNew = () => {
    setForm({
      id: 0,
      unit: "",
    });
    setIsEditing(false);
  };

// CREATE & UPDATE
  const handleSave = () => {
    if (!form.unit.trim()) {
      setErrors({ item: "item is required" });
      return;
    }

    setErrors({ item: "" });

    if (isEditing) {
      // UPDATE: Replaces the matching item in state
      setunits(units.map((i) => (i.id === form.id ? form : i)));
    } else {
      // CREATE: Appends new item to state
      setunits([...units, { ...form, id: Date.now() }]);
    }

    handleNew();
  };

  const handleEdit = (item: PaintUnit) => {
    setForm(item);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    setunits(units.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="">
        <PageTitle title="Units" />
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          {errors.item && (
            <p className="mt-2 text-sm text-red-600">{errors.item}</p>
          )}
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
            className="bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Save
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3">ID</th>
                <th className="p-3">Unit</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{item.id}</td>
                  <td className="p-3">{item.unit}</td>
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
    </>
  );
};

export default Unit;
