function AIResponse({ message, sender }) {
  return (
    <div
      className={`flex ${
        sender === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-xl rounded-2xl px-5 py-4 shadow-md ${
          sender === "user"
            ? "bg-blue-600 text-white"
            : "bg-white border"
        }`}
      >
        {message}
      </div>
    </div>
  );
}

export default AIResponse;