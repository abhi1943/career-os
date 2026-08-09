function CareerBooks({ books }) {
  if (!books?.length) return null;

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold mb-8">
        📖 Recommended Books
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {books.map((book) => (
          <div
            key={book.title}
            className="bg-white rounded-xl shadow p-6"
          >
            <h3 className="font-bold text-lg">
              {book.title}
            </h3>

            <p className="text-gray-600 mt-2">
              {book.author}
            </p>

            <span className="inline-block mt-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              {book.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CareerBooks;