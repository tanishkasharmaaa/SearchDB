import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1"
});

export const searchProducts = async (query) => {
  const res = await API.get(`/search/product?query=${query}`);
  return res.data;
};
