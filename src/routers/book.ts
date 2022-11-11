import express from "express";
import { httpCatchError } from "../helpers/httpCatchError";
import { saveFile } from "../helpers/saveFile";
import { addBookSchema, deleteBookSchema, updateBookSchema } from "../helpers/validationSchemas";
import { auth } from "../middlewares/auth";
import { prisma } from "../prismaClient";
import fs from "fs"

const BookRouter = express.Router();

BookRouter.use("/get", async (req, res) => {
  const bookId = req.body.bookId
  if (bookId) {
    const findBook = await prisma.book.findUnique({ where: { id: bookId } });
    res.send({ statusCode: "200", data: findBook })
  } else {
    const findBook = await prisma.book.findMany()
    res.send({ statusCode: "200", data: findBook })
  }
});

BookRouter.use("/add", auth, async (req, res) => {
  try {
    await addBookSchema.validate(req.body);
    const { pathFile } = await saveFile({ dir: "/public/uploads/books", file: req.body.cover, name: `${new Date().getTime()}-${req.body?.title}`, limit: 1048576 })
    const addBook = await prisma.book.create({
      data: {
        title: req.body.title || undefined,
        authorName: req.body.authorName || undefined,
        price: req.body.price || undefined,
        description: req.body.description || undefined,
        coverUrl: pathFile || undefined,
        status: req.body.status || undefined,
        publisher: req.body.publisher || undefined
      }
    })
    res.json({ status: "200", data: addBook })
  } catch (error) {
    httpCatchError({ error, res })
  }
});

BookRouter.use("/delete", auth, async (req, res) => {
  try {
    await deleteBookSchema.validate(req.body);
    const deleteBook = await prisma.book.delete({ where: { id: req.body?.bookId } })
    if (deleteBook?.coverUrl) fs.unlinkSync(`${process.cwd()}/public${deleteBook?.coverUrl}`);
    res.json({ status: "200", data: deleteBook })
  } catch (error) {
    httpCatchError({ error, res })
  }
});

BookRouter.use("/update", auth, async (req, res) => {
  try {
    await updateBookSchema.validate(req.body);
    const findBook = await prisma.book.findUnique({ where: { id: req.body.bookId } })
    let pathFile = undefined;
    if (req.body.cover) {
      saveFile({ dir: "/public/uploads/books", file: req.body.cover, name: `${new Date().getTime()}-${findBook?.title}` as string, limit: 1048576 })
        .then(({ pathFile: path }) => pathFile = path)
    }
    const updateBook = await prisma.book.update({
      where: { id: req.body?.bookId },
      data: {
        title: req.body?.title || undefined,
        authorName: req.body?.authorName || undefined,
        price: req.body?.price || undefined,
        description: req.body?.description || undefined,
        coverUrl: pathFile || undefined,
        status: req.body.status || undefined,
        publisher: req.body.publisher || undefined
      }
    })
    res.json({ status: "200", data: updateBook })
  } catch (error) {
    httpCatchError({ error, res })
  }
});

export default BookRouter;
