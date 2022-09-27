export interface MyProfile {
  User_channel: [];
  createdAt: string;
  dem_friendBy: [];
  email: string;
  goals_a: 0;
  goals_f: 0;
  id: 1;
  myDem_friend: [];
  myfriends: [];
  nbr_games: 0;
  nbr_looses: 0;
  nbr_wins: 0;
  profileImage: null;
  pseudo: string;
  updateAt: string;
}

export interface Friend {
  // imgUrl: string;
  username: string;
  status: "online" | "offline" | "playing";
}

export interface QrCode2Fa {
  qrCode: string;
}
