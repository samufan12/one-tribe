import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

interface Props {
  className?: string;
  iconSize?: number;
}

const NotificationsBell = ({ className = "", iconSize = 18 }: Props) => {
  const { notifications, unreadCount, markAllRead } = useNotifications();

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) markAllRead();
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          className={`relative p-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors ${className}`}
          aria-label="Notifications"
        >
          <Bell size={iconSize} strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground text-[9px] font-semibold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[420px] overflow-y-auto p-0">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Notifications</h3>
        </div>
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((n) => (
              <li key={n.id} className="px-4 py-3 hover:bg-secondary/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  {!n.is_read && (
                    <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {n.message}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-1">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsBell;
