import React from "react";
import { FaStar, FaClock, FaMotorcycle } from "react-icons/fa";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

const RestaurantCard = ({ restaurant, onClick }) => {
  const categoryName = restaurant.categories?.[0]?.name || restaurant.category || "";

  return (
    <div
      onClick={() => onClick(restaurant)}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
    >
      <div className="relative overflow-hidden">
        <img
          src={restaurant.image || FALLBACK_IMG}
          alt={restaurant.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />

        <span
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
            restaurant.isOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {restaurant.isOpen ? "Open" : "Closed"}
        </span>

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-lg rounded-full px-3 py-1 flex items-center gap-1 shadow">
          <FaStar className="text-yellow-400 text-sm" />
          <span className="font-semibold text-sm">{restaurant.rating}</span>
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-xl font-bold text-[#0C3B2E] group-hover:text-[#FFBA00] transition">
          {restaurant.name}
        </h2>

        <p className="text-gray-500 mt-1">{categoryName}</p>

        <div className="flex justify-between mt-5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaClock className="text-[#6D9773]" />
            {restaurant.deliveryTime} min
          </div>

          <div className="flex items-center gap-2">
            <FaMotorcycle className="text-[#6D9773]" />
            Rs {restaurant.deliveryFee}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;