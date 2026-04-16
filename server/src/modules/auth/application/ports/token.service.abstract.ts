export abstract class AbstractTokenService {
  abstract generateToken(payload: TokenPayload, options?: TokenOptions): Promise<string>;
  abstract verifyToken(token: string, options?: TokenOptions): Promise<TokenPayload>;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface TokenOptions {
  expiresIn?: string | number;
  secret?: string; 
}

