import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaClock, FaMotorcycle, FaCheckCircle, FaTimesCircle, FaReceipt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getUserOrders } from "../services/orderService";

const STATUS_STYLES = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-blue-100 text-blue-700",
  "Out For Delivery": "bg-[#FFBA00]/20 text-[#0C3B2E]",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const ACTIVE_STATUSES = ["Pending", "Confirmed", "Preparing", "Out For Delivery"];

function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getUserOrders()
      .then((res) => { if (!cancelled) setOrders(res.data || []); })
      .catch((err) => { if (!cancelled) setLoadError(err.response?.data?.message || err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const pastOrders = orders.filter((o) => !ACTIVE_STATUSES.includes(o.status));
  const totalSpent = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-[#0C3B2E] mb-1">
        Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
      </h1>
      <p className="text-gray-500 mb-8">Here's what's happening with your orders.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <div className="rounded-2xl bg-white shadow-md p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="font-display text-2xl font-bold text-[#0C3B2E]">{orders.length}</p>
        </div>
        <div className="rounded-2xl bg-white shadow-md p-5">
          <p className="text-sm text-gray-500">Active Orders</p>
          <p className="font-display text-2xl font-bold text-[#0C3B2E]">{activeOrders.length}</p>
        </div>
        <div className="rounded-2xl bg-white shadow-md p-5 col-span-2 sm:col-span-1">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="font-display text-2xl font-bold text-[#0C3B2E]">${totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-12">Loading your orders…</p>
      ) : loadError ? (
        <p className="text-center text-red-500 py-12">{loadError}</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <FaReceipt className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="font-display text-xl font-bold text-[#0C3B2E] mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">When you place an order, it'll show up here.</p>
          <Link to="/restaurants" className="rounded-full bg-[#0C3B2E] px-6 py-3 text-sm font-semibold text-white">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <>
          {activeOrders.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display text-xl font-bold text-[#0C3B2E] mb-4">Active Orders</h2>
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <OrderRow key={order._id} order={order} />
                ))}
              </div>
            </div>
          )}

          {pastOrders.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-[#0C3B2E] mb-4">Order History</h2>
              <div className="space-y-3">
                {pastOrders.map((order) => (
                  <OrderRow key={order._id} order={order} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OrderRow({ order }) {
  const isActive = ACTIVE_STATUSES.includes(order.status);
  const StatusIcon = order.status === "Delivered" ? FaCheckCircle
    : order.status === "Cancelled" ? FaTimesCircle
    : order.status === "Out For Delivery" ? FaMotorcycle
    : FaClock;

  return (
    <div className="flex items-center justify-between gap-4 bg-white rounded-2xl shadow-md p-4 sm:p-5">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-11 h-11 rounded-full bg-[#0C3B2E]/5 flex items-center justify-center flex-shrink-0">
          <StatusIcon className="text-[#0C3B2E]" size={16} />
        </div>
        <div className="min-w-0">
          <p className="font-body font-semibold text-[#0C3B2E] truncate">
            {order.restaurant?.name || "Restaurant"}
          </p>
          <p className="text-xs text-gray-500">
            #{order._id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}`}>
          {order.status}
        </span>
        <span className="font-display font-bold text-[#0C3B2E]">${order.totalAmount.toFixed(2)}</span>
        {isActive && (
          <Link to={`/tracking/${order._id}`} className="text-xs font-semibold text-[#0C3B2E] underline underline-offset-2 whitespace-nowrap">
            Track
          </Link>
        )}
      </div>
    </div>
  );
}

export default Dashboard;