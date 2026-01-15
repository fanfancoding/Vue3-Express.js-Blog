import md5 from 'md5'
export function encryptPassword(password) {
  return md5(password)
}
