import axios from "axios";
import { useMutation } from "react-query";
import { QrCode2Fa } from "../types";

const postGenerate2Fa = async () => {
  const apiUrl = `http://localhost:3000/auth/2fa/generate`;

  const { data } = await axios.post<QrCode2Fa>(apiUrl);
  return data;
};

export const useGenerate2Fa = () => {
  return useMutation<QrCode2Fa>(async () => {
    return postGenerate2Fa();
  });
};
