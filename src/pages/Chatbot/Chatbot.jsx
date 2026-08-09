import { useState } from "react";
import { Bot, Send, User } from "lucide-react";
// import { getAIResponse } from "../../services/aiService";
import { getBotReply } from "../../utils/chatbotEngine";
import { useSearchParams } from "react-router-dom";
import { askCareerAI } from "../../services/aiService";
import { useContext } from "react";
import { CareerContext } from "../../context/CareerContext";

function Chatbot() {
  const [question, setQuestion] = useState("");
  const [searchParams] = useSearchParams();

  const careerId = searchParams.get("career");
  const { student } = useContext(CareerContext);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm CareerOS AI Mentor. Ask me anything about careers, colleges, entrance exams, or jobs.",
    },
  ]);

  const handleSend = () => {
    if (!question.trim()) return;

    const userQuestion = question;

    const userMessage = {
      sender: "user",
      text: userQuestion,
    };

    const botMessage = {
      sender: "bot",
      text: careerId
        ? askCareerAI(careerId, question,student)
        : getBotReply(question,student),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);

    setQuestion("");
  };

  return (
    <div className="bg-slate-100 min-h-screen py-10">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Header */}

        <div className="bg-blue-600 text-white p-6">

          <h1 className="text-3xl font-bold">
            CareerOS AI Mentor
          </h1>

          <p className="text-blue-100 mt-2">
            Your personalized career guidance assistant.
          </p>

        </div>

        {/* Chat */}

        <div className="h-[500px] overflow-y-auto p-6 space-y-5 bg-slate-50">

          {messages.map((message, index) => (

            <div
              key={index}
              className={`flex ${message.sender === "user"
                  ? "justify-end"
                  : "justify-start"
                }`}
            >

              <div
                className={`max-w-lg p-4 rounded-2xl flex gap-3 ${message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white shadow"
                  }`}
              >

                {message.sender === "bot" ? (
                  <Bot className="text-blue-600" />
                ) : (
                  <User />
                )}

                <p>{message.text}</p>

              </div>

            </div>

          ))}

        </div>

        {/* Input */}

        <div className="p-6 border-t bg-white">

          <div className="flex gap-4">

            <input
              type="text"
              placeholder="Ask about careers, colleges, exams..."
              className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />

            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 transition"
            >
              <Send />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Chatbot;