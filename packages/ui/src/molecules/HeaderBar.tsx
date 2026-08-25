"use client";

import { useSession, useLogout, useNotifications } from "@ssu/queries";
import {
  Bell,
  Menu,
  LogOut,
  Check,
  X,
  CalendarClock,
  GraduationCap,
  Radio,
} from "lucide-react";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@ssu/ui";
import type { NotificationItem } from "@ssu/types";
import type { LucideIcon } from "lucide-react";

const NOTIFICATION_READS_KEY = "ssu_notification_reads";

function loadReadNotificationIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(NOTIFICATION_READS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? new Set(parsed.filter((id) => typeof id === "string"))
      : new Set();
  } catch {
    return new Set();
  }
}

function saveReadNotificationIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIFICATION_READS_KEY, JSON.stringify([...ids]));
}

function NotificationIcon({ kind }: { kind?: string }) {
  if (kind === "class-live") {
    return <Radio className="mt-1 h-4 w-4 shrink-0 text-[#EF4444]" />;
  }
  if (kind === "class-upcoming") {
    return <CalendarClock className="mt-1 h-4 w-4 shrink-0 text-[#2563EB]" />;
  }
  if (kind === "course-assigned") {
    return <GraduationCap className="mt-1 h-4 w-4 shrink-0 text-[#4C7D5B]" />;
  }
  return <span className="mt-1 text-lg">⭐</span>;
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export interface HeaderBarMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface HeaderBarProps {
  pageTitle?: string;
  menuItems?: HeaderBarMenuItem[];
  firstName?: string;
  lastName?: string;
  email?: string;
  onBeforeLogout?: () => void | Promise<void>;
}

export function HeaderBar({
  pageTitle,
  menuItems = [],
  firstName,
  lastName,
  email,
  onBeforeLogout,
}: HeaderBarProps) {
  const { data: user } = useSession();
  const { data: fetchedNotifications = [] } = useNotifications();
  const { toggleMobileSidebar } = useSidebar();
  const router = useRouter();
  const logout = useLogout();

  const displayFirstName = firstName ?? user?.firstName ?? "";
  const displayLastName = lastName ?? user?.lastName ?? "";
  const displayEmail = email ?? user?.email ?? "";
  const displayInitial =
    displayFirstName.charAt(0).toUpperCase() ||
    displayEmail.charAt(0).toUpperCase() ||
    "U";

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReadIds(loadReadNotificationIds());
  }, []);

  const notifications = useMemo<NotificationItem[]>(
    () =>
      fetchedNotifications.map((notification) => ({
        ...notification,
        read: readIds.has(notification.id),
      })),
    [fetchedNotifications, readIds],
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = useCallback(() => {
    const next = new Set(readIds);
    notifications.forEach((notification) => next.add(notification.id));
    setReadIds(next);
    saveReadNotificationIds(next);
  }, [notifications, readIds]);

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      saveReadNotificationIds(next);
      return next;
    });
  }, []);

  const handleNotificationClick = useCallback(
    (notification: NotificationItem) => {
      markRead(notification.id);
      setNotifOpen(false);
      if (notification.href) {
        router.push(notification.href);
      }
    },
    [markRead, router],
  );

  const handleLogout = async () => {
    await onBeforeLogout?.();
    logout();
    router.replace("/login");
  };

  const fullName =
    [displayFirstName, displayLastName].filter(Boolean).join(" ") || "User";

  return (
    <>
      <header className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white transition hover:bg-[#F4F4F5] lg:hidden"
          >
            <Menu className="h-5 w-5 text-[#1D1D1D]" />
          </button>

          {pageTitle && (
            <h1 className="hidden text-[12px] text-[#1D1D1D] lg:block">
              {pageTitle}
            </h1>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-2 md:gap-3">
            {/* Notification bell */}
            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((prev) => !prev);
                  setUserOpen(false);
                }}
                className="relative flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-[#F4F4F5]"
              >
                <Bell className="h-5 w-5 text-[#1D1D1D]" />
                {unreadCount > 0 && (
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#356DFF]" />
                )}
              </button>

              {/* Desktop notification dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-[52px] z-50 hidden w-[320px] rounded-[18px] border border-[#EEF2F6] bg-white shadow-xl lg:block">
                  <div className="flex items-center justify-between border-b border-[#F3F4F6] px-4 py-3">
                    <p className="text-[14px] font-semibold text-[#1D1D1D]">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-2 rounded-full bg-[#356DFF] px-1.5 py-0.5 text-[10px] text-white">
                          {unreadCount}
                        </span>
                      )}
                    </p>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[12px] text-[#4E845F] transition hover:opacity-70"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[320px] overflow-y-auto py-2">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Bell className="mb-3 h-8 w-8 text-[#D1D5DB]" />
                        <p className="text-[13px] text-[#6B7280]">
                          No notifications yet
                        </p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif.id}
                          type="button"
                          onClick={() => handleNotificationClick(notif)}
                          className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-[#F7F9FB]"
                        >
                          <NotificationIcon kind={notif.kind} />
                          <div className="flex-1">
                            <p
                              className={`text-[13px] leading-5 ${notif.read ? "text-[#6B7280]" : "font-medium text-[#1D1D1D]"}`}
                            >
                              {notif.message}
                            </p>
                            <p className="mt-1 text-[11px] text-[#9CA3AF]">
                              {timeAgo(notif.createdAt)}
                            </p>
                          </div>
                          {!notif.read && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#356DFF]" />
                          )}
                          {notif.read && (
                            <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[#4E845F]" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User avatar */}
            <div ref={userRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setUserOpen((prev) => !prev);
                  setNotifOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-300 transition hover:opacity-80"
              >
                <span className="text-[13px] font-semibold text-white">
                  {displayInitial}
                </span>
              </button>

              {/* Desktop user dropdown */}
              {userOpen && (
                <div className="absolute right-0 top-[48px] z-50 hidden w-[210px] rounded-[18px] border border-[#EEF2F6] bg-white shadow-xl lg:block">
                  <div className="border-b border-[#F3F4F6] px-4 py-3">
                    <p className="text-[14px] font-semibold text-[#1D1D1D]">
                      {fullName}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#6B7280]">
                      {displayEmail}
                    </p>
                  </div>

                  <div className="py-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.href}
                          type="button"
                          onClick={() => {
                            router.push(item.href);
                            setUserOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#1D1D1D] transition hover:bg-[#F7F9FB]"
                        >
                          <Icon className="h-4 w-4 text-[#6B7280]" />
                          {item.label}
                        </button>
                      );
                    })}
                    <div className="my-1 h-px bg-[#F3F4F6]" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#EF4444] transition hover:bg-[#FEF2F2]"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile: Notifications full screen */}
      {notifOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
            <button
              type="button"
              onClick={() => setNotifOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F4F4F5]"
            >
              <X className="h-5 w-5 text-[#1D1D1D]" />
            </button>
            <p className="text-[16px] font-bold text-[#1D1D1D]">
              Notifications
            </p>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[13px] font-medium text-[#4E845F]"
              >
                Mark all as read
              </button>
            ) : (
              <div className="w-20" />
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Bell className="mb-3 h-10 w-10 text-[#D1D5DB]" />
                <p className="text-[14px] text-[#6B7280]">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  type="button"
                  onClick={() => handleNotificationClick(notif)}
                  className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-[#F7F9FB]"
                >
                  <NotificationIcon kind={notif.kind} />
                  <div className="flex-1">
                    <p
                      className={`text-[14px] leading-6 ${notif.read ? "text-[#6B7280]" : "font-medium text-[#1D1D1D]"}`}
                    >
                      {notif.message}
                    </p>
                    <p className="mt-1 text-[12px] text-[#9CA3AF]">
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#356DFF]" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mobile: Account full screen */}
      {userOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
            <button
              type="button"
              onClick={() => setUserOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F4F4F5]"
            >
              <X className="h-5 w-5 text-[#1D1D1D]" />
            </button>
            <p className="text-[16px] font-bold text-[#1D1D1D]">Account</p>
            <div className="w-9" />
          </div>

          <div className="px-5 py-6">
            <p className="text-[18px] font-bold text-[#1D1D1D]">{fullName}</p>
            <p className="mt-1 text-[14px] text-[#6B7280]">{displayEmail}</p>
          </div>

          <div className="h-px bg-[#F3F4F6]" />

          <div className="flex-1 py-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => {
                    router.push(item.href);
                    setUserOpen(false);
                  }}
                  className="flex w-full items-center gap-4 px-5 py-4 text-[16px] text-[#1D1D1D] transition hover:bg-[#F7F9FB]"
                >
                  <Icon className="h-5 w-5 text-[#6B7280]" />
                  {item.label}
                </button>
              );
            })}
            <div className="my-2 h-px bg-[#F3F4F6]" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-4 px-5 py-4 text-[16px] text-[#EF4444] transition hover:bg-[#FEF2F2]"
            >
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
