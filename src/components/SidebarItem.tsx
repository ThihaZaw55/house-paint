// components/SidebarItem.tsx
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  open: boolean;
  badgeCount?: number; // <--- Badge စာလုံး အရေအတွက်
}

export default function SidebarItem({
  icon: Icon,
  label,
  open,
  badgeCount,
}: SidebarItemProps) {
  return (
    <div className="relative flex items-center gap-3 p-2 text-gray-700">
      <div className="relative flex items-center justify-center">
        <Icon size={20} />
        
        {/* Sidebar ပိတ်ထားချိန်မှာ ပေါ်မည့် Badge လေး */}
        {!open && badgeCount !== undefined && badgeCount > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
      </div>

      {open && (
        <span className="flex-1 text-sm font-medium whitespace-nowrap">
          {label}
        </span>
      )}

      {/* Sidebar ဖွင့်ထားချိန်မှာ ပေါ်မည့် Badge လေး */}
      {open && badgeCount !== undefined && badgeCount > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
    </div>
  );
}