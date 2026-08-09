import database from "../data";
import professions from "../data/professions";
import { recommendCareers } from "./recommendCareers";

const allCareers = [
  ...Object.values(database).flat(),
  ...professions,
];

export function getBotReply(question, student = null) {
  const q = question.toLowerCase();

  // Greeting
  if (
    q.includes("hi") ||
    q.includes("hello") ||
    q.includes("hey")
  ) {
    return "👋 Hello! I'm your CareerOS AI Mentor. Ask me about careers, colleges, exams, salaries or your future career.";
  }

  // Personalized recommendation
  if (
    student &&
    (
      q.includes("recommend") ||
      q.includes("best career") ||
      q.includes("suggest") ||
      q.includes("career for me")
    )
  ) {

    const recommendations = recommendCareers(student);

    const top = recommendations[0];

    return `🎯 Based on your profile, I recommend **${top.name}**.

✅ Match Score: ${top.score}%

📚 Education: ${student.education}

❤️ Interest: ${student.interest}

🚀 Growth: ${top.growth || "Excellent"}

💰 Average Salary: ${top.averageSalary || "N/A"}

Keep learning the required skills and build projects to increase your chances.`;
  }

  // Dream career
  if (
    student &&
    q.includes("can i become")
  ) {

    const career = allCareers.find(item =>
      q.includes(item.name.toLowerCase())
    );

    if (career) {

      const recommendations =
        recommendCareers(student);

      const found =
        recommendations.find(c =>
          c.id === career.id
        );

      return `Yes! You can become a ${career.name}.

Current Match:
${found?.score || 0}%

Recommended Skills:
${career.skills?.join(", ")}

Average Salary:
${career.averageSalary}

Growth:
${career.growth}`;
    }
  }

  // Career details
  const career = allCareers.find(item =>
    q.includes(item.name.toLowerCase())
  );

  if (career) {

    return `🎓 ${career.name}

📚 Duration:
${career.duration}

✅ Eligibility:
${career.eligibility}

💰 Salary:
${career.averageSalary || "Not Available"}

📈 Growth:
${career.growth || "High"}

📝 ${career.description}`;
  }

  // Companies
  if (
    q.includes("company") ||
    q.includes("companies")
  ) {

    return "🏢 Visit the Companies section to explore Google, Microsoft, Amazon, TCS, Infosys, Accenture and many more.";
  }

  // Colleges
  if (
    q.includes("college")
  ) {

    return "🏫 Visit the Colleges section to explore top colleges according to your career.";
  }

  // Exams
  if (
    q.includes("exam")
  ) {

    return "📚 Explore JEE, NEET, CUET, EAPCET, SSC, UPSC, GATE and many more in the Exams section.";
  }

  // Salary
  if (
    q.includes("salary")
  ) {

    return "💰 Ask me about a specific career like Software Engineer, AI Engineer or Data Scientist to know salary details.";
  }

  // Roadmap
  if (
    q.includes("roadmap")
  ) {

    return "🗺 Every career has a detailed roadmap inside CareerOS. Open any career page and click the Roadmap tab.";
  }

  return "🤖 I couldn't understand that. Try asking:\n\n• Recommend a career\n• Can I become a Software Engineer?\n• Best career for me\n• Salary of AI Engineer\n• Top colleges\n• Entrance exams";
}