import express from "express";
import { httpCatchError } from "../helpers/httpCatchError";
import { addBookSchema, deleteBookSchema, updateBookSchema } from "../helpers/validationSchemas";
import { auth } from "../middlewares/auth";
import { prisma } from "../prismaClient";

const BookRouter = express.Router();

BookRouter.use("/get", async (req, res, next) => {
  const bookId = req.body.bookId
  if (bookId) {
    const findBook = await prisma.book.findUnique({
      where: { id: bookId }
    });
    res.send({ statusCode: "200", data: findBook })
  } else {
    const findBook = await prisma.book.findMany();
    res.send({ statusCode: "200", data: findBook })
  }
});

BookRouter.use("/add", auth, async (req, res, next) => {
  try {
    await addBookSchema.validate(req.body);
    const addBook = await prisma.book.create({
      data: {
        ...req.body
      }
    })
    res.json({ status: "200", data: addBook })
  } catch (error) {
    httpCatchError({ error, res })
  }
});

BookRouter.use("/delete", auth, async (req, res, next) => {
  try {
    await deleteBookSchema.validate(req.body);
    const deleteBook = await prisma.book.delete({ where: { id: req.body?.bookId } })
    res.json({ status: "200", data: deleteBook })
  } catch (error) {
    httpCatchError({ error, res })
  }
});

BookRouter.use("/update", auth, async (req, res, next) => {
  try {
    await updateBookSchema.validate(req.body);
    const updateBook = await prisma.book.update({
      where: { id: req.body?.bookId },
      data: {
        title: req.body?.title || undefined,
        authorName: req.body?.authorName || undefined,
        price: req.body?.price || undefined,
        description: req.body?.description || undefined
      }
    })
    res.json({ status: "200", data: updateBook })
  } catch (error) {
    httpCatchError({ error, res })
  }
});

export default BookRouter;
