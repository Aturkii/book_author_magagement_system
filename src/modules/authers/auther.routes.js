import { Router } from "express";
import { createAuthor, deleteAuthorById, getAllAuthors, getAllAuthorsPaginated, getAuthorById, searchAuthors, updateAuthorById } from './author.controller.js';

const router = Router();

router.post('/', createAuthor);
router.get('/', getAllAuthors);
router.get('/author/:id', getAuthorById);
router.patch('/:id', updateAuthorById);
router.delete('/:id', deleteAuthorById);
router.get('/search', searchAuthors);
router.get('/paginated', getAllAuthorsPaginated);

export default router;