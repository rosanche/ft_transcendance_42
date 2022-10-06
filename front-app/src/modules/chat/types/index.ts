export type form = {
  idSend: number;
  idReceive: number;
  texte: string;
};

export type pass = {
  idChannel: number;
  name: string;
  password: string;
  private: boolean;
};

export type Channel = {
  id: number;
  name: string;
  private: boolean;
  user: boolean;
  admin: boolean;
  owner: boolean;
  password: boolean;
};

export type Ban = {
  mute_ban: string;
  idChannel: number;
  idUser: number;
  time: number;
  motif: string;
};

export type usersChannel = {
  id: number;
  pseudo: string;
  stastu: number;
  blocked: boolean;
  myblocked: boolean;
};
