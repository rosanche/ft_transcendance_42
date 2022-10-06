import axios from "axios";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { enumProfileQueryKeys } from "../queries/keys";

const patchDesactivate2Fa = async () => {
  const apiUrl = `http://localhost:3000/auth/2fa/turn-off`;

  const { data } = await axios.patch<string>(apiUrl, null, {
    withCredentials: true,
  });
  return data;
};

export const useDesactivate2Fa = (
  mutationOptions?: UseMutationOptions<string, void, string>
) => {
  const { onSuccess, ...otherMutationOptions } = mutationOptions || {};
  const queryClient = useQueryClient();

  return useMutation<string, void, string>(
    async () => {
      return patchDesactivate2Fa();
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
