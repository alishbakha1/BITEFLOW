import { FaStar, FaPlus } from "react-icons/fa";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

export const FoodCard = ({ food, onAddToCart }) => {
  if (!food) return null;

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-md transition-all duration-300 hover:shadow-xl">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
     <img
  src={food.image && food.image.trim() !== "" ? food.image : FALLBACK_IMG}
  alt={food.name}
  className="h-full w-full object-cover"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMG;
  }}
/>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-body font-semibold text-[#0C3B2E]">{food.name}</h3>
          <span className="flex shrink-0 items-center gap-1 text-xs text-gray-500">
            <FaStar className="text-[#FFBA00]" /> {food.rating}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{food.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-[#0C3B2E]">
            ${food.price.toFixed(2)}
          </span>
          <button
            onClick={onAddToCart}
            className="flex items-center gap-1 rounded-full bg-[#0C3B2E] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0a2f24]"
            aria-label={`Add ${food.name} to cart`}
          >
            <FaPlus size={10} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;