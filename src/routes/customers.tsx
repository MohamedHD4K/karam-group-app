import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, actions } from "../lib/store";
import { UserPlus, Phone, Award, ShoppingBag, X } from "lucide-react";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [{ title: "العملاء | Karam Group" }] }),
  component: Customers,
});

function Customers() {
  const customers = useStore((s) => s.customers);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!name || !phone) return;
    actions.addCustomer(name, phone);
    setName(""); setPhone(""); setAdding(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">العملاء</h1>
          <p className="text-muted-foreground mt-1">{customers.length} عميل في برنامج الولاء</p>
        </div>
        <button onClick={() => setAdding(true)} className="gradient-primary text-primary-foreground px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-elegant hover:opacity-90 transition">
          <UserPlus className="h-4 w-4" /> إضافة عميل
        </button>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-elegant transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {c.phone}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-accent/10 rounded-xl py-2">
                <Award className="h-4 w-4 mx-auto text-accent mb-1" />
                <div className="text-sm font-bold">{c.points}</div>
                <div className="text-[10px] text-muted-foreground">نقطة</div>
              </div>
              <div className="bg-primary/5 rounded-xl py-2">
                <ShoppingBag className="h-4 w-4 mx-auto text-primary mb-1" />
                <div className="text-sm font-bold">{c.visits}</div>
                <div className="text-[10px] text-muted-foreground">زيارة</div>
              </div>
              <div className="bg-success/10 rounded-xl py-2">
                <div className="text-xs font-bold text-success mt-1">{c.totalSpent.toLocaleString("ar-EG")}</div>
                <div className="text-[10px] text-muted-foreground">إجمالي TL</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <div onClick={() => setAdding(false)} className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-card rounded-3xl p-6 w-full max-w-md shadow-elegant">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">عميل جديد</h3>
              <button onClick={() => setAdding(false)} className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الجوال" className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary" />
              <button onClick={submit} className="w-full gradient-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90">
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
