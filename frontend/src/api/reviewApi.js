import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// Public - used on the seller profile page and "My Reviews" (own reviews)
export const getSellerReviews = async (sellerId, page = 1, limit = 10) => {
  const res = await axios.get(
    `${API_URL}/api/reviews/sellers/${sellerId}/reviews?page=${page}&limit=${limit}`
  );
  return res.data; // { reviews, pagination }
};

export const getSellerProfile = async (userId) => {
  const res = await axios.get(`${API_URL}/api/seller/${userId}`, authHeader());
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await axios.get(`${API_URL}/api/users/${userId}`, authHeader());
  return res.data;
};