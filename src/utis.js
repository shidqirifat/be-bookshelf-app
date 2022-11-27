const books = require('./books');

const getBookById = (id) => books.find((book) => book.id === id);

const getIndexBookById = (id) => books.findIndex((book) => book.id === id);

const filterBookByQuery = (query, field) => Boolean(Number(query)) === field;

const searchBookByName = (keyword, name) => name.toLowerCase().includes(keyword.toLowerCase());

module.exports = {
  getBookById, getIndexBookById, filterBookByQuery, searchBookByName,
};
