import * as jwt from "jsonwebtoken";

export interface JwtPayload extends jwt.JwtPayload {
  userId: number;
}

export class JwtService {
  constructor(private readonly secret: string) {}

  sign(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret);
  }

  verify(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }

  parseAndVerify(header: string): JwtPayload | null {
    const token = this.parseBearerToken(header);

    if (token) {
      return this.verify(token);
    }
    else {
      return null;
    }
  }

  parseBearerToken(jwtHeader: string): string | undefined {
    const bearer = jwtHeader.split(" ");
    const token = bearer[1];

    return token;
  }
}
