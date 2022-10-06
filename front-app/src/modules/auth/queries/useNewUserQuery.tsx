import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import Axios from "axios";
import Cookies from "js-cookie";
import { CookieKeys } from "modules/common/types";
import { NewUser } from "../types";
import { enumAuthQueryKeys } from "./keys";

const fetchNewUser = async () => {
  const apiUrl = `http://localhost:3000/auth/auth-info`;

  const { data } = await Axios.get<NewUser>(apiUrl, {
    withCredentials: true,
  });
  return data;
};

export const useNewUserQuery = (
  queryOptions?: UseQueryOptions<NewUser, Error>
) => {
  return useQuery<NewUser, Error>(
    [enumAuthQueryKeys.LOGIN_USER_42],
    async () => {
      if (!Cookies.get(CookieKeys.ACCESS_TOKEN)) return null;
      return fetchNewUser();
    },
    queryOptions
  );
};
