import api from "../api";

// GET /api/reviews?restaurant=<id>
export const getRestaurantReviews = async (restaurantId) => {
  const res = await api.get("/reviews", { params: { restaurant: restaurantId } });
  return res.data; // { success, count, data: [...] }
};