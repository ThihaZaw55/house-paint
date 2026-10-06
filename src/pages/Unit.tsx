import React, { useState } from "react";
import PageTitle from "../components/ui/PageTitle";
import { useUnits } from "../hooks/useUnit";
import type { Unit } from "../types/unit";
import Input from "../components/forms/Input";

export const UnitPage: React.FC = () => {
  const [formData, setFormData] = useState({ unitName: "" });
  const [actionLoading, setActionLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ unitName?: string }>({});

  // Hook မှ Functions များကို ခေါ်ယူခြင်း
  const { units, loading: fetchLoading, error, setError, saveUnit, deleteUnit } = useUnits();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNew = () => {
    setFormData({ unitName: "" });
    setEditId(null);
    setFieldErrors({});
  };

  const validateForm = () => {
    const errors: { unitName?: string } = {};
    if (!formData.unitName.trim()) {
      errors.unitName = "Unit name is required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // CREATE / UPDATE
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setActionLoading(true);
    // Hook ထဲမှ saveUnit ကို ခေါ်သုံးခြင်း
    const success = await saveUnit(editId, formData);
    setActionLoading(false);

    if (success) {
      handleNew();
    }
  };

  const handleEdit = (item: Unit) => {
    setEditId(item.unitId!);
    setFormData({ unitName: item.unitName });
    setFieldErrors({});
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;

    setActionLoading(true);
    // Hook ထဲမှ deleteUnit ကို ခေါ်သုံးခြင်း
    const success = await deleteUnit(id);
    setActionLoading(false);

    if (success && editId === id) {
      handleNew();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <PageTitle title="Units Management" />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="p-1 text-red-400 hover:text-red-700 hover:bg-red-100 rounded-lg"
          >
            ✕
          </button>
        </div>
      )}

      {/* Form Input Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">
          {editId !== null ? "Edit Unit" : "Add New Unit"}
        </h2>

        <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full sm:flex-1">
            <Input name="unitName" type='text' value={formData.unitName} onChange={handleChange} label="Unit Name" placeholder="e.g. Gallon, Liter, KG, Box" error={fieldErrors.unitName} />
            {fieldErrors.unitName && (
              <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.unitName}</p>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto sm:self-end pt-1">
            {editId !== null && (
              <button
                type="button"
                onClick={handleNew}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-300"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={actionLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {actionLoading ? "Processing..." : editId !== null ? "Update Unit" : "Save Unit"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-800">Unit List</h3>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border">
            Total: {units.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <th className="py-3 px-5 font-mono text-xs font-semibold w-24">ID</th>
                <th className="py-3 px-5">Unit Name</th>
                <th className="py-3 px-5 text-right w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {fetchLoading && units.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    Loading units...
                  </td>
                </tr>
              ) : units.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    No units found
                  </td>
                </tr>
              ) : (
                units.map((item) => (
                  <tr
                    key={item.unitId}
                    className={editId === item.unitId ? "bg-blue-50/50 transition-colors" : "transition-colors hover:bg-slate-50"}
                  >
                    <td className="py-3.5 px-5 font-mono text-xs font-semibold w-24">#{item.unitId}</td>
                    <td className="py-3.5 px-5 font-medium">{item.unitName}</td>
                    <td className="py-3.5 px-5 text-right w-40">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.unitId!)}
                          className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UnitPage;