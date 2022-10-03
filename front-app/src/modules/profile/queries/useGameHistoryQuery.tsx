import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import Axios from "axios";

import { ApiGame } from "../types";
import { enumProfileQueryKeys } from "./keys";

const fetchGameHistory = async () => {
  const apiUrl = `http://localhost:3000/game-history/all`;

  const { data } = await Axios.get<ApiGame[]>(apiUrl, {
    withCredentials: true,
  });
  return data;
};

export const useGameHistoryQuery = (
  queryOptions?: UseQueryOptions<ApiGame[], Error>
) => {
  return useQuery<ApiGame[], Error>(
    [enumProfileQueryKeys.GAME_HISTORY],
    async () => {
      return fetchGameHistory();
    },
    queryOptions
  );
};
