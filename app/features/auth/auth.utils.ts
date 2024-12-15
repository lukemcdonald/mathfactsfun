import bcrypt from 'bcryptjs'

export async function hashPassword(password: string) {
  // eslint-disable-next-line import/no-named-as-default-member
  return bcrypt.hash(password, 10)
}
