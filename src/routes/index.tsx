import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '../lib/store'
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'لوحة التحكم | Karam Group' },
      {
        name: 'description',
        content: 'نظرة عامة على مبيعات ومخزون متجر الملابس.',
      },
    ],
  }),
  component: Dashboard,
})

function Dashboard() {
  const products = useStore((s) => s.products)
  const sales = useStore((s) => s.sales)
  const customers = useStore((s) => s.customers)

  const today = new Date().toDateString()

  const todaySales = sales.filter(
    (s) => new Date(s.date).toDateString() === today,
  )

  const todayRevenue = todaySales.reduce((a, b) => a + b.total, 0)

  const totalRevenue = sales.reduce((a, b) => a + b.total, 0)

  const totalStock = products.reduce(
    (a, p) => a + p.variants.reduce((x, v) => x + v.stock, 0),
    0,
  )

  const lowStock = products.flatMap((p) =>
    p.variants.filter((v) => v.stock <= 3).map((v) => ({ p, v })),
  )

  const days = [
    'السبت',
    'الأحد',
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
  ]

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date()

    date.setDate(date.getDate() - (6 - i))

    const ds = date.toDateString()

    const total = sales
      .filter((s) => new Date(s.date).toDateString() === ds)
      .reduce((a, b) => a + b.total, 0)

    return {
      day: days[date.getDay()],
      total,
    }
  })

  const stats = [
    {
      label: 'مبيعات اليوم',
      value: `${todayRevenue} ₺`,
      icon: TrendingUp,
      change: '+12.5%',
      featured: true,
    },
    {
      label: 'إجمالي الإيرادات',
      value: `${totalRevenue} ₺`,
      icon: ShoppingBag,
      change: '+8.2%',
    },
    {
      label: 'العملاء',
      value: customers.length,
      icon: Users,
      change: '+3',
    },
    {
      label: 'قطع بالمخزون',
      value: totalStock,
      icon: Package,
      change: `${products.length} منتج`,
    },
  ]

  const recent = sales.slice(0, 6)

  return (
    <div dir="rtl" className="min-h-screen px-4 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              لوحة التحكم
            </h1>

            <p className="mt-2 text-muted-foreground">
              إليك ملخص أداء المتجر اليوم
            </p>
          </div>

          <button className="rounded-md dark:bg-[#212121] dark:text-[#c4c4c4] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground dar shadow-lg transition hover:opacity-90">
            + معاملة جديدة
          </button>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => {
          const Icon = s.icon

            return (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-md p-5 transition-all hover:-translate-y-1 ${
                  s.featured
                    ? 'dark:border-[#424242] dark:bg-black/40 bg-primary text-primary-foreground dar shadow-lg'
                    : 'border-border/60 bg-white dark:bg-[#212121] dar shadow-sm'
                }`}
              >
                {s.featured && (
                  <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                )}

                <div className="relative flex items-start justify-between">
                  <div
                    className={`rounded-md p-2.5 ${
                      s.featured
                        ? 'bg-white/20 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      s.featured
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    <ArrowUpRight size={12} />
                    {s.change}
                  </span>
                </div>

                <div className="relative dark:text-white mt-6 text-3xl font-bold tracking-tight">
                  {s.value}
                </div>

                <div
                  className={`relative mt-1 text-sm ${
                    s.featured
                      ? 'text-white/80'
                      : 'text-muted-foreground'
                  }`}
                >
                  {s.label}
                </div>
              </div>
            )
          })}
        </section>

        {/* Chart + Low stock */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Chart */}
          <div className="rounded-md border border-border/60 bg-white dark:bg-[#212121] p-6 dar shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  نظرة على آخر 7 أيام
                </h2>

                <p className="text-sm text-muted-foreground">
                  إيرادات يومية بالليرة
                </p>
              </div>

              <div className="text-2xl font-bold text-primary ;">
                {chartData.reduce((a, b) => a + b.total, 0)} ₺
              </div>
            </div>

            <div className="h-64 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 8,
                    left: 8,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={localStorage.getItem('theme') === 'dark' ? `#fff` : `hsl(var(--primary))`}
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="100%"
                        stopColor={localStorage.getItem('theme') === 'dark' ? `hsl(var(--primary))` : `hsl(var(--primary))`}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                      fill: localStorage.getItem('theme') === 'dark' ? `#fff` : `hsl(var(--muted-foreground))`,
                    }}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={40}
                    tick={{
                      fontSize: 12,
                      fill: localStorage.getItem('theme') === 'dark' ? `#fff` : `hsl(var(--muted-foreground))`,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid hsl(var(--border))',
                      background: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))',
                      fontSize: 12,
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#rev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low stock */}
          <div className="rounded-md border border-border/60 overflow-auto max-h-96 bg-white dark:bg-[#212121] p-6 dar shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-yellow-500/10 p-2">
                  <AlertTriangle
                    size={18}
                    className="text-warning "
                  />
                </div>

                <h2 className="text-lg font-bold">
                  تنبيهات المخزون
                </h2>
              </div>

              <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                {lowStock.length}
              </span>
            </div>

            {lowStock.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <CheckCircle2
                  className="text-emerald-600 dark:text-emerald-400"
                  size={36}
                />

                <p className="text-sm text-muted-foreground">
                  المخزون بحالة جيدة 🎉
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {lowStock.slice(0, 5).map(({ p, v }, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-md border border-border/50 bg-muted/50 p-3 transition hover:bg-muted"
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-lg bg-background text-2xl">
                      {p.image}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {p.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {v.size} • {v.color}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        v.stock === 0
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                          : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                      }`}
                    >
                      {v.stock} متبقي
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Recent transactions */}
        <section className="rounded-md border border-border/60 bg-white dark:bg-[#212121] p-6  shadow-sm">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold">
                آخر المعاملات
              </h2>

              <p className="text-sm text-muted-foreground">
                ملخص أداء المتجر لآخر أسبوع
              </p>
            </div>

            <button className="text-sm font-semibold text-primary transition hover:opacity-80">
              عرض الكل ←
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs uppercase text-muted-foreground">
                  <th className="pb-3 font-medium">رقم الطلب</th>
                  <th className="pb-3 font-medium">اسم العميل</th>
                  <th className="pb-3 font-medium">القطع</th>
                  <th className="pb-3 font-medium">المجموع</th>
                  <th className="pb-3 font-medium">الحالة</th>
                </tr>
              </thead>

              <tbody>
                {recent.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-border/30 transition hover:bg-muted/40 last:border-0"
                  >
                    <td className="py-4 font-mono text-xs font-semibold text-primary">
                      #{d.id}
                    </td>

                    <td className="py-4 font-medium">
                      {d.customerName || 'عميل مجهول'}
                    </td>

                    <td className="py-4 text-muted-foreground">
                      {0} قطعة
                    </td>

                    <td className="py-4 font-bold">
                      {d.total} ₺
                    </td>

                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={12} />
                        مكتمل
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}