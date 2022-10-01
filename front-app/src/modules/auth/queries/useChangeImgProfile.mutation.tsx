import axios from "axios";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { enumProfileQueryKeys } from "modules/profile/queries/keys";

const postChangeImgProfile = async (file: File) => {
  const apiUrl = `http://localhost:3000/users/me/uploadPP`;

  console.log("$$endpoint", file);
  const { data } = await axios.post<File>(
    apiUrl,
    {
      file,
    },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useChangeImgProfileMutation = (
  mutationOptions?: UseMutationOptions<File, void, File>
) => {
  const { onSuccess, ...otherMutationOptions } = mutationOptions || {};
  const queryClient = useQueryClient();

  return useMutation<File, void, File>(
    async (file) => {
      return postChangeImgProfile(file);
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
