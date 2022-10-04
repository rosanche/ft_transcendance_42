import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import Axios from "axios";
import { useAppContextState } from "modules/common/context/AppContext";
import { User, User } from "../types";
import { enumProfileQueryKeys } from "./keys";

const fetchUsers = async () => {
  const apiUrl = `http://localhost:3000/users/all`;

  const { data } = await Axios.get<User[]>(apiUrl, {
    withCredentials: true,
  });
  console.log("$$data almost here", data);
  return data;
};

export const useUsersQuery = (
  queryOptions?: UseQueryOptions<User[], Error>
) => {
  return useQuery<User[], Error>(
    [enumProfileQueryKeys.USERS],
    async () => {
      return fetchUsers();
    },
    queryOptions
  );
};
