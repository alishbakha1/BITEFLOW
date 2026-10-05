import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaCheckCircle, FaUtensils, FaMotorcycle, FaHome, FaTimesCircle } from "react-icons/fa";
import { getOrderById } from "../services/orderService";

const STAGES = [
  { id: "Pending", label: "Order Placed", icon: FaCheckCircle },
  { id: "Confirmed", label: "Confirmed", icon: FaCheckCircle },
  { id: "Preparing", label: "Preparing", icon: FaUtensils },
  { id: "Out For Delivery", label: "On the way", icon: FaMotorcycle },
  { id: "Delivered", label: "Delivered", icon: FaHome },
];

function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;

   const fetchOrder = () => {
      getOrderById(id)
        .then((res) => { if (!cancelled) setOrder(res.data); })
        .catch((err) => {
          console.error("Failed to fetch order:", err.response?.status, err.response?.data || err.message);
          if (!cancelled) setLoadError(err.response?.data?.message || err.message);
        })
        .finally(() => { if (!cancelled) setLoading(false); });
    };

    fetchOrder();
    // Poll for status updates every 5s (until Delivered/Cancelled)
    const interval = setInterval(fetchOrder, 5000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [id]);

  if (!id || (!loading && !order && !loadError)) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <h1 className="font-display text-2xl font-bold text-[#0C3B2E]">No order selected</h1>
        <p className="text-gray-500">Check your order history to track an active order.</p>
        <Link to="/dashboard" className="mt-2 rounded-full bg-[#0C3B2E] px-6 py-3 text-sm font-semibold text-white">
          Go to My Orders
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-gray-500">Loading order…</div>;
  }

  if (loadError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <h1 className="font-display text-2xl font-bold text-[#0C3B2E]">Couldn't load this order</h1>
        <p className="text-gray-500">{loadError}</p>
        <Link to="/dashboard" className="mt-2 rounded-full bg-[#0C3B2E] px-6 py-3 text-sm font-semibold text-white">
          Go to My Orders
        </Link>
      </div>
    );
  }

  if (order.status === "Cancelled") {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <FaTimesCircle className="mx-auto text-5xl text-red-500 mb-4" />
        <h1 className="font-display text-2xl font-bold text-[#0C3B2E] mb-2">Order Cancelled</h1>
        <p className="text-gray-500">{order.cancelReason || "This order was cancelled."}</p>
      </div>
    );
  }

  const stageIndex = STAGES.findIndex((s) => s.id === order.status);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-[#0C3B2E] mb-2">Order Tracking</h1>
      <p className="text-gray-500 mb-10">
        Order #{order._id.slice(-6).toUpperCase()} · Delivering to {order.deliveryAddress}
      </p>

      <div className="space-y-8">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const done = i <= stageIndex;
          return (
            <div key={stage.id} className="flex items-center gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${done ? "bg-[#0C3B2E] text-white" : "bg-gray-100 text-gray-400"}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className={`font-semibold ${done ? "text-[#0C3B2E]" : "text-gray-400"}`}>{stage.label}</p>
                {done && i === stageIndex && stage.id !== "Delivered" && (
                  <p className="text-xs text-gray-500">In progress…</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl bg-[#FAF8F4] p-5">
        <div className="space-y-1 text-sm text-gray-600 mb-3">
          {order.items.map((it) => (
            <div key={it.menuItem} className="flex justify-between">
              <span>{it.quantity}x {it.name}</span>
              <span>${(it.price * it.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-[#0C3B2E] text-lg border-t border-gray-200 pt-3">
          <span>Total</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;