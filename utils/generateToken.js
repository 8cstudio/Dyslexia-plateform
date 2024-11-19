import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  return jwt.sign({ id }, "ncjcncndhcbhdbcd", {
    expiresIn: "7d",
  });
};
