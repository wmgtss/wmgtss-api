import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { createHash } from 'crypto';

@Injectable()
export class PwnedMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    const count = await this.isPasswordPwned(req.body.password);
    req.body.pwned = count;
    next();
  }

  private async isPasswordPwned(password: string): Promise<number | undefined> {
    if (!password) throw new BadRequestException();

    const hash = createHash('sha1')
      .update(password)
      .digest('hex')
      .toUpperCase();

    const fetch = require('node-fetch');
    const response = await fetch(
      'https://api.pwnedpasswords.com/range/' + hash.substring(0, 5),
    );
    const text = await response.text();

    const lines = text.split('\n').map((line) => line.slice(0, -1));
    const match = lines.find((line) => line.startsWith(hash.substring(5, 41)));

    console.log(match);
    if (match) {
      const count = match.split(':')[1];
      return count;
    }
    return 0;
  }
}
