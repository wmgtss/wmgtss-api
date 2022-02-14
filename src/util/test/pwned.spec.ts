import { isPasswordPwned } from '../pwned';

describe('pwned', () => {
  it('should identify bad passwords', async () => {
    const result = await isPasswordPwned('Password123!');
    expect(result).toBeGreaterThan(0);
  });

  it('should ignore good passwords', async () => {
    const result = await isPasswordPwned('.YzAw!!E4iCjX@9_bHeod7!bPpnkvAE7');
    expect(result).toBe(0);
  });
});
