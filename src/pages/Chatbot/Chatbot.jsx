import { useContext, useState } from "react";
import {
  Bot,
  Send,
  User,
  Loader2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { askCareerMentor } from "../../services/aiService";
import { CareerContext } from "../../context/CareerContext";

function Chatbot() {
  const [question, setQuestion] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    failedQuestion,
    setFailedQuestion,
  ] = useState("");

  const [searchParams] =
    useSearchParams();

  const careerId =
    searchParams.get("career");

  const { student } =
    useContext(CareerContext);

  const [messages, setMessages] =
    useState([
      {
        sender: "bot",
        text:
          "👋 Hi! I'm CareerOS AI Mentor. Ask me anything about careers, colleges, entrance exams, or jobs.",
      },
    ]);

  /* ======================================================
     SEND MESSAGE
  ====================================================== */

  const handleSend = async (
    retryQuestion = null
  ) => {
    const userQuestion =
      typeof retryQuestion === "string"
        ? retryQuestion.trim()
        : question.trim();

    if (!userQuestion || isLoading) {
      return;
    }

    setError("");
    setFailedQuestion("");
    setIsLoading(true);

    const userMessage = {
      sender: "user",
      text: userQuestion,
    };

    setMessages(
      (previousMessages) => [
        ...previousMessages,
        userMessage,
      ]
    );

    setQuestion("");

    try {
      const botReply =
        await askCareerMentor(
          userQuestion,
          student,
          careerId
        );

      /*
         Make sure the UI always receives
         something displayable.
      */

      const safeReply =
        typeof botReply === "string"
          ? botReply
          : botReply
            ? String(botReply)
            : "Sorry, I couldn't generate a response right now.";

      const botMessage = {
        sender: "bot",
        text: safeReply,
      };

      setMessages(
        (previousMessages) => [
          ...previousMessages,
          botMessage,
        ]
      );
    } catch (requestError) {
      console.error(
        "CareerOS AI Mentor error:",
        requestError
      );

      setError(
        "Sorry, something went wrong while contacting the AI Mentor."
      );

      setFailedQuestion(
        userQuestion
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ======================================================
     RETRY FAILED REQUEST
  ====================================================== */

  const handleRetry = () => {
    if (
      !failedQuestion ||
      isLoading
    ) {
      return;
    }

    /*
       Remove the failed user's previous
       message before retrying so the same
       question is not duplicated in the chat.
    */

    setMessages(
      (previousMessages) => {
        const updatedMessages = [
          ...previousMessages,
        ];

        const lastMessage =
          updatedMessages[
            updatedMessages.length - 1
          ];

        if (
          lastMessage?.sender === "user" &&
          lastMessage?.text ===
            failedQuestion
        ) {
          updatedMessages.pop();
        }

        return updatedMessages;
      }
    );

    setError("");

    handleSend(failedQuestion);
  };

  return (
    <div className="bg-slate-100 min-h-screen py-10 px-4">

      <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="bg-blue-600 text-white p-6">

          <h1 className="text-3xl font-bold">
            CareerOS AI Mentor
          </h1>

          <p className="text-blue-100 mt-2">
            Your personalized career guidance assistant.
          </p>

        </div>

        {/* ==================================================
            CHAT
        ================================================== */}

        <div
          className="h-[500px] overflow-y-auto overflow-x-hidden p-6 space-y-5 bg-slate-50"
        >

          {messages.map(
            (message, index) => (

              <div
                key={index}
                className={`flex w-full min-w-0 ${
                  message.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`flex min-w-0 max-w-[85%] sm:max-w-lg p-4 rounded-2xl gap-3 overflow-hidden ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white shadow"
                  }`}
                >

                  {message.sender === "bot" ? (
                    <Bot
                      className="text-blue-600 shrink-0 mt-1"
                      size={22}
                    />
                  ) : (
                    <User
                      className="shrink-0 mt-1"
                      size={22}
                    />
                  )}

                  <p
                    className="min-w-0 max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed"
                  >
                    {message.text}
                  </p>

                </div>

              </div>

            )
          )}

          {/* ==================================================
              TYPING / LOADING INDICATOR
          ================================================== */}

          {isLoading && (
            <div className="flex w-full justify-start">

              <div className="flex items-center gap-3 bg-white shadow p-4 rounded-2xl">

                <Bot
                  className="text-blue-600 shrink-0"
                  size={22}
                />

                <div className="flex items-center gap-2">

                  <Loader2
                    className="animate-spin text-blue-600"
                    size={18}
                  />

                  <span className="text-slate-600">
                    Mentor is typing...
                  </span>

                </div>

              </div>

            </div>
          )}

          {/* ==================================================
              ERROR MESSAGE
          ================================================== */}

          {error && (
            <div className="flex w-full justify-start">

              <div className="max-w-[85%] sm:max-w-lg bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">

                <div className="flex gap-3">

                  <AlertCircle
                    className="shrink-0 mt-1"
                    size={20}
                  />

                  <div className="min-w-0">

                    <p className="font-medium">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={isLoading}
                      className="mt-3 inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RotateCcw size={16} />

                      Try Again
                    </button>

                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* ==================================================
            INPUT
        ================================================== */}

        <div className="p-6 border-t bg-white">

          <div className="flex gap-4">

            <input
              type="text"
              placeholder={
                isLoading
                  ? "Mentor is typing..."
                  : "Ask about careers, colleges, exams..."
              }
              className="flex-1 min-w-0 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
              value={question}
              disabled={isLoading}
              onChange={(event) => {
                setQuestion(
                  event.target.value
                );

                if (error) {
                  setError("");
                  setFailedQuestion("");
                }
              }}
              onKeyDown={(event) => {

                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  handleSend();
                }

              }}
            />

            <button
              type="button"
              onClick={() =>
                handleSend()
              }
              disabled={
                isLoading ||
                !question.trim()
              }
              className="shrink-0 bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Send message"
            >

              {isLoading ? (
                <Loader2
                  className="animate-spin"
                  size={22}
                />
              ) : (
                <Send size={22} />
              )}

            </button>

          </div>

          {/* ==================================================
              LOADING STATUS
          ================================================== */}

          {isLoading && (
            <p className="text-sm text-slate-500 mt-3 flex items-center gap-2">

              <Loader2
                className="animate-spin"
                size={14}
              />

              CareerOS AI Mentor is preparing your answer...

            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default Chatbot;