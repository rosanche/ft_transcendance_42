import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import Axios from "axios";
import { MyProfile } from "../types";
import { enumProfileQueryKeys } from "./keys";

const fetchMyProfile = async () => {
  const apiUrl = `http://localhost:3000/auth/42api`;

  const { data } = await Axios.get<MyProfile>(apiUrl);
  return data;
};

export const useMyProfileQuery = (
  queryOptions?: UseQueryOptions<MyProfile, Error>
) => {
  return useQuery<MyProfile, Error>(
    [enumProfileQueryKeys.MY_PROFILE],
    async () => {
      // const token = await getFreshToken(getFreshTokenOptions)

      // if (!token?.access_token) {
      //   throw new Error('useMyProfileQuery: Token is missing')
      // }

      return fetchMyProfile();
    },
    queryOptions
  );
};
