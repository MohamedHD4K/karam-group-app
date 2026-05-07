import { Link, Outlet, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  Tags,
} from 'lucide-react'
import Header from './Header'

const navItems = [
  { to: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
  { to: '/pos', label: 'نقطة البيع', icon: ShoppingCart },
  { to: '/inventory', label: 'المخزن', icon: Package },
  { to: '/barcodes', label: 'الباركود', icon: Tags },
  { to: '/customers', label: 'العملاء', icon: Users },
] as const

export function AppLayout() {
  const location = useLocation()

  return (
    <div className="flex bg-background dark:bg-background transition-colors">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col h-screen top-0 sticky z-50 bg-white dark:bg-[#212121] border-l border-gray-200 dark:border-[#424242] ">
        {/* Logo Section */}
        <div className="px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-900 dark:bg-indigo-600 flex items-center justify-center shadow-sm">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Karam Group
              </h1>
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                متجر ملابس
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-4 px-6 py-4 text-sm font-medium transition-all relative ${
                  active
                    ? 'bg-slate-100/80 dark:bg-[#303030]/80 text-primary'
                    : 'text-slate-500 dark:text-[#c4c4c4]/90 hover:bg-slate-50 dark:hover:bg-[#303030]/50 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
                )}

                <span className="flex-1 text-right order-1">{item.label}</span>
                <Icon
                  className={`h-6 w-6 order-2 transition-colors ${
                    active ? 'text-primary' : ''
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-50 dark:border-[#424242]">
          <button
            className="w-full flex items-center justify-end gap-4 px-6 py-4 text-slate-500 dark:text-[#c4c4c4]/90 hover:bg-slate-50 dark:hover:bg-[#303030]/50
           hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors"
          >
            <span className="text-sm font-medium">الإعدادات</span>
            <Settings className="h-6 w-6" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        <Header />
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
