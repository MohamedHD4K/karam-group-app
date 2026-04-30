// In-memory data store (MVP). Replace with Lovable Cloud later for persistence.
import { useSyncExternalStore } from "react";

export type Variant = {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  image: string;
  variants: Variant[];
};

export type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  qty: number;
  image: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  points: number;
  totalSpent: number;
  visits: number;
};

export type Sale = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  payment: "cash" | "card" | "wallet";
  customerId?: string;
};

type State = {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  cart: CartItem[];
};

const seedProducts: Product[] = [
  {
    id: "p1", name: "قميص كلاسيكي", category: "قمصان", price: 250, cost: 120,
    image: "👔",
    variants: [
      { id: "p1-s-w", size: "S", color: "أبيض", sku: "SH-CL-S-WH", stock: 12 },
      { id: "p1-m-w", size: "M", color: "أبيض", sku: "SH-CL-M-WH", stock: 8 },
      { id: "p1-l-w", size: "L", color: "أبيض", sku: "SH-CL-L-WH", stock: 3 },
      { id: "p1-m-b", size: "M", color: "أزرق", sku: "SH-CL-M-BL", stock: 15 },
      { id: "p1-l-b", size: "L", color: "أزرق", sku: "SH-CL-L-BL", stock: 2 },
    ],
  },
  {
    id: "p2", name: "بنطلون جينز", category: "بناطيل", price: 380, cost: 180,
    image: "👖",
    variants: [
      { id: "p2-30-b", size: "30", color: "أزرق غامق", sku: "PT-JN-30-DB", stock: 6 },
      { id: "p2-32-b", size: "32", color: "أزرق غامق", sku: "PT-JN-32-DB", stock: 10 },
      { id: "p2-34-b", size: "34", color: "أزرق غامق", sku: "PT-JN-34-DB", stock: 4 },
      { id: "p2-32-k", size: "32", color: "أسود", sku: "PT-JN-32-BK", stock: 1 },
    ],
  },
  {
    id: "p3", name: "فستان صيفي", category: "فساتين", price: 520, cost: 240,
    image: "👗",
    variants: [
      { id: "p3-s-r", size: "S", color: "أحمر", sku: "DR-SM-S-RD", stock: 5 },
      { id: "p3-m-r", size: "M", color: "أحمر", sku: "DR-SM-M-RD", stock: 7 },
      { id: "p3-m-p", size: "M", color: "وردي", sku: "DR-SM-M-PK", stock: 9 },
      { id: "p3-l-p", size: "L", color: "وردي", sku: "DR-SM-L-PK", stock: 2 },
    ],
  },
  {
    id: "p4", name: "جاكيت شتوي", category: "جواكيت", price: 890, cost: 420,
    image: "🧥",
    variants: [
      { id: "p4-m-k", size: "M", color: "أسود", sku: "JK-WN-M-BK", stock: 4 },
      { id: "p4-l-k", size: "L", color: "أسود", sku: "JK-WN-L-BK", stock: 6 },
      { id: "p4-l-g", size: "L", color: "رمادي", sku: "JK-WN-L-GR", stock: 3 },
    ],
  },
  {
    id: "p5", name: "تيشيرت قطني", category: "تيشيرتات", price: 145, cost: 60,
    image: "👕",
    variants: [
      { id: "p5-s-w", size: "S", color: "أبيض", sku: "TS-CT-S-WH", stock: 20 },
      { id: "p5-m-w", size: "M", color: "أبيض", sku: "TS-CT-M-WH", stock: 25 },
      { id: "p5-l-w", size: "L", color: "أبيض", sku: "TS-CT-L-WH", stock: 18 },
      { id: "p5-m-k", size: "M", color: "أسود", sku: "TS-CT-M-BK", stock: 14 },
      { id: "p5-xl-k", size: "XL", color: "أسود", sku: "TS-CT-XL-BK", stock: 9 },
    ],
  },
  {
    id: "p6", name: "حذاء رياضي", category: "أحذية", price: 650, cost: 310,
    image: "👟",
    variants: [
      { id: "p6-41-w", size: "41", color: "أبيض", sku: "SN-SP-41-WH", stock: 5 },
      { id: "p6-42-w", size: "42", color: "أبيض", sku: "SN-SP-42-WH", stock: 7 },
      { id: "p6-43-k", size: "43", color: "أسود", sku: "SN-SP-43-BK", stock: 4 },
    ],
  },
];

const seedCustomers: Customer[] = [
  { id: "c1", name: "سارة أحمد", phone: "0501234567", points: 240, totalSpent: 4800, visits: 12 },
  { id: "c2", name: "محمد علي", phone: "0509876543", points: 95, totalSpent: 1900, visits: 5 },
  { id: "c3", name: "نورة الخالد", phone: "0551112233", points: 410, totalSpent: 8200, visits: 19 },
  { id: "c4", name: "خالد العتيبي", phone: "0533334444", points: 60, totalSpent: 1200, visits: 3 },
];

const seedSales: Sale[] = (() => {
  // Deterministic seed to avoid SSR/CSR hydration mismatches
  const out: Sale[] = [];
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const rand = (n: number) => ((n * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const count = Math.floor(rand(i + 1) * 3) + 1;
    for (let j = 0; j < count; j++) {
      const total = Math.floor(rand((i + 1) * (j + 7)) * 800) + 150;
      const pIdx = Math.floor(rand((i + 3) * (j + 11)) * 3);
      out.push({
        id: `s-${i}-${j}`,
        date: d.toISOString(),
        items: [],
        total,
        payment: (["cash", "card", "wallet"] as const)[pIdx],
      });
    }
  }
  return out;
})();

let state: State = {
  products: seedProducts,
  customers: seedCustomers,
  sales: seedSales,
  cart: [],
};

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
const emit = () => { state = { ...state }; listeners.forEach((l) => l()); };

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

export const actions = {
  addToCart(product: Product, variant: Variant) {
    const existing = state.cart.find((c) => c.variantId === variant.id);
    if (existing) {
      existing.qty += 1;
      state.cart = [...state.cart];
    } else {
      state.cart = [...state.cart, {
        productId: product.id, variantId: variant.id, name: product.name,
        size: variant.size, color: variant.color, price: product.price,
        qty: 1, image: product.image,
      }];
    }
    emit();
  },
  updateQty(variantId: string, qty: number) {
    if (qty <= 0) {
      state.cart = state.cart.filter((c) => c.variantId !== variantId);
    } else {
      state.cart = state.cart.map((c) => c.variantId === variantId ? { ...c, qty } : c);
    }
    emit();
  },
  clearCart() { state.cart = []; emit(); },
  checkout(payment: "cash" | "card" | "wallet", customerId?: string) {
    const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
    const sale: Sale = {
      id: `s-${Date.now()}`, date: new Date().toISOString(),
      items: state.cart, total, payment, customerId,
    };
    // decrement stock
    state.products = state.products.map((p) => ({
      ...p,
      variants: p.variants.map((v) => {
        const inCart = state.cart.find((c) => c.variantId === v.id);
        return inCart ? { ...v, stock: Math.max(0, v.stock - inCart.qty) } : v;
      }),
    }));
    state.sales = [sale, ...state.sales];
    if (customerId) {
      state.customers = state.customers.map((c) => c.id === customerId
        ? { ...c, points: c.points + Math.floor(total / 20), totalSpent: c.totalSpent + total, visits: c.visits + 1 }
        : c);
    }
    state.cart = [];
    emit();
    return sale;
  },
  addCustomer(name: string, phone: string) {
    const c: Customer = { id: `c-${Date.now()}`, name, phone, points: 0, totalSpent: 0, visits: 0 };
    state.customers = [c, ...state.customers];
    emit();
    return c;
  },
  addProduct(p: Omit<Product, "id">) {
    state.products = [{ ...p, id: `p-${Date.now()}` }, ...state.products];
    emit();
  },
};
