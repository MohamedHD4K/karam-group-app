import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "../lib/store";
import { TrendingUp, Trophy } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "التقارير | Karam Group" }] }),
  component: Reports,
});

function Reports() {
  const sales = useStore((s) => s.sales);
  const products = useStore((s) => s.products);

  const totalRevenue = sales.reduce((a, b) => a + b.total, 0);
  const avgSale = sales.length ? totalRevenue / sales.length : 0;

  const byPayment = sales.reduce((acc, s) => {
    acc[s.payment] = (acc[s.payment] || 0) + s.total;
    return acc;
  }, {} as Record<string, number>);

  const paymentlabels: Record<string, string> = { cash: "نقدي", card: "بطاقة", wallet: "محفظة" };

  // Top categories by stock value
  const topProducts = [...products]
    .sort((a, b) => b.variants.reduce((x, v) => x + v.stock, 0) - a.variants.reduce((x, v) => x + v.stock, 0))
    .slice(0, 5);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">التقارير والتحليلات</h1>
        <p className="text-muted-foreground mt-1">رؤى ذكية لأداء متجرك</p>
      </header>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="gradient-primary text-primary-foreground rounded-md p-5 shadow-elegant">
          <div className="text-sm opacity-90">إجمالي المبيعات</div>
          <div className="text-3xl font-bold mt-2">{totalRevenue.toLocaleString("ar-EG")} tl</div>
          <div className="text-xs opacity-80 mt-1">{sales.length} عملية بيع</div>
        </div>
        <div className="bg-card border border-border rounded-md p-5 shadow-soft">
          <div className="text-sm text-muted-foreground">متوسط الفاتورة</div>
          <div className="text-3xl font-bold mt-2 text-foreground">{avgSale.toFixed(0)} tl</div>
          <div className="text-xs text-success mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> متوسط جيد</div>
        </div>
        <div className="bg-card border border-border rounded-md p-5 shadow-soft">
          <div className="text-sm text-muted-foreground">عدد المنتجات النشطة</div>
          <div className="text-3xl font-bold mt-2 text-foreground">{products.length}</div>
          <div className="text-xs text-muted-foreground mt-1">{products.reduce((a, p) => a + p.variants.length, 0)} متغير</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-md p-6 shadow-soft">
          <h2 className="font-bold text-lg mb-4">طرق الدفع</h2>
          <div className="space-y-3">
            {Object.entries(byPayment).map(([k, v]) => {
              const pct = (v / totalRevenue) * 100;
              return (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{paymentlabels[k]}</span>
                    <span className="text-muted-foreground">{v.toLocaleString("ar-EG")} tl ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-md p-6 shadow-soft">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" /> أعلى المنتجات (بالمخزون)
          </h2>
          <ul className="space-y-3">
            {topProducts.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </div>
                <span className="text-2xl">{p.image}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.category}</div>
                </div>
                <div className="text-sm font-bold text-primary">
                  {p.variants.reduce((a, v) => a + v.stock, 0)} قطعة
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
