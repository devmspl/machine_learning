import * as bcrypt from 'bcrypt';

export const hash = (value: string): string => {
  return bcrypt.hashSync(value, 10);
};

export const verifyHash = (hash: string, plain: string): boolean => {
  return bcrypt.compareSync(plain, hash);
};
