
type DropdownItemProps = {
  icon: React.ReactNode;
  label: string;
  isExternal?: boolean;
  isActive?: boolean;
  onClick?: () => void;
};

export const DropdownItem = ({ icon, label, isExternal = false, isActive = false, onClick }: DropdownItemProps) => (
  <button 
    className={`w-full flex items-center gap-3 p-3 pl-12 hover:bg-accent rounded-md transition-colors ${isActive ? 'bg-accent' : ''}`}
    onClick={onClick}
  >
    <div className={isActive ? "text-white" : "text-gray-300"}>{icon}</div>
    <span className={`text-sm ${isActive ? "text-white" : "text-gray-300"}`}>{label}</span>
    {isExternal && <span className="ml-2 px-1 bg-muted rounded-sm text-[10px] text-gray-300">↗</span>}
  </button>
);
