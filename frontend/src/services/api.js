import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URI}/api/v1`
});

export const searchProducts = async (query) => {
  const res = await API.get(`/search/product?query=${query}`);
  return res.data;
};
