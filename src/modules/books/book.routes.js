import { Router } from "express";
import { createBook, deleteBookById, getAllBooks, getAllBooksPaginated, getBookById, searchBooks, updateBookById } from "./book.controller.js";

const router = Router();


router.post('/', createBook);
router.get('/', getAllBooks);
router.get('/book/:id', getBookById);
router.patch('/:id', updateBookById);
router.delete('/:id', deleteBookById);
router.get('/search', searchBooks); 
router.get('/paginated', getAllBooksPaginated);
export default router;