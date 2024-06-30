
import Author from './../../../db/models/auther.js';

//~ Create a new author
export const createAuthor = async (req, res, next) => {
  try {
    const newAuthor = new Author(req.body);
    const savedAuthor = await newAuthor.save();
    res.status(201).json({ message: "Author saved successfully", author: savedAuthor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//~ Get all authors
export const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find().populate('books');
    res.status(200).json({ message: "success", authors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//~ Get an author by ID
export const getAuthorById = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id).populate('books');
    if (author) {
      res.status(200).json({ message: "success", author });
    } else {
      res.status(404).json({ message: 'Author not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//~ Update an author by ID
export const updateAuthorById = async (req, res, next) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedAuthor) {
      res.status(200).json({ message: "Author updated successfully", updatedAuthor });
    } else {
      res.status(404).json({ message: 'Author not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//~ Delete an author by ID
export const deleteAuthorById = async (req, res, next) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (deletedAuthor) {
      res.status(200).json({ message: 'Author deleted successfully' });
    } else {
      res.status(404).json({ message: 'Author not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//~ Search authors by name or bio
export const searchAuthors = async (req, res, next) => {
  const searchQuery = req.query.search || '';
  console.log('Search query:', searchQuery);

  try {
    const searchCriteria = {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { bio: { $regex: searchQuery, $options: 'i' } }
      ]
    };

    console.log('Search criteria:', searchCriteria);
    const authors = await Author.find(searchCriteria).populate('books');
    console.log('Authors found:', authors);

    res.status(200).json({ message: `Success to search authers with ===>> ${searchQuery}`, authors });
  } catch (error) {
    console.log('Error occurred:', error);
    res.status(500).json({ message: error.message });
  }
};

//~ all authors pagination
export const getAllAuthorsPaginated = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const authors = await Author.find().skip(skip).limit(limit).populate('books');
    const totalAuthors = await Author.countDocuments();
    const totalPages = Math.ceil(totalAuthors / limit);

    res.status(200).json({
      message: "success",
      data: {
        authors,
        totalAuthors,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 