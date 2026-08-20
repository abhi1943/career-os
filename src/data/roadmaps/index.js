import cseRoadmap from "./cse";
import aiEngineerRoadmap from "./aiEngineer";
import dataScientistRoadmap from "./dataScientist";
import frontendDeveloperRoadmap from "./frontendDeveloper";
import fullStackDeveloperRoadmap from "./fullStackDeveloper";

const careerRoadmaps = {
  cse: cseRoadmap,

  aiml: aiEngineerRoadmap,

  datascience: dataScientistRoadmap,

  cybersecurity: [
    {
      id: "networking",
      title: "Networking Fundamentals",
      duration: "1-2 Months",
      skills: [
        "Computer Networks",
        "TCP/IP",
        "DNS",
        "HTTP",
        "Network Security",
      ],
    },

    {
      id: "linux",
      title: "Linux & Systems",
      duration: "1 Month",
      skills: [
        "Linux",
        "Command Line",
        "File Permissions",
        "Shell Scripting",
      ],
    },

    {
      id: "security",
      title: "Cyber Security Fundamentals",
      duration: "2-3 Months",
      skills: [
        "Cyber Security",
        "Cryptography",
        "Authentication",
        "Network Security",
        "Web Security",
      ],
    },

    {
      id: "ethical-hacking",
      title: "Ethical Hacking",
      duration: "2-3 Months",
      skills: [
        "Ethical Hacking",
        "Penetration Testing",
        "Vulnerability Assessment",
        "OWASP",
      ],
    },

    {
      id: "projects",
      title: "Security Projects",
      duration: "1-2 Months",
      skills: [
        "Network Scanner",
        "Phishing Detection",
        "Vulnerability Scanner",
        "Security Monitoring",
      ],
    },

    {
      id: "certifications",
      title: "Security Certifications",
      duration: "1-3 Months",
      skills: [
        "CompTIA Security+",
        "CEH",
        "CISSP",
      ],
    },

    {
      id: "placement",
      title: "Placement Preparation",
      duration: "1-2 Months",
      skills: [
        "Security Interviews",
        "Networking Interviews",
        "Technical Interviews",
        "HR Interviews",
      ],
    },
  ],

  "frontend-developer": frontendDeveloperRoadmap,

  "full-stack-developer": fullStackDeveloperRoadmap,
};

export default careerRoadmaps;