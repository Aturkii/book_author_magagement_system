import express from 'express'
import autherRouter from './src/modules/authers/auther.routes.js';
import bookRouter from './src/modules/books/book.routes.js';
import connectDB from './db/connection.js';
const app = express()
const port = 3000

connectDB()
app.use(express.json())
app.use("/authers", autherRouter)
app.use("/books", bookRouter)
app.get('*', (req, res, next) => res.send('404! Not Found'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))