import bcrypt from "bcrypt";

const salt = 10;

export const passwordHasher = async (password:string) => {
  return await bcrypt.hash(password, salt);
};

export const passwordCompare = async (enteredPassword:string, hashedPassword:string) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};
