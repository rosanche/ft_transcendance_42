import axios from "axios";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { enumProfileQueryKeys } from "modules/profile/queries/keys";

const postAuthenticate2Fa = async (twoFactorAuthenticationCode: string) => {
  const apiUrl = `http://localhost:3000/auth/2fa/authenticate`;

  console.log("$$endpoint", twoFactorAuthenticationCode);
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

export const useAuthenticate2Fa = (
  mutationOptions?: UseMutationOptions<string, void, string>
) => {
  const { onSuccess, ...otherMutationOptions } = mutationOptions || {};
  const queryClient = useQueryClient();

  return useMutation<string, void, string>(
    async (twoFactorAuthenticationCode) => {
      return postAuthenticate2Fa(twoFactorAuthenticationCode);
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
