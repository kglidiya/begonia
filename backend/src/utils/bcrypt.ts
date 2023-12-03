import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  const t =  await bcrypt.hash(password, 10);
  console.log(`bcrypt.hash ${t}`)
  return t
}
export async function verifyHash(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
// export function verifyHash(password: string, hash: string) {
//   return bcrypt.compare(password, hash);
// }
