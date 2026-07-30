import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createDeal = async (dealData) => {
  const res = await axios.post(`${API_URL}/api/deals`, dealData, authHeader());
  return res.data;
};

export const getDeals = async () => {
  const res = await axios.get(`${API_URL}/api/deals`, authHeader());
  return res.data;
};

export const getDeal = async (dealId) => {
  const res = await axios.get(`${API_URL}/api/deals/${dealId}`, authHeader());
  return res.data;
};

// Seller accepts a Pending deal -> Active
export const acceptDeal = async (dealId) => {
  const res = await axios.patch(
    `${API_URL}/api/deals/${dealId}/accept`,
    {},
    authHeader()
  );
  return res.data;
};

// Either party cancels
export const cancelDeal = async (dealId) => {
  const res = await axios.patch(
    `${API_URL}/api/deals/${dealId}/cancel`,
    {},
    authHeader()
  );
  return res.data;
};

// Buyer confirms completion - deal auto-completes once seller has confirmed too
export const confirmDealAsBuyer = async (dealId) => {
  const res = await axios.patch(
    `${API_URL}/api/deals/${dealId}/confirm-buyer`,
    {},
    authHeader()
  );
  return res.data;
};

// Seller confirms completion - deal auto-completes once buyer has confirmed too
export const confirmDealAsSeller = async (dealId) => {
  const res = await axios.patch(
    `${API_URL}/api/deals/${dealId}/confirm-seller`,
    {},
    authHeader()
  );
  return res.data;
};

export const deleteDeal = async (dealId) => {
  const res = await axios.delete(
    `${API_URL}/api/deals/${dealId}`,
    authHeader()
  );
  return res.data;
};

export const getMessages = async (dealId) => {
  const res = await axios.get(`${API_URL}/api/deals/${dealId}/messages`, authHeader());
  return res.data;
};

export const sendMessage = async (dealId, text) => {
  const res = await axios.post(
    `${API_URL}/api/deals/${dealId}/messages`,
    { text },
    authHeader()
  );
  return res.data;
};

// --- Reviews (mounted at /api/reviews on the backend) ---

export const getReviewForDeal = async (dealId) => {
  const res = await axios.get(`${API_URL}/api/reviews/deals/${dealId}/review`, authHeader());
  return res.data;
};

export const submitReview = async (dealId, rating, comment) => {
  const res = await axios.post(
    `${API_URL}/api/reviews/deals/${dealId}/review`,
    { rating, comment },
    authHeader()
  );
  return res.data;
};