import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { QrCode2Fa } from "../types";

const postGenerate2Fa = async () => {
  const apiUrl = `http://localhost:3000/auth/2fa/generate`;

  const { data } = await axios.post<string>(apiUrl, null, {
    withCredentials: true,
  });
  return data;
};

export const useGenerate2Fa = () => {
  return useMutation<string>(postGenerate2Fa);
};
