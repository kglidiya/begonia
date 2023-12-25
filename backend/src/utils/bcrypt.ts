import * as bcrypt from 'bcrypt';

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
export function verifyHash(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}