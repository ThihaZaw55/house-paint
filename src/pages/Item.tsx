import React, { useState } from "react";
import PageTitle from "../components/ui/PageTitle";
import type { Item } from "../types/item";
import useItem from "../hooks/useItem";
import Input from "../components/forms/Input";
import ErrorPopup from "../components/ui/ErrorPopup";
import SuccessPopup from "../components/ui/SuccessPopup";
import Table, { type TableColumn } from "../components/ui/Table";

const ItemPage: React.FC = () => {
  const {
    items,
    loading,
    error,
    setError,
    message,
    setMessage,
    saveItem,
    deleteItem,
  } = useItem();

  const [formData, setFormData] = useState({ itemName: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ itemName?: string }>({});

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
    setFormData({ itemName: "" });
    setEditId(null);
    setFieldErrors({});
  };

  // Validate Form
  const validateForm = () => {
    const errors: { itemName?: string } = {};
    if (!formData.itemName.trim()) {
      errors.itemName = "item name is required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // CREATE / UPDATE: Save Action
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    // Hook ထဲမှ saveItem ကို ခေါ်သုံးခြင်း
    const success = await saveItem(editId, formData);
    if (success) {
      handleNew();
    }
  };

  // EDIT: Populate form for editing
  const handleEdit = (item: Item) => {
    setEditId(item.itemId!);
    setFormData({ itemName: item.itemName });
    setFieldErrors({});
  };

  // DELETE: Delete record
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    // Hook ထဲမှ deleteItem ကို ခေါ်သုံးခြင်း
    const success = await deleteItem(id);
    if (success && editId === id) {
      handleNew();
    }
  };

  const itemColumns: TableColumn<Item>[] = [
    {
      key: "itemId",
      title: "ID",
      className: "py-3.5 px-5 font-mono text-xs font-semibold text-slate-500 w-24",
      render: (item) => `#${item.itemId}`,
    },
    {
      key: "itemName",
      title: "Item Name",
      className: "py-3.5 px-5 font-medium text-slate-800",
      render: (item) => (
        <div className="flex items-center gap-2">
          <span>{item.itemName}</span>
          {editId === item.itemId && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
              Editing
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      className: "py-3.5 px-5 text-right w-40",
      render: (item) => (
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
            onClick={() => handleDelete(item.itemId!)}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-200"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <PageTitle title="Items Management" />

      <ErrorPopup error={error} setError={setError} />
      <SuccessPopup message={message} setMessage={setMessage} />

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">
          {editId !== null ? "Edit item" : "Add New item"}
        </h2>

        <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full sm:flex-1">
            <Input
              name="itemName"
              type="text"
              value={formData.itemName}
              onChange={handleChange}
              label="Item Name"
              placeholder="e.g. Gallon, Liter, KG, Box"
              //fieldErrors={fieldErrors.itemName}
            />
            {fieldErrors.itemName && (
              <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.itemName}</p>
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
              {loading ? "Processing..." : editId !== null ? "Update Item" : "Save Item"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-800">Item List</h3>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            Total: {items.length}
          </span>
        </div>

        <Table
          columns={itemColumns}
          data={items}
          rowKey={(item) => item.itemId}
          loading={loading && items.length === 0}
          loadingText="Loading items..."
          rowClassName={(item) => (editId === item.itemId ? "bg-blue-50/50" : "")}
          emptyState={
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="font-medium text-slate-500">No items found</p>
              <p className="text-xs text-slate-400">Create your first measurement item using the form above.</p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default ItemPage;