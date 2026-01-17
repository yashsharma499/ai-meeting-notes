import axiosClient from "./axiosClient";

export const createMeeting = (data) => {
  return axiosClient.post("/meetings/create", data);
};

export const processMeeting = (data) => {
  return axiosClient.post("/meetings/process", data); // expects meeting_id + notes
};

export const getMeetings = () => {
  return axiosClient.get("/meetings/");
};
export const getMeetingById = (meetingId) => {
  return axiosClient.get(`/meetings/${meetingId}`);
};