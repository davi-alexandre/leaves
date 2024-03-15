/* eslint-disable */
import { get, has, set } from '../../accessors.js';
import { Author, Book, Chapter } from './Book.js';
import { test, expect, beforeEach } from 'vitest';
import data from './book.json' assert { type: 'json' };
import LeafPath from '../../types/LeafPath.js';

let book: Book;
const p = <const T extends LeafPath<Book>>(x: T) => x;

beforeEach(() => {
  book = new Book(data.title)
    .setYear(data.year)
    .setAuthor((book) => new Author(data.author).setBooks([book]))
    .setChapters((book) =>
      data.chapters.map((title) => new Chapter(book).setTitle(title)),
    );
});

test('accessors', () => {
  const path = p('author.books[].chapters[].author.id');
  console.log(book.author?.books[0].chapters[0].author?.id);
  let prevValue;
  const newValue = 2;
  if (has(book, path)) prevValue = get(book, path);
  expect(prevValue).not.toBeUndefined();
  set(book, [path, newValue]);
  expect(has(book, path)).toBe(true);
  expect(get(book, path)).toBe(newValue);
});
