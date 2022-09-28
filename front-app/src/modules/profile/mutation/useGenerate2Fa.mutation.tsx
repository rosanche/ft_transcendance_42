import axios from "axios";
import { useMutation } from "@tanstack/react-query";

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
