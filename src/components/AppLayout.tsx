import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Settings, Sparkles, Tags } from "lucide-react";

const navItems = [
  { to: "/", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/pos", label: "نقطة البيع", icon: ShoppingCart },
  { to: "/inventory", label: "المخزون", icon: Package },
  { to: "/barcodes", label: "الباركود", icon: Tags },
  { to: "/reports", label: "التقارير", icon: BarChart3 },
] as const;

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground">
        <div className="px-6 py-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Karam Group</h1>
              <p className="text-xs text-sidebar-foreground/60">إدارة المتجر</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-elegant"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.to === "/pos" && 1 > 0 && (
                  <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {1}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent">
            <Settings className="h-4 w-4" />
            الإعدادات
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-sidebar text-sidebar-foreground border-t border-sidebar-border flex justify-around py-2">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] ${active ? "text-accent" : "text-sidebar-foreground/70"}`}>
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
