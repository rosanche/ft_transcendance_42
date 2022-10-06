export interface AuthenticatedUser {
  access_token: string;
  isTwoFactorAuthenticationEnabled: boolean;
}

export interface NewUser {
  isNew: boolean;
  is2FaEnabled: boolean;
}
