"use client";

import { useState, useEffect, useMemo } from "react";
import ProductCard from "./components/productCard";
import { Product } from "./product";
import { ShoppingCart, X, Trash2, Search, LayoutGrid, List, Heart, Star } from "lucide-react";

// Types to fix 'any' errors
interface DummyJSONResponse {
  products: Array<{
    id: number; title: string; price: number; category: string;
    thumbnail: string; description: string; rating: number;
  }>;
}

interface FakeStoreResponse {
  id: number; title: string; price: number; category: string;
  image: string; description: string; rating?: { rate: number };
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false); // Dropdown State

  // New States
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [itemsToShow, setItemsToShow] = useState(8);

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    async function loadData() {
      try {
        const [res1, res2] = await Promise.all([
          fetch("https://dummyjson.com/products"),
          fetch("https://fakestoreapi.com/products")
        ]);
        const data1: DummyJSONResponse = await res1.json();
        const data2: FakeStoreResponse[] = await res2.json();

        const m1: Product[] = data1.products.map((i) => ({
          id: `dj-${i.id}`, name: i.title, price: i.price, category: i.category,
          image: i.thumbnail, description: i.description, rating: i.rating
        }));
        const m2: Product[] = data2.map((i) => ({
          id: `fs-${i.id}`, name: i.title, price: i.price, category: i.category,
          image: i.image, description: i.description, rating: i.rating?.rate || 4
        }));
        setProducts([...m1, ...m2]);
      } catch (err) { console.error("Fetch Error:", err); }
    }
    loadData();
    const saved = localStorage.getItem("my-favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("my-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (category !== "All") result = result.filter(p => p.category === category);
    if (sortOrder === "low") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "high") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, searchQuery, category, sortOrder]);

  const paginatedProducts = filteredProducts.slice(0, itemsToShow);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER - Search restored to original position */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter text-gray-900">E-<span className="text-blue-600">Commerce</span></h1>

          <div className="flex items-center gap-4">
            {/* Search Input (Restored) */}
            <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-2 border focus-within:border-blue-400 focus-within:bg-white transition-all">
              <Search size={16} className="text-gray-900" />
              <input
                placeholder="Search..."
                className="bg-transparent border-none outline-none px-2 text-sm w-48 text-gray-600"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Favorites Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsFavOpen(!isFavOpen)} 
                className={`p-2 rounded-full transition-colors ${favorites.length > 0 ? "text-red-500 bg-red-50" : "text-gray-400 hover:bg-gray-100"}`}
              >
                <Heart size={22} fill={favorites.length > 0 ? "currentColor" : "none"} />
                {favorites.length > 0 && <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-white"></span>}
              </button>

              {isFavOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 border-b flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-700">Wishlist ({favorites.length})</span>
                    <button onClick={() => setIsFavOpen(false)} className="text-gray-400"><X size={14}/></button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {favoriteProducts.length === 0 ? <p className="p-4 text-xs text-gray-400 text-center">No favorites yet</p> : 
                      favoriteProducts.map(p => (
                        <div key={p.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer" onClick={() => {setSelectedProduct(p); setIsFavOpen(false)}}>
                          <img src={p.image} className="w-10 h-10 object-cover rounded-lg" />
                          <div className="flex-grow min-w-0">
                            <p className="text-xs font-bold truncate text-gray-700">{p.name}</p>
                            <p className="text-[10px] text-blue-600 font-bold">${p.price}</p>
                          </div>
                          <button onClick={(e) => toggleFavorite(e, p.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-blue-50 rounded-full text-gray-700 transition-colors">
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

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full z-10"><X size={20}/></button>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center"><img src={selectedProduct.image} className="max-h-64 object-contain" alt={selectedProduct.name} /></div>
              <div className="md:w-1/2 p-8">
                <h2 className="text-2xl font-black text-gray-900">{selectedProduct.name}</h2>
                <div className="flex items-center gap-2 my-2 text-yellow-500 font-bold"><Star size={16} fill="currentColor"/> {selectedProduct.rating}</div>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{selectedProduct.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-gray-900">${selectedProduct.price}</span>
                  <button onClick={() => {setCartItems(prev => [...prev, selectedProduct]); setSelectedProduct(null);}} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-700">Checkout Summary</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-700"><X size={24} /></button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? <p className="text-center text-gray-700 py-10">Cart is empty</p> :
                cartItems.map((item, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-xl border text-gray-700">
                    <img src={item.image} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-grow"><p className="font-bold text-sm line-clamp-1">{item.name}</p><p className="text-blue-600 font-bold">${item.price}</p></div>
                    <button onClick={() => setCartItems(prev => prev.filter((_, idx) => idx !== i))} className="text-gray-700 hover:text-red-500"><Trash2 size={18} /></button>
                  </div>
                ))
              }
            </div>
            {cartItems.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-6"><span className="text-gray-500 font-medium text-gray-700">Grand Total</span><span className="text-2xl font-black text-gray-700">${totalPrice.toFixed(2)}</span></div>
                <button className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-blue-600 shadow-xl shadow-gray-200">Pay Now</button>
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
            <p className="text-gray-500">Showing {paginatedProducts.length} items</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex bg-white border rounded-xl p-1 shadow-sm mr-2">
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"}`}><LayoutGrid size={18} /></button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"}`}><List size={18} /></button>
            </div>
            <select onChange={(e) => setCategory(e.target.value)} className="bg-white border px-4 py-2.5 rounded-xl text-sm font-medium outline-none text-gray-700 shadow-sm flex-grow md:flex-grow-0 cursor-pointer">
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
            <select onChange={(e) => setSortOrder(e.target.value)} className="bg-white border px-4 py-2.5 rounded-xl text-sm font-medium outline-none text-gray-700 shadow-sm flex-grow md:flex-grow-0 cursor-pointer">
              <option value="default">Default</option>
              <option value="low">Price: Low</option>
              <option value="high">Price: High</option>
            </select>
          </div>
        </div>

        {/* PRODUCT DISPLAY */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8" : "flex flex-col gap-4 max-w-5xl mx-auto w-full"}>
          {paginatedProducts.map(p => (
            <div key={p.id} className="relative group cursor-pointer active:scale-[0.98] transition-all" onClick={() => setSelectedProduct(p)}>
              <ProductCard product={p} viewMode={viewMode} />
              <button 
                onClick={(e) => toggleFavorite(e, p.id)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm z-10 hover:scale-110 transition-transform"
              >
                <Heart size={16} fill={favorites.includes(p.id) ? "red" : "none"} className={favorites.includes(p.id) ? "text-red-500" : "text-gray-400"} />
              </button>
            </div>
          ))}
        </div>

        {/* PAGINATION BUTTON */}
        {itemsToShow < filteredProducts.length && (
          <div className="mt-12 flex justify-center">
            <button onClick={() => setItemsToShow(prev => prev + 8)} className="px-10 py-3 bg-white border-2 border-gray-100 font-bold rounded-2xl hover:border-blue-600 hover:text-white hover:bg-blue-600 transition-all shadow-sm text-black border-gray-400">Load More</button>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-3xl">No products found matching your search.</div>
        )}
      </main>
    </div>
  );
}