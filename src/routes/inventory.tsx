import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "../lib/store";
import { Search, Package, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "المخزون | Karam Group" }] }),
  component: Inventory,
});

function Inventory() {
  const products = useStore((s) => s.products);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = products.filter((p) => p.name.includes(query) || p.category.includes(query));

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">إدارة المخزون</h1>
          <p className="text-muted-foreground mt-1">{products.length} منتج • {products.reduce((a, p) => a + p.variants.length, 0)} متغير (SKU)</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full bg-card border border-border rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </header>

      <div className="space-y-3">
        {filtered.map((p) => {
          const totalStock = p.variants.reduce((a, v) => a + v.stock, 0);
          const lowCount = p.variants.filter((v) => v.stock <= 3).length;
          const isOpen = open === p.id;
          return (
            <div key={p.id} className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : p.id)} className="w-full p-4 flex items-center gap-4 hover:bg-muted/30 transition">
                <span className="text-4xl">{p.image}</span>
                <div className="flex-1 text-right">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.category} • {p.variants.length} مقاسات/ألوان</div>
                </div>
                <div className="text-left">
                  <div className="font-bold text-primary">{p.price} TL</div>
                  <div className={`text-xs mt-0.5 ${totalStock <= 5 ? "text-destructive" : "text-muted-foreground"}`}>
                    {totalStock} قطعة
                  </div>
                </div>
                {lowCount > 0 && (
                  <span className="bg-warning/15 text-warning-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> {lowCount}
                  </span>
                )}
              </button>
              {isOpen && (
                <div className="border-t border-border bg-muted/20 p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-right text-xs text-muted-foreground border-b border-border">
                          <th className="py-2 px-3">SKU</th>
                          <th className="py-2 px-3">المقاس</th>
                          <th className="py-2 px-3">اللون</th>
                          <th className="py-2 px-3">المخزون</th>
                          <th className="py-2 px-3">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {p.variants.map((v) => (
                          <tr key={v.id} className="border-b border-border/50 last:border-0">
                            <td className="py-2.5 px-3 font-mono text-xs">{v.sku}</td>
                            <td className="py-2.5 px-3">{v.size}</td>
                            <td className="py-2.5 px-3">{v.color}</td>
                            <td className="py-2.5 px-3 font-bold">{v.stock}</td>
                            <td className="py-2.5 px-3">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                v.stock === 0 ? "bg-destructive/10 text-destructive"
                                : v.stock <= 3 ? "bg-warning/15 text-warning-foreground"
                                : "bg-success/15 text-success"
                              }`}>
                                {v.stock === 0 ? "نفذ" : v.stock <= 3 ? "منخفض" : "متوفر"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
            لا توجد منتجات مطابقة
          </div>
        )}
      </div>
    </div>
  );
}
