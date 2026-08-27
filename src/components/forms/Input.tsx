import React, { type ChangeEvent } from "react";

interface InputProps {
  name: string;
  type?: string;
  value?: string;
  form?: any; // or specify your Product type
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
  fieldErrors?: string ; // or specify your Product type
}

export default function Inupt({
  name,
  type = "text",
  value,
  onChange,
  label,
  placeholder,
  fieldErrors,
}: InputProps) {
  return (
    <>
        <label htmlFor="itemName" className="block text-xs font-medium text-slate-600 mb-1">
              {label} <span className="text-red-500">*</span>
            </label>
            <input
              id="itemName"
              type={type}
              name={name}
              value={value ?? ""}
              onChange={onChange}
              placeholder={placeholder}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-100 focus:bg-white focus:ring-2 ${
               fieldErrors
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            /> 
    </>
  );
}