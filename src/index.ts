import express from 'express'
import BookRouter from './routers/book';
import userRouter from './routers/user';
import cors from "cors"
import * as dotenv from 'dotenv'
import mysql from 'mysql'

const PORT = parseInt(process.env.PORT || "3000");

dotenv.config()

const app = express()


export const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MSQL_USER,
  password: process.env.MSQL_PASSWORD,
  database: process.env.MYSQL_DB
});

db.connect();

app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 }))
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.static("public"));

app.use("/book", BookRouter)
app.use("/user", userRouter)

app.listen(PORT, () => console.log(`🚀 Server ready at: http://localhost:${PORT}`))