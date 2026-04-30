import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "../lib/store";
import { TrendingUp, ShoppingBag, Users, Package, ArrowUpRight, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم | Karam Group" },
      { name: "description", content: "نظرة عامة على مبيعات ومخزون متجر الملابس." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const products = useStore((s) => s.products);
  const sales = useStore((s) => s.sales);
  const customers = useStore((s) => s.customers);

  const today = new Date().toDateString();
  const todaySales = sales.filter((s) => new Date(s.date).toDateString() === today);
  const todayRevenue = todaySales.reduce((a, b) => a + b.total, 0);
  const totalRevenue = sales.reduce((a, b) => a + b.total, 0);
  const totalStock = products.reduce((a, p) => a + p.variants.reduce((x, v) => x + v.stock, 0), 0);
  const lowStock = products.flatMap((p) => p.variants.filter((v) => v.stock <= 3).map((v) => ({ p, v })));

  const stats = [
    { label: "مبيعات اليوم", value: `${todayRevenue} TL`, icon: TrendingUp, change: "+12.5%", gradient: true },
    { label: "إجمالي الإيرادات", value: `${totalRevenue} TL`, icon: ShoppingBag, change: "+8.2%" },
    { label: "العملاء", value: customers.length, icon: Users, change: "+3" },
    { label: "قطع بالمخزون", value: totalStock, icon: Package, change: `${products.length} منتج` },
  ];

  // Last 7 days chart data
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const day = d.toDateString();
    const total = sales.filter((s) => new Date(s.date).toDateString() === day).reduce((a, b) => a + b.total, 0);
    return { label: d.toLocaleDateString("ar-EG", { weekday: "short" }), total };
  });
  const maxDay = Math.max(...days.map((d) => d.total), 1);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Karam Group</h1>
        <p className="text-muted-foreground mt-1">ملخص أداء متجرك اليوم</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className={`rounded-2xl p-5 ${s.gradient ? "gradient-primary text-primary-foreground shadow-elegant" : "bg-card border border-border shadow-soft"}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.gradient ? "bg-white/20" : "bg-primary/10"}`}>
                <s.icon className={`h-5 w-5 ${s.gradient ? "text-white" : "text-primary"}`} />
              </div>
              <span className={`text-xs font-medium flex items-center gap-1 ${s.gradient ? "text-white/90" : "text-success"}`}>
                <ArrowUpRight className="h-3 w-3" /> {s.change}
              </span>
            </div>
            <div className={`text-2xl font-bold ${s.gradient ? "" : "text-foreground"}`}>{s.value}</div>
            <div className={`text-xs mt-1 ${s.gradient ? "text-white/80" : "text-muted-foreground"}`}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">المبيعات خلال 7 أيام</h2>
            <span className="text-xs text-muted-foreground">آخر أسبوع</span>
          </div>
          <div className="flex items-end justify-between gap-3 h-48">
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-lg gradient-primary transition-all hover:opacity-80"
                    style={{ height: `${(d.total / maxDay) * 100}%`, minHeight: "4px" }}
                    title={`${d.total} TL`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">تنبيهات المخزون</h2>
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">المخزون بحالة جيدة 🎉</p>
          ) : (
            <ul className="space-y-3">
              {lowStock.slice(0, 5).map(({ p, v }) => (
                <li key={v.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                  <span className="text-2xl">{p.image}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{v.size} • {v.color}</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${v.stock === 0 ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning-foreground"}`}>
                    {v.stock} متبقي
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
