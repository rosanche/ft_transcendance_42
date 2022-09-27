import axios from "axios";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { QrCode2Fa } from "../types";
import { enumProfileQueryKeys } from "../queries/keys";

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

export const useActivate2Fa = (
  mutationOptions?: UseMutationOptions<QrCode2Fa, void, string>
) => {
  const { onSuccess, ...otherMutationOptions } = mutationOptions || {};
  const queryClient = useQueryClient();

  return useMutation<QrCode2Fa, void, string>(
    async (twoFactorAuthenticationCode) => {
      return postActivate2Fa(twoFactorAuthenticationCode);
    },
    {
      onSuccess: (...args) => {
        onSuccess?.(...args);

        queryClient.invalidateQueries([enumProfileQueryKeys.MY_PROFILE]);
      },
      ...otherMutationOptions,
    }
  );
};
