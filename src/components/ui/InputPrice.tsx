type InputPriceProps = {
    label: string;
    name: string;
    type?: React.HTMLInputTypeAttribute;
    value: string | number;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
};

export default function InputPrice({ label, name, type = "text", value, onChange, placeholder }: InputPriceProps) {
    return (
        <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">{label}</span>
            <input
              name={name}
              type={type}
              min={0}
              step={100}
              inputMode="numeric"
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="h-12 w-full px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </label>
    );
}