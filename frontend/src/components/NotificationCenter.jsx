import { Bell, Check, X } from "lucide-react";
import { useState } from "react";
import useNotifications from "../hooks/useNotifications";

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    connectionError,
    markRead,
    markAllRead,
  } = useNotifications();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((state) => !state)}
        className="relative inline-flex items-center justify-center p-2 rounded-full text-slate-700 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 cursor-pointer shadow-sm"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-[26rem] min-w-[22rem] rounded-[28px] border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 sm:right-auto sm:left-1/2 sm:-translate-x-1/2">
          <div className="flex items-center justify-between gap-4 rounded-t-[28px] bg-slate-50 px-5 py-4">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              <p className="text-xs text-slate-500">Latest activity from the document hub.</p>
            </div>
            <button
              type="button"
              onClick={markAllRead}
              className="rounded-full border border-blue-100 bg-white px-3 py-2 text-xs font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-800"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto px-1 py-2">
            {loading ? (
              <div className="space-y-3 p-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-16 rounded-3xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No notifications yet. Upload a file to get started.
              </div>
            ) : (
              <div className="space-y-2 px-2 py-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group flex items-start gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-sm ${notification.readStatus ? "" : "ring-1 ring-blue-100"}`}
                  >
                    <div className="mt-1 rounded-full bg-slate-200 p-2 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700 transition-all duration-200">
                      {notification.type === "SUCCESS" ? <Check size={16} /> : notification.type === "ERROR" ? <X size={16} /> : <Bell size={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 leading-6">{notification.message}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(notification.timestamp).toLocaleString()}</p>
                    </div>
                    {!notification.readStatus && (
                      <button
                        type="button"
                        onClick={() => markRead(notification.id)}
                        className="rounded-full bg-slate-100 px-3 py-2 text-[11px] font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {connectionError && (
            <div className="rounded-b-[28px] bg-slate-50 p-4 text-xs text-slate-600">
              Real-time connection is unavailable. Notifications will still load when refreshed.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
