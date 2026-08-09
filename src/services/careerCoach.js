const careerAdvice = {

    "Frontend Developer": {

        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Tailwind CSS",
            "Redux",
            "REST API"
        ],

        projects: [
            "E-Commerce Website",
            "Netflix Clone",
            "Portfolio Website",
            "Resume Builder",
            "CareerOS"
        ],

        certifications: [
            "Meta Frontend Developer",
            "Google UX",
            "JavaScript Algorithms"
        ],

        salary: "₹5 LPA - ₹18 LPA",

        roadmap: [

            "Master HTML & CSS",

            "Learn JavaScript",

            "React",

            "Redux",

            "Next.js",

            "Portfolio",

            "Interview Preparation"

        ]

    },

    "Full Stack Developer": {

        skills: [

            "React",

            "Node.js",

            "Express",

            "MongoDB",

            "SQL",

            "REST API",

            "JWT"

        ],

        projects: [

            "Hospital Management",

            "CareerOS",

            "Chat App",

            "Food Delivery"

        ],

        certifications: [

            "AWS Cloud Practitioner",

            "Meta Full Stack"

        ],

        salary: "₹6 LPA - ₹25 LPA",

        roadmap: [

            "Frontend",

            "Backend",

            "Database",

            "Authentication",

            "Deployment"

        ]

    }

};

export function getCareerAdvice(role) {

    return careerAdvice[role] || null;

}