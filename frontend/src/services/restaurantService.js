import api from "../api";

// GET /api/restaurants — supports { search, category, featured, page, limit }
export const getRestaurants = async (params = {}) => {
  const res = await api.get("/restaurants", { params });
  return res.data; // { success, count, total, page, pages, data }
};

// GET /api/restaurants/:id — returns { success, restaurant, menuItems }
export const getRestaurantById = async (id) => {
  const res = await api.get(`/restaurants/${id}`);
  return res.data;
};