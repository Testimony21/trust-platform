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

export const updateDealStatus = async (dealId, status) => {
  const res = await axios.patch(
    `${API_URL}/api/deals/${dealId}/status`,
    { status },
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