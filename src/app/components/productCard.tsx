import { Product } from "../product";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const roundedRating = Math.round(product.rating || 4);

  // --- 1. REFINED LIST VIEW (Mobile Responsive) ---
  if (viewMode === "list") {
    return (
      <div className="group flex flex-row items-center bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all p-3 md:p-4 gap-4 md:gap-6 w-full">
        {/* Responsive Image Size */}
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover rounded-xl bg-gray-50 transition-transform group-hover:scale-105" 
          />
        </div>

        {/* Details: Flexible space */}
        <div className="flex-grow min-w-0"> {/* min-w-0 is critical for text truncation inside flex */}
          <p className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1">
            {product.category}
          </p>
          <h3 
            className="font-bold text-gray-800 text-sm sm:text-base md:text-lg truncate group-hover:text-blue-600 transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-400 line-clamp-1 mt-1">
            {product.description}
          </p>
          
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400 text-[10px] sm:text-xs">
              {"★".repeat(roundedRating)}
              <span className="text-gray-200">{"★".repeat(Math.max(0, 5 - roundedRating))}</span>
            </div>
          </div>
        </div>

        {/* Responsive Price/Action */}
        <div className="text-right shrink-0 flex flex-col justify-between h-full">
          <p className="text-base sm:text-xl md:text-2xl font-black text-gray-900">${product.price}</p>
          <button className="text-[10px] sm:text-xs font-bold text-blue-500 bg-blue-50 hover:bg-blue-600 hover:text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg mt-2 transition-all">
            Add +
          </button>
        </div>
      </div>
    );
  }

  // --- 2. REFINED GRID VIEW (Mobile Responsive) ---
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-sm">
          <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-600">
            {product.category}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 
            className="text-sm sm:text-base md:text-lg font-bold text-gray-800 line-clamp-1 group-hover:line-clamp-none group-hover:text-blue-600 transition-all duration-300 flex-1"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-sm sm:text-base md:text-lg font-black text-gray-900 shrink-0">${product.price}</p>
        </div>

        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 text-[10px] sm:text-sm">
            {"★".repeat(roundedRating)}
            <span className="text-gray-200">{"★".repeat(Math.max(0, 5 - roundedRating))}</span>
          </div>
        </div>

        <button className="mt-auto w-full py-2.5 sm:py-3 rounded-xl bg-gray-900 text-white text-xs sm:text-sm font-medium transform active:scale-95 transition-all hover:bg-blue-600 shadow-md">
          Add to Cart
        </button>
      </div>
    </div>
  );
}