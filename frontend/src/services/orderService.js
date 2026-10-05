import api from "../api";

// POST /api/orders — places an order for the current cart
export const createOrder = async (payload) => {
  const res = await api.post("/orders", payload);
  return res.data; // { success, data: order }
};

// GET /api/orders — current user's order history
export const getUserOrders = async () => {
  const res = await api.get("/orders");
  return res.data; // { success, count, data: [orders] }
};

// GET /api/orders/:id — a single order
export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data; // { success, data: order }
};

// PUT /api/orders/:id/cancel — cancel while still Pending
export const cancelOrder = async (id, reason) => {
  const res = await api.put(`/orders/${id}/cancel`, { reason });
  return res.data;
};