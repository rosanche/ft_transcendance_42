import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import Axios from "axios";
import { useAppContextState } from "modules/common/context/AppContext";
import { MyProfile } from "../types";
import { enumProfileQueryKeys } from "./keys";

const fetchMyProfile = async () => {
  const apiUrl = `http://localhost:3000/users/me`;

  const { data } = await Axios.get<MyProfile>(apiUrl, {
    withCredentials: true,
  });
  return data;
};

export const useMyProfileQuery = (
  queryOptions?: UseQueryOptions<MyProfile, Error>
) => {
  return useQuery<MyProfile, Error>(
    [enumProfileQueryKeys.MY_PROFILE],
    async () => {
      return fetchMyProfile();
    },
    queryOptions
  );
};
