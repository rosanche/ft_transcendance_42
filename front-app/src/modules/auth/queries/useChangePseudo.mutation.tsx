import axios from "axios";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { enumProfileQueryKeys } from "modules/profile/queries/keys";

const patchChangePseudo = async (pseudo: string) => {
  const apiUrl = `http://localhost:3000/users/me/modif`;

  console.log("$$endpoint", pseudo);
  const { data } = await axios.patch<string>(
    apiUrl,
    {
      pseudo,
    },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useChangePseudoMutation = (
  mutationOptions?: UseMutationOptions<string, void, string>
) => {
  const { onSuccess, ...otherMutationOptions } = mutationOptions || {};
  const queryClient = useQueryClient();

  return useMutation<string, void, string>(
    async (pseudo) => {
      return patchChangePseudo(pseudo);
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
