import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { isPasswordPwned } from '../../util/pwned';

// Check new passwords against PwnedPasswords
@Injectable()
export class PwnedMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    const count = await isPasswordPwned(req.body.password);
    req.pwned = count;
    next();
  }
}
