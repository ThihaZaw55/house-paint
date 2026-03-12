import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  open: boolean;
}

export default function SidebarItem({
  icon: Icon,
  label,
  open,
}: SidebarItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition">
      <Icon size={20} />
      {open && <span className="text-sm">{label}</span>}
    </div>
  );
}
