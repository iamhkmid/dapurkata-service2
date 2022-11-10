import express from 'express'
import BookRouter from './routers/book';
import userRouter from './routers/user';
import cors from "cors"

const PORT = parseInt(process.env.PORT || "3000");

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "*" }));

app.use("/book", BookRouter)
app.use("/user", userRouter)

app.listen(PORT, () => console.log(`🚀 Server ready at: http://localhost:${PORT}`))