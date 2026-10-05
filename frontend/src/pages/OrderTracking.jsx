import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaUtensils, FaMotorcycle, FaHome } from "react-icons/fa";

const STAGES = [
  { id: "placed", label: "Order Placed", icon: FaCheckCircle },
  { id: "preparing", label: "Preparing", icon: FaUtensils },
  { id: "onway", label: "On the way", icon: FaMotorcycle },
  { id: "delivered", label: "Delivered", icon: FaHome },
];

function OrderTracking() {
  const [order, setOrder] = useState(null);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    try {
      setOrder(JSON.parse(localStorage.getItem("biteflow_last_order")));
    } catch {
      setOrder(null);
    }
  }, []);

  useEffect(() => {
    if (!order) return;
    const timer = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(timer);
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <h1 className="font-display text-2xl font-bold text-[#0C3B2E]">No active orders</h1>
        <p className="text-gray-500">Place an order to see live tracking here.</p>
        <Link to="/restaurants" className="mt-2 rounded-full bg-[#0C3B2E] px-6 py-3 text-sm font-semibold text-white">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-[#0C3B2E] mb-2">Order Tracking</h1>
      <p className="text-gray-500 mb-10">Order #{order.id} · Delivering to {order.address}</p>

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
                {done && i === stageIndex && <p className="text-xs text-gray-500">In progress...</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl bg-[#FAF8F4] p-5">
        <div className="flex justify-between font-bold text-[#0C3B2E] text-lg">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;