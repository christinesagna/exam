import axiosClient from "./api/axiosClient";

export const authService = {
  async register(payload) {
    const { data } = await axiosClient.post("/auth/register", payload);
    return data;
  },

  async login(payload) {
    const { data } = await axiosClient.post("/auth/login", payload);
    return data;
  },

  async logout() {
    const { data } = await axiosClient.post("/auth/logout");
    return data;
  },

  async getMe() {
    const { data } = await axiosClient.get("/auth/me");
    return data;
  },

  async updateProfile(formData) {
    const { data } = await axiosClient.post("/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },
};
