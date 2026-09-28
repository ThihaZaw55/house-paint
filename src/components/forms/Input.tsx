import React, { type ChangeEvent } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  error?: string | null;
  /** callback that returns the raw value when it changes */
  onValueChange?: (value: string) => void;
}

export default function Input({
  name,
  label,
  error,
  onChange,
  onValueChange,
  className = "",
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? name;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    if (onValueChange) onValueChange(e.target.value ?? "");
  };

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-600 mb-1">
          {label} {rest.required ? <span className="text-red-500">*</span> : null}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        onChange={handleChange}
        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-100 focus:bg-white focus:ring-2 ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
        } ${className}`}
        {...rest}
      />

      {error ? <p className="text-xs text-red-500 mt-1">{error}</p> : null}
    </div>
  );
}