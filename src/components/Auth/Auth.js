import axios from "axios";

const AuthAxios = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("api_token")}`,
  },
});

export default AuthAxios;
