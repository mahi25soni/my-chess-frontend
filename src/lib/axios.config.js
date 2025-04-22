import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.API_BASE_URL}api/`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export default apiClient;
