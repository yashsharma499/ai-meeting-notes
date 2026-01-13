import axiosClient from "./axiosClient";

export const signupUser = (data) => {
  return axiosClient.post("/auth/signup", data);
};

export const loginUser = (data) => {
  return axiosClient.post("/auth/login", data);
};
