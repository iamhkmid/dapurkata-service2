import { prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"];
    if (!token) throw new Error("Token not found")
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const findUser = await prisma.user.findUnique({
      where: { username: (<any>decoded)["username"] }
    });
    if (!findUser) throw new Error("User not found")
    next()
  } catch (error: any) {
    res.status(401).send({
      statusCode: "401",
      message: error?.message
    })
  }
}