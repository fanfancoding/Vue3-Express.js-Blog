import md5 from 'md5'
export function encryptPassword(password: string): string {
  return md5(password)
}
