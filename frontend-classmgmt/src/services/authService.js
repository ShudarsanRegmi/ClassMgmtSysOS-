import axios from "axios";

const API_URL = "http://localhost:3001";  // backend url

export const sendTokenToBackend = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/api/private`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Server Error");
  }
};
