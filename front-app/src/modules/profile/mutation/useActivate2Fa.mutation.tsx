import axios from "axios";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { enumProfileQueryKeys } from "../queries/keys";

const postActivate2Fa = async (twoFactorAuthenticationCode: string) => {
  const apiUrl = `http://localhost:3000/auth/2fa/turn-on`;

  const { data } = await axios.post<string>(
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
  mutationOptions?: UseMutationOptions<string, void, string>
) => {
  const { onSuccess, ...otherMutationOptions } = mutationOptions || {};
  const queryClient = useQueryClient();

  return useMutation<string, void, string>(
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
