import axios from "axios";

export interface LoginData {
  email: string;
  password: string;
}

const API_URL = "http://localhost:8080/api/auth";

export const login = async (data: LoginData) => {
  const response = await axios.post(`${API_URL}/login`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
