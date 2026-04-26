"use client";

import { useState, useEffect, useMemo } from "react";
import ProductCard from "./components/productCard";
import { Product } from "./product";
import { ShoppingCart, X, Trash2, Search, LayoutGrid, List } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter/Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  // NEW: Display Mode State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 1. Dual API Fetching & Mapping
  useEffect(() => {
    async function loadData() {
      try {
        const [res1, res2] = await Promise.all([
          fetch("https://dummyjson.com/products"),
          fetch("https://fakestoreapi.com/products")
        ]);

        const data1 = await res1.json();
        const data2 = await res2.json();

        const mapped1: Product[] = data1.products.map((item: any) => ({
          id: `dj-${item.id}`,
          name: item.title,
          price: item.price,
          category: item.category,
          image: item.thumbnail,
          description: item.description,
          rating: item.rating
        }));

        const mapped2: Product[] = data2.map((item: any) => ({
          id: `fs-${item.id}`,
          name: item.title,
          price: item.price,
          category: item.category,
          image: item.image,
          description: item.description,
          rating: item.rating?.rate || 4
        }));

        setProducts([...mapped1, ...mapped2]);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    }
    loadData();
  }, []);

  // 2. Search, Filter, & Sort Combined Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (category !== "All") {
      result = result.filter(p => p.category === category);
    }

    if (sortOrder === "low") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "high") result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, searchQuery, category, sortOrder]);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter text-gray-900">E-<span className="text-blue-600">Commerce</span></h1>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-2 border focus-within:border-blue-400 focus-within:bg-white transition-all">
              <Search size={16} className="text-gray-900" />
              <input
                placeholder="Search..."
                className="bg-transparent border-none outline-none px-2 text-sm w-48 text-gray-600"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-blue-50  rounded-full text-gray-700 transition-colors">
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-gray-100 text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-700">Checkout Summary</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"><X size={24} /></button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? <p className="text-center text-gray-700 py-10">Cart is empty</p> :
                cartItems.map((item, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-xl border text-gray-700">
                    <img src={item.image} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-grow"><p className="font-bold text-sm line-clamp-1">{item.name}</p><p className="text-blue-600 font-bold">${item.price}</p></div>
                    <button onClick={() => setCartItems(prev => prev.filter((_, idx) => idx !== i))} className="text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                ))
              }
            </div>
            {cartItems.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-6"><span className="text-gray-500 font-medium text-gray-700">Grand Total</span><span className="text-2xl font-black text-gray-700">${totalPrice.toFixed(2)}</span></div>
                <button className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-200">Pay Now</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Collections</h2>
            <p className="text-gray-500">Showing {filteredProducts.length} items</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* NEW: View Switcher */}
            <div className="flex bg-white border rounded-xl p-1 shadow-sm mr-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <List size={18} />
              </button>
            </div>

            <select onChange={(e) => setCategory(e.target.value)} className="bg-white border px-4 py-2.5 rounded-xl text-sm font-medium outline-none cursor-pointer text-gray-700 shadow-sm flex-grow md:flex-grow-0">
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>

            <select onChange={(e) => setSortOrder(e.target.value)} className="bg-white border px-4 py-2.5 rounded-xl text-sm font-medium outline-none cursor-pointer text-gray-700 shadow-sm flex-grow md:flex-grow-0">
              <option value="default">Default</option>
              <option value="low">Price: Low</option>
              <option value="high">Price: High</option>
            </select>
          </div>
        </div>

        {/* PRODUCT DISPLAY (GRID OR LIST) */}
        <div className={
          viewMode === "grid"
            // Optimized Grid: 1 col on mobile, 2 on small tablets, 3 on tablets, 4 on desktop
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            // Optimized List: full width but with a max-width for better readability on huge screens
            : "flex flex-col gap-4 max-w-5xl mx-auto w-full"
        }>
          {filteredProducts.map(p => (
            <div
              key={p.id}
              onClick={() => setCartItems(prev => [...prev, p])}
              className="cursor-pointer transition-all active:scale-[0.98]"
            >
              <ProductCard product={p} viewMode={viewMode} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-3xl">
            No products found matching your search.
          </div>
        )}
      </main>
    </div>
  );
}