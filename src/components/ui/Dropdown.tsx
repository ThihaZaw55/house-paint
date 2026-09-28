import React from "react";

interface Option {
  value: string | number;
  label: string;
}

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string; // <-- 1. placeholder ကို Interface မှာ သီးသန့် ထည့်ပေးထားပါသည်
  onValueChange?: (value: string) => void;
  error?: string | null;
}

export default function Dropdown({
  name,
  label,
  options,
  onChange,
  onValueChange,
  className = "",
  id,
  placeholder, // <-- 2. Destructuring လုပ်ပြီး ထုတ်ယူထားပါသည်
  error,       // <-- 3. error ကိုပါ တိုက်ရိုက် ခွဲထုတ်လိုက်ပါသည်
  ...rest
}: DropdownProps) {
  const selectId = id ?? name;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) onChange(e);
    if (onValueChange) onValueChange(e.target.value);
  };

  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-slate-600 mb-1">
          {label} {rest.required ? <span className="text-red-500">*</span> : null}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        onChange={handleChange}
        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-slate-900 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 ${className}`}
        {...rest}
      >
        {/* rest.placeholder အစား ခွဲထုတ်ထားသော placeholder ကို သုံးထားပါသည် */}
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      
      {/* (rest as any).error အစား တိုက်ရိုက် ခွဲထုတ်ထားသော error ကို သုံးထားပါသည် */}
      {error ? <p className="text-xs text-red-500 mt-1">{error}</p> : null}
    </div>
  );
}