import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getPendingVerifications = async () => {
  const res = await axios.get(
    `${API_URL}/api/admin/verification/pending`,
    authHeader()
  );
  return res.data.data;
};

export const approveVerification = async (id) => {
  const res = await axios.patch(
    `${API_URL}/api/admin/verification/review/${id}`,
    { action: "Approved" },
    authHeader()
  );
  return res.data;
};

export const rejectVerification = async (id, reason) => {
  const res = await axios.patch(
    `${API_URL}/api/admin/verification/review/${id}`,
    { action: "Rejected", reason },
    authHeader()
  );
  return res.data;
};