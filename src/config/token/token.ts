import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET!;
console.log(secretKey);

export const generateJwtToken = (id: string) => {
  return jwt.sign({ id }, secretKey, { expiresIn: "2h" });
};

export const resetJwtToken = (id: string) => {
  return jwt.sign({ id }, secretKey, { expiresIn: 60 * 60 });
};

export const verifyJwtToken = (token: string) => {
  if (secretKey !== undefined) {
    try {
      const data = jwt.verify(token, secretKey);
      return data;
    } catch (error) {
      return error;
    }
  }
};
