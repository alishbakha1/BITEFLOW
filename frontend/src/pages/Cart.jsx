import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext";

function Cart() {
  const { items, addItem, removeItem, deleteItem, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <FaShoppingBag className="text-6xl text-[#0C3B2E]/20" />
        <h1 className="font-display text-2xl font-bold text-[#0C3B2E]">Your cart is empty</h1>
        <p className="text-gray-500">Looks like you haven't added anything yet.</p>
        <Link
          to="/restaurants"
          className="mt-2 rounded-full bg-[#0C3B2E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a2f24] transition"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-[#0C3B2E] mb-8">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-md">
            <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold text-[#0C3B2E]">{item.name}</h3>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
              <button onClick={() => removeItem(item.id)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200" aria-label="Decrease quantity">
                <FaMinus size={10} />
              </button>
              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
              <button onClick={() => addItem(item)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200" aria-label="Increase quantity">
                <FaPlus size={10} />
              </button>
            </div>
            <button onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500 transition" aria-label="Remove item">
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
        <button onClick={clearCart} className="text-sm font-medium text-gray-500 hover:text-red-500 transition">
          Clear cart
        </button>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total</p>
          <p className="font-display text-2xl font-bold text-[#0C3B2E]">${totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="mt-6 w-full rounded-full bg-[#FFBA00] py-3.5 text-sm font-bold text-[#0C3B2E] hover:bg-[#FFBA00]/90 transition"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

export default Cart;