export interface User {
  User_channel: [];
  createdAt: string;
  friendReqReceive: [];
  email: string;
  goals_a: number;
  goals_f: number;
  level: number;
  experience: number;
  id: number;
  friendReqSend: ApiFriend[];
  myfriends: ApiFriend[];
  blocked: ApiFriend[];
  myblocked: ApiFriend[];
  nbr_games: number;
  nbr_looses: number;
  nbr_wins: number;
  profileImage: null;
  pseudo: string;
  updateAt: string;
}

export interface ApiFriend {
  id: number;
  pseudo: string;
  legend: string;
  profileImage: string;
}

export interface Friend {
  // imgUrl: string;
  username: string;
}
export type UserStatus = "online" | "offline" | "playing" | "blocked";
export type FriendType =
  | "friend_request"
  | "game_request"
  | "friend"
  | "friend_resume";

export interface ApiGame {
  id: number;
  id_1: number;
  score_1: number;
  score_2: number;
  id_2: number;
  winner: number;
}
