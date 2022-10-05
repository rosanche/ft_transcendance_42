import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import Axios from "axios";
import { useAppContextState } from "modules/common/context/AppContext";
import { User } from "modules/profile/types";
import { enumProfileQueryKeys } from "./keys";

const fetchUsersChannel = async () => {
  const apiUrl = `http://localhost:3000/channel/` + "1" + "/users";

  const { data } = await Axios.get<User[]>(apiUrl, {
    withCredentials: true,
  });
  console.log("$$data almost hereeeeeeeeee", data);
  return data;
};

export const useUsersChannelQuery = (
  queryOptions?: UseQueryOptions<User[], Error>
) => {
  return useQuery<User[], Error>(
    [enumProfileQueryKeys.USERS],
    async () => {
      return fetchUsersChannel();
    },
    queryOptions
  );
};
