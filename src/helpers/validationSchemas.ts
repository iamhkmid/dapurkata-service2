import * as yup from "yup"


export const loginSchema = yup.object({
  username: yup.string().required("username is a required field"),
  password: yup.string().required("password is a required field"),
});

export const addBookSchema = yup.object({
  title: yup.string().required("title is a required field"),
  authorName: yup.string().required("authorName is a required field"),
  price: yup.number().required("price is a required field"),
  publisher: yup.string().required("description is a required field"),
  status: yup.string().required("description is a required field"),
});

export const deleteBookSchema = yup.object({
  bookId: yup.string().required("bookId is a required field")
});

export const updateBookSchema = yup.object({
  bookId: yup.string().required("bookId is a required field")
});