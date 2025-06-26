
import { ChevronRight, ChevronDown } from "lucide-react";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isNew?: boolean;
  hasDropdown?: boolean;
  onClick?: () => void;
};

export const SidebarItem = ({ icon, label, isActive = false, isNew = false, hasDropdown = false, onClick }: SidebarItemProps) => (
  <button 
    className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? 'bg-accent' : 'hover:bg-accent'}`}
    onClick={onClick}
  >
    <div className={isActive ? "text-white" : "text-gray-300"}>{icon}</div>
    <span className="text-white text-sm font-medium flex-1 text-left">{label}</span>
    {isNew && (
      <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
        NEW
      </span>
    )}
    {hasDropdown && (
      isActive ? <ChevronDown size={16} className="text-gray-300" /> : <ChevronRight size={16} className="text-gray-300" />
    )}
  </button>
);
