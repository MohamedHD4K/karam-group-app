import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore, actions, type Product, type Variant } from "../lib/store";
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Wallet, Banknote, Check } from "lucide-react";

export const Route = createFileRoute("/pos")({
  head: () => ({ meta: [{ title: "نقطة البيع | Karam Group" }] }),
  component: POS,
});

function POS() {
  const products = useStore((s) => s.products);
  const cart = useStore((s) => s.cart);
  const customers = useStore((s) => s.customers);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [customerId, setCustomerId] = useState<string>("");
  const [done, setDone] = useState(false);

  const filtered = useMemo(
    () => products.filter((p) => p.name.includes(query) || p.category.includes(query)),
    [products, query]
  );

  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const checkout = (payment: "cash" | "card" | "wallet") => {
    if (cart.length === 0) return;
    actions.checkout(payment, customerId || undefined);
    setCustomerId("");
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_400px] h-screen">
      {/* Products */}
      <div className="p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">نقطة البيع</h1>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن منتج أو SKU..."
              className="w-full bg-card border border-border rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="bg-card border border-border rounded-2xl p-4 text-right hover:border-primary hover:shadow-elegant transition-all group"
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{p.image}</div>
              <div className="text-xs text-muted-foreground mb-1">{p.category}</div>
              <div className="font-semibold text-sm mb-2 line-clamp-1">{p.name}</div>
              <div className="text-primary font-bold">{p.price} TL</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="bg-card border-r border-border flex flex-col h-screen">
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> السلة
            </h2>
            {cart.length > 0 && (
              <button onClick={() => actions.clearCart()} className="text-xs text-destructive hover:underline">
                إفراغ
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">السلة فارغة</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.variantId} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                <span className="text-3xl">{item.image}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.size} • {item.color}</div>
                  <div className="text-sm font-bold text-primary mt-0.5">{item.price * item.qty} TL</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => actions.updateQty(item.variantId, item.qty - 1)} className="h-7 w-7 rounded-lg bg-background border border-border hover:bg-muted flex items-center justify-center">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                  <button onClick={() => actions.updateQty(item.variantId, item.qty + 1)} className="h-7 w-7 rounded-lg bg-background border border-border hover:bg-muted flex items-center justify-center">
                    <Plus className="h-3 w-3" />
                  </button>
                  <button onClick={() => actions.updateQty(item.variantId, 0)} className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10 flex items-center justify-center">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-border p-5 space-y-4">
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm"
            >
              <option value="">عميل عابر (بدون نقاط)</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
            </select>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>المجموع الفرعي</span><span>{subtotal.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>ضريبة (15%)</span><span>{tax.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>الإجمالي</span><span className="text-primary">{total.toFixed(2)} TL</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => checkout("cash")} className="flex flex-col items-center gap-1 py-3 rounded-xl bg-success text-success-foreground font-medium hover:opacity-90 transition">
                <Banknote className="h-4 w-4" /> <span className="text-xs">نقدي</span>
              </button>
              <button onClick={() => checkout("card")} className="flex flex-col items-center gap-1 py-3 rounded-xl gradient-primary text-primary-foreground font-medium hover:opacity-90 transition">
                <CreditCard className="h-4 w-4" /> <span className="text-xs">بطاقة</span>
              </button>
              <button onClick={() => checkout("wallet")} className="flex flex-col items-center gap-1 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:opacity-90 transition">
                <Wallet className="h-4 w-4" /> <span className="text-xs">محفظة</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Variant picker modal */}
      {selected && (
        <VariantPicker product={selected} onClose={() => setSelected(null)} />
      )}

      {/* Success toast */}
      {done && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-success text-success-foreground px-6 py-3 rounded-2xl shadow-elegant flex items-center gap-2 animate-in fade-in slide-in-from-bottom z-50">
          <Check className="h-5 w-5" /> تمت العملية بنجاح
        </div>
      )}
    </div>
  );
}

function VariantPicker({ product, onClose }: { product: Product; onClose: () => void }) {
  const add = (v: Variant) => {
    if (v.stock <= 0) return;
    actions.addToCart(product, v);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-card rounded-3xl p-6 w-full max-w-lg shadow-elegant">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-5xl">{product.image}</span>
          <div>
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-primary font-bold">{product.price} TL</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">اختر المقاس واللون:</p>
        <div className="grid grid-cols-2 gap-2 max-h-80 overflow-auto">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => add(v)}
              disabled={v.stock <= 0}
              className={`p-3 rounded-xl border text-right transition ${v.stock <= 0 ? "border-border bg-muted opacity-50 cursor-not-allowed" : "border-border hover:border-primary hover:shadow-soft"}`}
            >
              <div className="font-medium text-sm">{v.size} • {v.color}</div>
              <div className="text-xs text-muted-foreground mt-1">{v.sku}</div>
              <div className={`text-xs font-bold mt-1 ${v.stock === 0 ? "text-destructive" : v.stock <= 3 ? "text-warning-foreground" : "text-success"}`}>
                {v.stock === 0 ? "نفذ" : `${v.stock} متاح`}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
