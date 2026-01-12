import axiosClient from "./axiosClient";


export const getActions = () => {
  return axiosClient.get("/actions");
};


export const updateAction = (id, data) => {
  return axiosClient.patch(`/actions/${id}`, data);
};
