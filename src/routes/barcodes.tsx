import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore, type Variant } from "../lib/store";
import { Barcode } from "../components/Barcode";
import { Printer, Search, Plus, Minus, Trash2, Tags } from "lucide-react";

export const Route = createFileRoute("/barcodes")({
  head: () => ({
    meta: [
      { title: "الباركود واللواصق | Karam Group" },
      { name: "description", content: "توليد وطباعة لواصق الباركود لكل SKU عند استلام البضاعة." },
    ],
  }),
  component: Barcodes,
});

type Row = {
  productId: string;
  variantId: string;
  productName: string;
  price: number;
  variant: Variant;
  qty: number;
};

function Barcodes() {
  const products = useStore((s) => s.products);
  const [query, setQuery] = useState("");
  const [queue, setQueue] = useState<Record<string, Row>>({});
  const [labelSize, setLabelSize] = useState<"sm" | "md" | "lg">("md");

  const allRows = useMemo<Row[]>(
    () =>
      products.flatMap((p) =>
        p.variants.map((v) => ({
          productId: p.id,
          variantId: v.id,
          productName: p.name,
          price: p.price,
          variant: v,
          qty: 0,
        })),
      ),
    [products],
  );

  const filtered = allRows.filter((r) => {
    const q = query.trim();
    if (!q) return true;
    return (
      r.productName.includes(q) ||
      r.variant.sku.toLowerCase().includes(q.toLowerCase()) ||
      r.variant.color.includes(q) ||
      r.variant.size.includes(q)
    );
  });

  const queueList = Object.values(queue);
  const totalLabels = queueList.reduce((a, r) => a + r.qty, 0);

  const setQty = (row: Row, qty: number) => {
    setQueue((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[row.variantId];
      else next[row.variantId] = { ...row, qty };
      return next;
    });
  };
  const inc = (row: Row) => setQty(row, (queue[row.variantId]?.qty ?? 0) + 1);
  const dec = (row: Row) => setQty(row, (queue[row.variantId]?.qty ?? 0) - 1);
  const fillFromStock = () => {
    const next: Record<string, Row> = {};
    allRows.forEach((r) => {
      if (r.variant.stock > 0) next[r.variantId] = { ...r, qty: r.variant.stock };
    });
    setQueue(next);
  };

  const handlePrint = () => window.print();

  const sizeMap = {
    sm: { w: 1.2, h: 38, font: 10, pad: "p-2", text: "text-[10px]" },
    md: { w: 1.6, h: 50, font: 12, pad: "p-3", text: "text-xs" },
    lg: { w: 2.0, h: 64, font: 14, pad: "p-4", text: "text-sm" },
  } as const;
  const cfg = sizeMap[labelSize];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Print styles: only labels appear in print */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area { position: absolute; inset: 0; padding: 8mm; }
          .no-print { display: none !important; }
          @page { margin: 8mm; }
        }
      `}</style>

      <header className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Tags className="h-7 w-7 text-primary" /> الباركود واللواصق
          </h1>
          <p className="text-muted-foreground mt-1">
            وَلِّد لواصق باركود لكل SKU، حدّد الكميات المطلوبة عند استلام البضاعة، ثم اطبع.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={labelSize}
            onChange={(e) => setLabelSize(e.target.value as "sm" | "md" | "lg")}
            className="bg-card border border-border rounded-xl px-3 py-2 text-sm"
          >
            <option value="sm">لاصقة صغيرة</option>
            <option value="md">لاصقة متوسطة</option>
            <option value="lg">لاصقة كبيرة</option>
          </select>
          <button
            onClick={handlePrint}
            disabled={totalLabels === 0}
            className="gradient-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2 shadow-elegant disabled:opacity-50"
          >
            <Printer className="h-4 w-4" /> طباعة ({totalLabels})
          </button>
        </div>
      </header>

      <div className="no-print grid lg:grid-cols-5 gap-6 mb-8">
        {/* SKU picker */}
        <section className="lg:col-span-3 bg-card border border-border rounded-2xl shadow-soft p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالاسم أو SKU أو اللون..."
                className="w-full bg-background border border-border rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={fillFromStock}
              className="text-xs px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90"
            >
              تعبئة من المخزون
            </button>
          </div>

          <div className="max-h-[480px] overflow-auto divide-y divide-border overflow-hidden">
            {filtered.map((r) => {
              const inQ = queue[r.variantId]?.qty ?? 0;
              return (
                <div key={r.variantId} className="flex items-center gap-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{r.productName}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {r.variant.sku} • {r.variant.size} • {r.variant.color} • مخزون {r.variant.stock}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => dec(r)}
                      className="h-7 w-7 rounded-lg bg-muted hover:bg-muted/70 flex items-center justify-center"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={inQ}
                      onChange={(e) => setQty(r, Math.max(0, parseInt(e.target.value || "0", 10)))}
                      className="w-14 text-center text-sm bg-background border border-border rounded-lg py-1"
                    />
                    <button
                      onClick={() => inc(r)}
                      className="h-7 w-7 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-10">لا توجد نتائج</div>
            )}
          </div>
        </section>

        {/* Queue summary */}
        <aside className="lg:col-span-2 bg-card border border-border rounded-2xl shadow-soft p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">قائمة الطباعة</h2>
            <button
              onClick={() => setQueue({})}
              className="text-xs text-destructive hover:underline flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" /> تفريغ
            </button>
          </div>
          {queueList.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              لم تُضِف أي SKU بعد. اختر من القائمة لتظهر هنا.
            </p>
          ) : (
            <ul className="space-y-2 max-h-[440px] overflow-auto">
              {queueList.map((r) => (
                <li
                  key={r.variantId}
                  className="flex items-center justify-between gap-2 bg-muted/40 rounded-lg px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="text-sm truncate">{r.productName}</div>
                    <div className="text-[11px] text-muted-foreground font-mono truncate">
                      {r.variant.sku}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary shrink-0">×{r.qty}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-sm">
            <span className="text-muted-foreground">إجمالي اللواصق</span>
            <span className="font-bold text-lg">{totalLabels}</span>
          </div>
        </aside>
      </div>

      {/* Preview / Print area */}
      <section>
        <h2 className="no-print text-lg font-semibold mb-3">معاينة اللواصق</h2>
        <div
          id="print-area"
          className="bg-white text-black rounded-2xl border border-border p-4 flex flex-wrap gap-2"
        >
          {queueList.length === 0 ? (
            <p className="no-print w-full text-center text-sm text-muted-foreground py-12">
              لا توجد لواصق للعرض. أضف SKU إلى قائمة الطباعة لرؤية المعاينة.
            </p>
          ) : (
            queueList.flatMap((r) =>
              Array.from({ length: r.qty }).map((_, i) => (
                <div
                  key={`${r.variantId}-${i}`}
                  className={`border border-black/20 rounded-md ${cfg.pad} ${cfg.text} flex flex-col items-center text-center bg-white`}
                  style={{ minWidth: 180 }}
                >
                  <div className="font-semibold leading-tight truncate w-full" dir="rtl">
                    {r.productName}
                  </div>
                  <div className="opacity-70 leading-tight" dir="rtl">
                    {r.variant.size} • {r.variant.color}
                  </div>
                  <Barcode value={r.variant.sku} width={cfg.w} height={cfg.h} fontSize={cfg.font} />
                  <div className="font-bold">{r.price} TL</div>
                </div>
              )),
            )
          )}
        </div>
      </section>
    </div>
  );
}
