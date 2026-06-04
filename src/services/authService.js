import axiosClient from "./api/axiosClient";

export const authService = {
  register: async (payload) => {
    const { data } = await axiosClient.post("/auth/register", payload);
    return data;
  },

  login: async (payload) => {
    const { data } = await axiosClient.post("/auth/login", payload);
    return data;
  },

  logout: async () => {
    const { data } = await axiosClient.post("/auth/logout");
    return data;
  },

  getMe: async () => {
    const { data } = await axiosClient.get("/auth/me");
    return data;
  },

  updateProfile: async (formData) => {
    const { data } = await axiosClient.post("/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        _method: "PUT",
      },
    });
    return data;
  },
};
