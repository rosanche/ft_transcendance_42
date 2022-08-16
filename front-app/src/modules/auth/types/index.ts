export interface AuthenticatedUser {
  access_token: string;
  isTwoFactorAuthenticationEnabled: boolean;
}
