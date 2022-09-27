import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { QrCode2Fa } from "../types";

interface MutationVariables {
  twoFactorAuthenticationCode: string;
}

const postActivate2Fa = async (twoFactorAuthenticationCode: string) => {
  const apiUrl = `http://localhost:3000/auth/2fa/turn-on`;

  console.log("$$endpoint", twoFactorAuthenticationCode);
  const { data } = await axios.post<QrCode2Fa>(
    apiUrl,
    {
      twoFactorAuthenticationCode,
    },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useActivate2Fa = () => {
  return useMutation<QrCode2Fa>(async (twoFactorAuthenticationCode) => {
    console.log("$$caca", twoFactorAuthenticationCode);
    return postActivate2Fa(twoFactorAuthenticationCode);
  });
};
