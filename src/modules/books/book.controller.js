
import Author from '../../../db/models/auther.js';
import Book from './../../../db/models/book.js';


//~ Create a new book
export const createBook = async (req, res, next) => {
  const { title, content, authorId } = req.body;

  try {
    const existingAuthor = await Author.findById(authorId);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const newBook = new Book({
      title,
      content,
      authorId,
      publishedDate: req.body.publishedDate || Date.now()
    });

    const savedBook = await newBook.save();

    existingAuthor.books.push(savedBook._id);
    await existingAuthor.save();

    res.status(201).json({ message: "Book saved successfully", book: savedBook });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//~ Get all books
export const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json({ message: "success", books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//~ Get a book by ID
export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.status(200).json({ message: "success", book });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//~ Update a book by ID
export const updateBookById = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const existingBook = await Book.findById(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    existingBook.title = title;
    existingBook.content = content;

    const updatedBook = await existingBook.save();

    res.status(200).json({ message: "book updated successfully", book: updatedBook });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//~ Delete a book by ID
export const deleteBookById = async (req, res, next) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (deletedBook) {
      res.status(200).json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//~ Search books by title or author
export const searchBooks = async (req, res, next) => {
  const searchQuery = req.query.search || '';

  try {
    const searchCriteria = {
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { author: { $regex: searchQuery, $options: 'i' } }
      ]
    };

    const books = await Book.find(searchCriteria);
    if (books) {
      res.status(200).json({ messages: `Success to search books with ==>> ${searchQuery}`, books });
      
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//~ all books with pagination 
export const getAllBooksPaginated = async (req, res, next) => {
  try {
    const page = 1;
    const limit = 5;

    const skip = (page - 1) * limit;

    const books = await Book.find().skip(skip).limit(limit);
    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);

    res.status(200).json({
      message: "success",
      data: {
        books,
        totalBooks,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (error) {
    console.log({ error: error.message });
  }
};