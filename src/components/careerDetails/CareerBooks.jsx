function CareerBooks({ books = [] }) {
  if (!Array.isArray(books) || books.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          📖 Recommended Books
        </h2>

        <p className="text-gray-500 mt-2">
          Books that can help you build the knowledge required for this career.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => {
          const title =
            typeof book === "string"
              ? book
              : book?.title || `Book ${index + 1}`;

          const author =
            typeof book === "object"
              ? book?.author || ""
              : "";

          const category =
            typeof book === "object"
              ? book?.category || ""
              : "";

          const url =
            typeof book === "object"
              ? book?.url ||
                book?.link ||
                book?.bookUrl ||
                ""
              : "";

          const content = (
            <>
              <div className="text-3xl mb-4">
                📚
              </div>

              <h3 className="font-bold text-lg text-slate-800">
                {title}
              </h3>

              {author && (
                <p className="text-gray-600 mt-2">
                  By {author}
                </p>
              )}

              {category && (
                <span
                  className="
                    inline-block
                    mt-4
                    bg-blue-100
                    text-blue-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
                  "
                >
                  {category}
                </span>
              )}
            </>
          );

          return url ? (
            <a
              key={
                typeof book === "object"
                  ? book?.id || title
                  : `${title}-${index}`
              }
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                bg-white
                rounded-2xl
                shadow-lg
                border
                border-gray-100
                p-6
                hover:shadow-xl
                hover:-translate-y-1
                transition
                block
              "
            >
              {content}

              <div className="mt-6">
                <span className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                  View Book →
                </span>
              </div>
            </a>
          ) : (
            <div
              key={
                typeof book === "object"
                  ? book?.id || title
                  : `${title}-${index}`
              }
              className="
                bg-white
                rounded-2xl
                shadow-lg
                border
                border-gray-100
                p-6
                hover:shadow-xl
                transition
              "
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CareerBooks;