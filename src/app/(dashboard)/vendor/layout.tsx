"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  CalendarCheck,
  Car,
  Map,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { VendorProtectedRoute } from "@/components/vendor/vendor-protected-route";

const navItems = [
  { href: "/vendor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendor/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/vendor/vehicles", label: "Fleet", icon: Car },
  { href: "/vendor/routes", label: "Routes", icon: Map },
];

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, session, loading } = useAuth();
  const [vendorLogo, setVendorLogo] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchVendorLogo = async () => {
      if (!user || !session) return;

      // Don't fetch if user is admin
      const role = user.user_metadata?.role;
      if (role === "admin") return;

      try {
        const res = await fetch("/api/vendor/profile", {
          headers: {
            ...(session?.access_token
              ? { Authorization: `Bearer ${session.access_token}` }
              : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.logo) {
            setVendorLogo(data.logo);
          }
        }
      } catch (error) {
        // Ignore errors
      }
    };

    if (user) {
      fetchVendorLogo();
    }
  }, [user, session]);

  // Get current nav item label for mobile header
  const currentItem = navItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/vendor" && pathname.startsWith(item.href))
  );

  // Close mobile menu when pathname changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <VendorProtectedRoute>
      <div className="flex bg-slate-50 mt-16 flex-col md:flex-row md:h-[calc(100vh-64px)] md:overflow-hidden">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-black px-4 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="RentNow"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold tracking-tight text-white">
              RentNow
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {currentItem && (
              <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {currentItem.label}
              </span>
            )}
            <button
              type="button"
              className="rounded-md p-2 text-white hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </header>

        {/* Mobile Drawer Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 top-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Drawer / Desktop Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 top-0 z-[70] w-full transform bg-white transition-transform duration-300 ease-in-out md:static md:z-30 md:flex md:w-60 md:translate-x-0 md:flex-col md:border-r md:bg-white md:shadow-sm md:px-4 md:py-6",
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          )}
        >
          {/* Mobile Drawer Header Section */}
          <div className="flex h-20 items-center justify-between bg-black px-6 md:hidden">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src="/logo.svg"
                alt="RentNow"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold tracking-tight text-white font-oranienbaum">
                RentNow
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-full p-2 text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col h-full overflow-y-auto px-6 py-4 md:p-0">
            <div className="mb-8 flex items-center gap-3 px-2 md:mt-0 mt-4">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white overflow-hidden shadow-sm">
                {vendorLogo ? (
                  <Image
                    src={vendorLogo}
                    alt="Vendor logo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  user?.email?.charAt(0).toUpperCase() ?? "V"
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Vendor Admin</span>
                <span className="text-[11px] text-muted-foreground">
                  {user?.email ?? "Your vendor account"}
                </span>
              </div>
            </div>

            <nav className="flex-1 space-y-0.5 text-base md:text-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/vendor" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between group rounded-lg px-3 py-4 md:py-2.5 transition-all md:hover:bg-slate-50 border-b border-slate-100 md:border-none",
                      isActive
                        ? "bg-primary/20 text-primary md:bg-primary/20"
                        : "text-slate-600 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-5 w-5 md:h-4 md:w-4",
                          isActive && "text-primary"
                        )}
                      />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 md:hidden",
                        isActive && "text-primary/60"
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Settings and Logout at bottom */}
            <div className="mt-auto space-y-0.5 border-t pt-4">
              <Link
                href="/vendor/settings"
                className={cn(
                  "flex items-center justify-between group rounded-lg px-3 py-4 md:py-2.5 md:text-sm transition-all md:hover:bg-slate-50 border-b border-slate-100 md:border-none",
                  pathname === "/vendor/settings"
                    ? "bg-primary/20 text-primary"
                    : "text-slate-600 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Settings
                    className={cn(
                      "h-5 w-5 md:h-4 md:w-4",
                      pathname === "/vendor/settings" && "text-primary"
                    )}
                  />
                  <span className="font-medium">Settings</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 md:hidden" />
              </Link>
              <button
                type="button"
                className="flex w-full items-center justify-between group rounded-lg px-3 py-4 md:py-2.5 md:text-sm text-slate-600 transition-all md:hover:bg-slate-50 border-b border-slate-100 md:border-none"
                onClick={handleLogout}
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 md:h-4 md:w-4" />
                  <span className="font-medium">Logout</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 md:hidden" />
              </button>
            </div>

            <div className="mt-8 hidden text-[11px] text-muted-foreground md:block">
              <p className="px-2">
                Need help?{" "}
                <Link
                  href="/contact"
                  className="font-medium text-primary hover:underline"
                >
                  Contact support
                </Link>
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 mt-14 md:mt-0 md:overflow-y-auto">
          {children}
        </main>
      </div>
    </VendorProtectedRoute>
  );
}
