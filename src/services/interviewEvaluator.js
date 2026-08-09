export function evaluateInterviewAnswer(question, answer) {

    let score = 100;

    const suggestions = [];

    if (!answer || answer.trim().length < 50) {

        score -= 30;

        suggestions.push(
            "Answer is too short."
        );

    }

    if (answer.length > 600) {

        score -= 10;

        suggestions.push(
            "Try to be more concise."
        );

    }

    const keywords = [

        "React",
        "JavaScript",
        "Spring",
        "Java",
        "SQL",
        "Git",
        "Project",
        "Team"

    ];

    let matched = 0;

    keywords.forEach(keyword => {

        if (
            answer.toLowerCase().includes(
                keyword.toLowerCase()
            )
        ) {

            matched++;

        }

    });

    score += matched * 2;

    if (matched < 2) {

        suggestions.push(
            "Include more technical keywords."
        );

    }

    if (
        !answer.toLowerCase().includes("experience")
    ) {

        suggestions.push(
            "Mention practical experience."
        );

    }

    return {

        score: Math.min(100, score),

        suggestions

    };

}