import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import Axios from "axios";
import { AuthenticatedUser } from "../types";
import { enumAuthQueryKeys } from "./keys";

const fetchAuthenticatedUser = async () => {
  const apiUrl = `http://localhost:3000/auth/42api`;

  const { data } = await Axios.get<AuthenticatedUser>(apiUrl);
  return data;
};

export const useAuthenticatedUserQuery = (
  queryOptions?: UseQueryOptions<AuthenticatedUser, Error>
) => {
  return useQuery<AuthenticatedUser, Error>(
    [enumAuthQueryKeys.LOGIN_USER_42],
    async () => {
      return fetchAuthenticatedUser();
    },
    queryOptions
  );
};
