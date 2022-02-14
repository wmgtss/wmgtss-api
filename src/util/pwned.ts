import { BadRequestException } from '@nestjs/common';
import { createHash } from 'crypto';

/**
 * To check whether a password has been seen in a data breach, we can
 * send the first 5 chars of the SHA1 hash to the PwnedPasswords API.
 * The API sends back a list of hashes where the first 5 chars match
 * those provided. We can then search the list for our full hash.
 * If it appears in the list, the user's password has been breached.
 */
export async function isPasswordPwned(password: string): Promise<number> {
  if (!password) throw new BadRequestException();
  const fetch = require('node-fetch');

  // Create a SHA1 hash of the proposed password and send the first 5 chars
  const hash = createHash('sha1').update(password).digest('hex').toUpperCase();
  const response = await fetch(
    'https://api.pwnedpasswords.com/range/' + hash.substring(0, 5),
  );

  // From the response, search for a hash matching our own
  const text = await response.text();
  const lines = text.split('\n').map((line) => line.slice(0, -1));
  const match = lines.find((line) => line.startsWith(hash.substring(5, 41)));

  // If there's a match, find the number of times it has appeared in breaches
  if (match) {
    const count = match.split(':')[1];
    return parseInt(count);
  }

  // If there was no match, return 0 matches
  return 0;
}
