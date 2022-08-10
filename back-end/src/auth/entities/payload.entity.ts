export interface TokenPayload {
    iat: number;
    exp: number;
    email: string;
    sub: number;
    isTwoFactorAuthenticated?: boolean;
    isTwoFactorAuthenticationEnabled: boolean;
  }