import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import { unitService, type ItemDTO } from "../api/item";

interface PaintUnit {
  ItemID?: number;
  ItemName: string;
}

const Item: React.FC = () => {
  const [units, setUnits] = useState<ItemDTO[]>([]);
  const [formData, setFormData] = useState({ ItemName: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ ItemName?: string }>({});

  useEffect(() => {
    loadUnits();
  }, []);

  // READ: Fetch all units
 const loadUnits = async () => {
  try {
    setLoading(true);
    const data = await unitService.getAll();
    // Ensure every item has a valid id value
    const safeData: PaintUnit[] = data.map((item) => ({
      ItemID: item.ItemID ?? 0,
      ItemName: item.ItemName,
    }));

    setUnits(safeData);
    setError(null);
  } catch (err) {
    setError("Failed to fetch units");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Reset form / New Action
  const handleNew = () => {
    setFormData({ ItemName: "" });
    setEditId(null);
    setFieldErrors({});
  };

  // Validate Form
  const validateForm = () => {
    const errors: { ItemName?: string } = {};
    if (!formData.ItemName.trim()) {
      errors.ItemName = "Unit name is required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // CREATE / UPDATE: Save Action
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (editId !== null && editId != undefined) {
        // Update existing record
        await unitService.update(editId, formData);
      } else {
        // Create new record
        await unitService.create(formData);
      }
      handleNew();
      await loadUnits();
    } catch (err) {
      setError(editId !== null ? "Failed to update unit" : "Failed to create unit");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // EDIT: Populate form for editing
  const handleEdit = (item: PaintUnit) => {
    setEditId(item.ItemID!);
    setFormData({ ItemName: item.ItemName});
    setFieldErrors({});
  };

  // DELETE: Delete record
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;

    try {
      setLoading(true);
      await unitService.delete(id);
      if (editId === id) handleNew();
      await loadUnits();
    } catch (err) {
      setError("Failed to delete unit");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Page Header */}
          <PageTitle title="Units Management" />

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="p-1 text-red-400 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
            aria-label="Close error"
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
            <label htmlFor="ItemName" className="block text-xs font-medium text-slate-600 mb-1">
              Unit Name <span className="text-red-500">*</span>
            </label>
            <input
              id="ItemName"
              type="text"
              name="ItemName"
              value={formData.ItemName}
              onChange={handleChange}
              placeholder="e.g. Gallon, Liter, KG, Box"
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                fieldErrors.ItemName
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />
            {fieldErrors.ItemName && (
              <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.ItemName}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto sm:self-end pt-1">
            {editId !== null && (
              <button
                type="button"
                onClick={handleNew}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-300"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm focus:ring-2 focus:ring-blue-200"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {loading ? "Processing..." : editId !== null ? "Update Unit" : "Save Unit"}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-800">Unit List</h3>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            Total: {units.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <th className="py-3 px-5 w-24">ID</th>
                <th className="py-3 px-5">Unit Name</th>
                <th className="py-3 px-5 text-right w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {loading && units.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading units...
                    </div>
                  </td>
                </tr>
              ) : units.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="font-medium text-slate-500">No units found</p>
                      <p className="text-xs text-slate-400">Create your first measurement unit using the form above.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                units.map((item) => {
                  const isEditing = editId === item.ItemID;
                  return (
                    <tr
                      key={item.ItemID}
                      className={`transition-colors hover:bg-slate-50/80 ${
                        isEditing ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <td className="py-3.5 px-5 font-mono text-xs font-semibold text-slate-500">
                        #{item.ItemID}
                      </td>
                      <td className="py-3.5 px-5 font-medium text-slate-800">
                        <div className="flex items-center gap-2">
                          <span>{item.ItemName}</span>
                          {isEditing && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                              Editing
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-transparent hover:border-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.ItemID!)}
                            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-200"
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
    </div>
  );
};

export default Item;