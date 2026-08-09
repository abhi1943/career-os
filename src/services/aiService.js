import database from "../data";
import professions from "../data/professions";
import { getCareerAI } from "../utils/aiEngine";

function contains(text = "", query = "") {
  return text.toLowerCase().includes(query.toLowerCase());
}

export function getAIResponse(question) {
  const query = question.toLowerCase();

  // Search education careers
  for (const category in database) {
    const careers = database[category];

    for (const career of careers) {
      if (
        contains(career.name, query) ||
        contains(career.description, query) ||
        contains(career.id, query)
      ) {
        return `
📘 ${career.name}

📅 Duration: ${career.duration}

✅ Eligibility:
${career.eligibility}

📝 ${career.description}
`;
      }
    }
  }

  // Search professional careers
  for (const career of professions) {
    if (
      contains(career.name, query) ||
      contains(career.description, query) ||
      contains(career.id, query)
    ) {
      return `
💻 ${career.name}

📅 Duration:
${career.duration}

💰 Salary:
${career.averageSalary}

🎯 Eligibility:
${career.eligibility}

📝 ${career.description}
`;
    }
  }

  return `Sorry 😔 I couldn't find information about "${question}".`;
}

export function askCareerAI(careerId, question, student = null) {
  const career = getCareerAI(careerId);

  if (!career)
    return "I don't have information about this career yet.";

  const q = question.toLowerCase();

  // Personalized career match
  if (
    student &&
    (
      q.includes("can i") ||
      q.includes("match") ||
      q.includes("am i suitable") ||
      q.includes("fit")
    )
  ) {

    let score = 0;

    if (
      student.dreamCareer &&
      student.dreamCareer.toLowerCase() ===
      career.name.toLowerCase()
    ) {
      score += 35;
    }

    student.skills?.forEach((skill) => {
      if (
        career.skills?.some(
          (s) => s.toLowerCase() === skill.toLowerCase()
        )
      ) {
        score += 8;
      }
    });

    if (
      student.interest &&
      career.description
        ?.toLowerCase()
        .includes(student.interest.toLowerCase())
    ) {
      score += 20;
    }

    if (score > 100) score = 100;

    return `🎯 Career Match

${career.name}

✅ Match Score: ${score}%

📚 Education: ${student.education}

❤️ Interest: ${student.interest}

🛠 Skills Matched:
${student.skills?.join(", ") || "None"}

Keep learning the required skills to improve your chances.`;
  }

  if (q.includes("roadmap"))
    return career.roadmap.join(" ➜ ");

  if (q.includes("skill"))
    return career.skills.join(", ");

  if (q.includes("interview"))
    return Array.isArray(career.interview)
      ? career.interview.join(", ")
      : "Interview questions are available in the Interview tab.";

  if (q.includes("advice") || q.includes("tip"))
    return career.advice;

  if (q.includes("salary"))
    return career.averageSalary || "Salary information is not available.";

  if (q.includes("company"))
    return career.topCompanies?.join(", ") ||
      "Top companies not available.";

  if (
    q.includes("what") ||
    q.includes("about")
  )
    return career.introduction || career.description;

  return "Ask me about roadmap, skills, interview, salary, companies or ask 'Can I become this?'";
}