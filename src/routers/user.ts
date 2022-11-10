import express from "express";
import { prisma } from "../prismaClient"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { decryptRSA } from "../helpers/rsa";
import { httpCatchError } from "../helpers/httpCatchError";
import { loginSchema } from "../helpers/validationSchemas";

const userRouter = express.Router();

type TCreateToken = {
  username: string;
  name: string
};
export const createToken = (props: TCreateToken) => {
  const maxAge = 1 * 24 * 60 * 60;
  return jwt.sign(props, process.env.JWT_SECRET as string, {
    expiresIn: maxAge,
  });
};

userRouter.use("/login", async (req, res, next) => {
  try {
    await loginSchema.validate(req.body);
    const username = decryptRSA(req.body?.username)
    const password = decryptRSA(req.body?.password)

    const findUser = await prisma.user.findUnique({
      where: { username },
    });
    if (!findUser) throw new Error(JSON.stringify({ statusCode: "400", message: "User not found" }))

    const checkPw = await bcrypt.compare(password, findUser!.password);
    if (!checkPw) throw new Error(JSON.stringify({ statusCode: "400", message: "incorrect Password" }))

    const token = createToken({
      username: findUser!.username,
      name: findUser!.name,
    });
    res.status(200).json({ statusCode: "200", token })
  } catch (error: any) {
    httpCatchError({error, res})
  }
});

export default userRouter;
