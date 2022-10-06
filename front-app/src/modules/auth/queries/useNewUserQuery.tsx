import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import Axios from "axios";
import { NewUser } from "../types";
import { enumAuthQueryKeys } from "./keys";

const fetchNewUser = async () => {
  const apiUrl = `http://localhost:3000/auth/auth-info`;

  const { data } = await Axios.get<NewUser>(apiUrl);
  return data;
};

export const useNewUserQuery = (
  queryOptions?: UseQueryOptions<NewUser, Error>
) => {
  return useQuery<NewUser, Error>(
    [enumAuthQueryKeys.LOGIN_USER_42],
    async () => {
      return fetchNewUser();
    },
    queryOptions
  );
};
