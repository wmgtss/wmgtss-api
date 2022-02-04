import { BadRequestException } from '@nestjs/common';
import { createHash } from 'crypto';

export async function isPasswordPwned(
  password: string,
): Promise<number | undefined> {
  if (!password) throw new BadRequestException();
  const fetch = require('node-fetch');

  const hash = createHash('sha1').update(password).digest('hex').toUpperCase();
  const response = await fetch(
    'https://api.pwnedpasswords.com/range/' + hash.substring(0, 5),
  );
  const text = await response.text();
  const lines = text.split('\n').map((line) => line.slice(0, -1));
  const match = lines.find((line) => line.startsWith(hash.substring(5, 41)));

  if (match) {
    const count = match.split(':')[1];
    return count;
  }
  return 0;
}
