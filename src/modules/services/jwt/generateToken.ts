import jwt from "jsonwebtoken";

export const generateToken = (payload: { sub: string; name: string }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
    expiresIn: "1h",
  });
  return token;
};

export default generateToken;