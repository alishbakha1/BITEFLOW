import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/orderService";

function Checkout() {
  const { items, restaurantId, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("COD");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim() || !restaurantId) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await createOrder({
        restaurant: restaurantId,
        items: items.map((i) => ({ menuItem: i.id, quantity: i.quantity })),
        deliveryAddress: address,
        contactPhone: phone,
        paymentMethod: payment,
      });
      clearCart();
      navigate(`/tracking/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <h1 className="font-display text-2xl font-bold text-[#0C3B2E]">Nothing to check out</h1>
        <p className="text-gray-500">Add items to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-[#0C3B2E] mb-2">Checkout</h1>
      <p className="text-gray-500 mb-8">Hi {user?.name || "there"}, confirm your order details below.</p>

      <form onSubmit={handlePlaceOrder} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#0C3B2E] mb-2">Delivery address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
            placeholder="House #, Street, Area, City"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3B2E]/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0C3B2E] mb-2">Contact phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+92 300 0000000"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3B2E]/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0C3B2E] mb-2">Payment method</label>
          <div className="flex gap-3">
            {[
              { id: "COD", label: "Cash on Delivery" },
              { id: "Card", label: "Card" },
            ].map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setPayment(p.id)}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  payment === p.id ? "border-[#0C3B2E] bg-[#0C3B2E] text-white" : "border-gray-200 text-gray-600"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#FAF8F4] p-5">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-[#0C3B2E] text-lg border-t border-gray-200 pt-2 mt-2">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[#FFBA00] py-3.5 text-sm font-bold text-[#0C3B2E] hover:bg-[#FFBA00]/90 transition disabled:opacity-60"
        >
          {submitting ? "Placing order…" : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;