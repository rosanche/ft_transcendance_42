export interface MyProfile {
  User_channel: [];
  createdAt: string;
  dem_friendBy: [];
  email: string;
  goals_a: 0;
  goals_f: 0;
  id: 1;
  myDem_friend: ApiFriend[];
  myfriends: ApiFriend[];
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
  status: "online" | "offline" | "playing";
}

export interface QrCode2Fa {
  qrCode: string;
}

export type FriendType = "friend_request" | "game_request" | "friend";
