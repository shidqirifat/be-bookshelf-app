const { nanoid } = require('nanoid');
const {
  getBookById, searchBookByName, filterBookByQuery, getIndexBookById,
} = require('./utis');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name || readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: `Gagal menambahkan buku. ${!name ? 'Mohon isi nama buku' : 'readPage tidak boleh lebih besar dari pageCount'}`,
    });

    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  books.push({
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  });

  const isSuccess = getBookById(id);

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: id },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllBooksHandler = (request) => {
  const { name, reading, finished } = request.query;

  const foundBooks = books.filter((book) => {
    let isMatch = true;

    if (name) isMatch = searchBookByName(name, book.name);
    if (reading) isMatch = filterBookByQuery(reading, book.reading);
    if (finished) isMatch = filterBookByQuery(finished, book.finished);

    return isMatch;
  });

  const responseBooks = foundBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return {
    status: 'success',
    data: { books: responseBooks },
  };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const detailBook = getBookById(id);

  if (detailBook) {
    return {
      status: 'success',
      data: { book: detailBook },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name || readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: `Gagal memperbarui buku. ${!name ? 'Mohon isi nama buku' : 'readPage tidak boleh lebih besar dari pageCount'}`,
    });

    response.code(400);
    return response;
  }

  const index = getIndexBookById(id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: new Date().toISOString(),
    };

    return {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = getIndexBookById(id);

  if (index !== -1) {
    books.splice(index, 1);

    return {
      status: 'success',
      message: 'Buku berhasil dihapus',
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
