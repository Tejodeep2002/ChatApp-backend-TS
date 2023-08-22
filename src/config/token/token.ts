import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;

export const generateJwtToken = (id: string) => {
  if (secretKey !== undefined) {
    const token = jwt.sign({ id }, secretKey, { expiresIn: "30d" });
    return token;
  }
};

export const resetJwtToken = (id: string) => {
  if (secretKey !== undefined) {
    const token = jwt.sign({ id }, secretKey, { expiresIn: 60 * 60 });
    return token;
  }
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
