const books = [
// ======================================================
// SOFTWARE / PROGRAMMING
// ======================================================

{
id: "clean-code",
title: "Clean Code",
author: "Robert C. Martin",
category: "Programming",
url: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/",
},

{
id: "you-dont-know-js",
title: "You Don't Know JS",
author: "Kyle Simpson",
category: "JavaScript",
url: "https://github.com/getify/You-Dont-Know-JS",
},

{
id: "eloquent-javascript",
title: "Eloquent JavaScript",
author: "Marijn Haverbeke",
category: "JavaScript",
url: "https://eloquentjavascript.net/",
},

{
id: "effective-java",
title: "Effective Java",
author: "Joshua Bloch",
category: "Java",
url: "https://www.pearson.com/en-us/subject-catalog/p/effective-java/P200000003132",
},

{
id: "head-first-java",
title: "Head First Java",
author: "Kathy Sierra and Bert Bates",
category: "Java",
url: "https://www.oreilly.com/library/view/head-first-java/9781492091646/",
},

{
id: "python-crash-course",
title: "Python Crash Course",
author: "Eric Matthes",
category: "Python",
url: "https://nostarch.com/python-crash-course-3rd-edition",
},

{
id: "automate-boring-stuff",
title: "Automate the Boring Stuff with Python",
author: "Al Sweigart",
category: "Python",
url: "https://automatetheboringstuff.com/",
},

{
id: "cracking-coding-interview",
title: "Cracking the Coding Interview",
author: "Gayle McDowell",
category: "DSA",
url: "https://www.crackingthecodinginterview.com/",
},

{
id: "data-structures-algorithms",
title: "Data Structures and Algorithms Made Easy",
author: "Narasimha Karumanchi",
category: "DSA",
url: "https://www.amazon.com/",
},

// ======================================================
// SYSTEM DESIGN / SOFTWARE ARCHITECTURE
// ======================================================

{
id: "designing-data-intensive-applications",
title: "Designing Data-Intensive Applications",
author: "Martin Kleppmann",
category: "System Design",
url: "https://dataintensive.net/",
},

{
id: "system-design-interview",
title: "System Design Interview",
author: "Alex Xu",
category: "System Design",
url: "https://www.educative.io/",
},

{
id: "patterns-of-enterprise-application-architecture",
title: "Patterns of Enterprise Application Architecture",
author: "Martin Fowler",
category: "Software Architecture",
url: "https://martinfowler.com/books/eaa.html",
},

// ======================================================
// FRONTEND / WEB DEVELOPMENT
// ======================================================

{
id: "learning-web-design",
title: "Learning Web Design",
author: "Jennifer Robbins",
category: "Frontend",
url: "https://www.oreilly.com/library/view/learning-web-design/9781098137649/",
},

{
id: "javascript-definitive-guide",
title: "JavaScript: The Definitive Guide",
author: "David Flanagan",
category: "JavaScript",
url: "https://www.oreilly.com/library/view/javascript-the-definitive/9781491952016/",
},

{
id: "css-definitive-guide",
title: "CSS: The Definitive Guide",
author: "Eric A. Meyer and Estelle Weyl",
category: "CSS",
url: "https://www.oreilly.com/library/view/css-the-definitive/9781098117613/",
},

// ======================================================
// BACKEND / DATABASE
// ======================================================

{
id: "spring-in-action",
title: "Spring in Action",
author: "Craig Walls",
category: "Spring Boot",
url: "https://www.manning.com/books/spring-in-action-sixth-edition",
},

{
id: "high-performance-mysql",
title: "High Performance MySQL",
author: "Baron Schwartz",
category: "SQL Database",
url: "https://www.oreilly.com/library/view/high-performance-mysql/9781492080503/",
},

{
id: "sql-cookbook",
title: "SQL Cookbook",
author: "Anthony Molinaro",
category: "SQL",
url: "https://www.oreilly.com/library/view/sql-cookbook-2nd/9781492077435/",
},

// ======================================================
// AI / MACHINE LEARNING
// ======================================================

{
id: "hands-on-machine-learning",
title: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
author: "Aurélien Géron",
category: "Machine Learning",
url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125974/",
},

{
id: "pattern-recognition-machine-learning",
title: "Pattern Recognition and Machine Learning",
author: "Christopher M. Bishop",
category: "Machine Learning",
url: "https://www.microsoft.com/en-us/research/people/cmbishop/",
},

{
id: "deep-learning",
title: "Deep Learning",
author: "Ian Goodfellow, Yoshua Bengio, and Aaron Courville",
category: "Deep Learning",
url: "https://www.deeplearningbook.org/",
},

{
id: "artificial-intelligence-modern-approach",
title: "Artificial Intelligence: A Modern Approach",
author: "Stuart Russell and Peter Norvig",
category: "Artificial Intelligence",
url: "https://aima.cs.berkeley.edu/",
},

// ======================================================
// DATA SCIENCE / DATA ANALYTICS
// ======================================================

{
id: "python-data-analysis",
title: "Python for Data Analysis",
author: "Wes McKinney",
category: "Data Analysis",
url: "https://wesmckinney.com/book/",
},

{
id: "practical-statistics-data-scientists",
title: "Practical Statistics for Data Scientists",
author: "Peter Bruce, Andrew Bruce, and Peter Gedeck",
category: "Statistics",
url: "https://www.oreilly.com/library/view/practical-statistics-for/9781492072935/",
},

{
id: "data-science-handbook",
title: "The Data Science Handbook",
author: "Field Cady",
category: "Data Science",
url: "https://www.oreilly.com/library/view/the-data-science/9781119092942/",
},

{
id: "storytelling-with-data",
title: "Storytelling with Data",
author: "Cole Nussbaumer Knaflic",
category: "Data Visualization",
url: "https://www.storytellingwithdata.com/",
},

// ======================================================
// BUSINESS ANALYSIS / RESEARCH
// ======================================================

{
id: "business-analysis-body-knowledge",
title: "A Guide to the Business Analysis Body of Knowledge",
author: "IIBA",
category: "Business Analysis",
url: "https://www.iiba.org/standards-and-resources/babok/",
},

{
id: "business-analysis-techniques",
title: "Business Analysis Techniques",
author: "James Cadle, Donald Yeates, and Alex Houghton",
category: "Business Analysis",
url: "https://www.bcs.org/",
},

{
id: "research-design",
title: "Research Design",
author: "John W. Creswell and J. David Creswell",
category: "Research",
url: "https://us.sagepub.com/",
},

{
id: "market-research-handbook",
title: "The Market Research Toolbox",
author: "Edward F. McQuarrie",
category: "Market Research",
url: "https://us.sagepub.com/",
},

// ======================================================
// CLOUD / DEVOPS
// ======================================================

{
id: "aws-certified-solutions-architect",
title: "AWS Certified Solutions Architect Study Guide",
author: "Ben Piper and David Clinton",
category: "AWS Cloud",
url: "https://www.sybex.com/",
},

{
id: "terraform-up-and-running",
title: "Terraform: Up & Running",
author: "Yevgeniy Brikman",
category: "Cloud DevOps",
url: "https://www.terraformupandrunning.com/",
},

{
id: "kubernetes-up-and-running",
title: "Kubernetes: Up and Running",
author: "Brendan Burns, Joe Beda, and Kelsey Hightower",
category: "Kubernetes",
url: "https://www.oreilly.com/library/view/kubernetes-up-and/9781098110192/",
},

{
id: "docker-deep-dive",
title: "Docker Deep Dive",
author: "Nigel Poulton",
category: "Docker",
url: "https://www.nigelpoulton.com/",
},

// ======================================================
// CYBER SECURITY
// ======================================================

{
id: "web-application-hackers-handbook",
title: "The Web Application Hacker's Handbook",
author: "Dafydd Stuttard and Marcus Pinto",
category: "Cybersecurity",
url: "https://portswigger.net/web-security",
},

{
id: "practical-malware-analysis",
title: "Practical Malware Analysis",
author: "Michael Sikorski and Andrew Honig",
category: "Cybersecurity",
url: "https://nostarch.com/malware",
},

{
id: "computer-security-principles",
title: "Computer Security: Principles and Practice",
author: "William Stallings and Lawrie Brown",
category: "Security",
url: "https://www.pearson.com/",
},

// ======================================================
// MOBILE DEVELOPMENT
// ======================================================

{
id: "flutter-complete-reference",
title: "Flutter Complete Reference",
author: "Alessandro Biessek",
category: "Flutter Mobile Development",
url: "https://flutter.dev/",
},

{
id: "android-programming-big-nerd-ranch",
title: "Android Programming: The Big Nerd Ranch Guide",
author: "Bill Phillips, Chris Stewart, and Kristin Marsicano",
category: "Android",
url: "https://www.bignerdranch.com/",
},

{
id: "react-native-in-action",
title: "React Native in Action",
author: "Nader Dabit",
category: "React Native",
url: "https://www.manning.com/",
},

// ======================================================
// UI / UX DESIGN
// ======================================================

{
id: "dont-make-me-think",
title: "Don't Make Me Think",
author: "Steve Krug",
category: "UI UX Design",
url: "https://sensible.com/dont-make-me-think/",
},

{
id: "design-of-everyday-things",
title: "The Design of Everyday Things",
author: "Don Norman",
category: "UX Design",
url: "https://jnd.org/books/the-design-of-everyday-things-revised-and-expanded/",
},

{
id: "refactoring-ui",
title: "Refactoring UI",
author: "Adam Wathan and Steve Schoger",
category: "UI Design",
url: "https://www.refactoringui.com/",
},

// ======================================================
// SOFTWARE TESTING / QA
// ======================================================

{
id: "agile-testing",
title: "Agile Testing",
author: "Lisa Crispin and Janet Gregory",
category: "Software Testing",
url: "https://agiletester.ca/",
},

{
id: "effective-software-testing",
title: "Effective Software Testing",
author: "Elisabeth Hendrickson",
category: "Testing",
url: "https://www.pearson.com/",
},

{
id: "test-automation-university",
title: "Test Automation",
author: "Various Authors",
category: "Test Automation",
url: "https://testautomationu.applitools.com/",
},

// ======================================================
// FINANCE / PERSONAL DEVELOPMENT
// ======================================================

{
id: "psychology-of-money",
title: "The Psychology of Money",
author: "Morgan Housel",
category: "Finance",
url: "https://www.morganhousel.com/the-psychology-of-money",
},

{
id: "accounting-made-simple",
title: "Accounting Made Simple",
author: "Mike Piper",
category: "Accounting",
url: "https://obliviousinvestor.com/",
},

{
id: "atomic-habits",
title: "Atomic Habits",
author: "James Clear",
category: "Personal Development",
url: "https://jamesclear.com/atomic-habits",
},

// ======================================================
// COMPETITIVE EXAMS / GENERAL SKILLS
// ======================================================

{
id: "objective-general-english",
title: "Objective General English",
author: "S.O. Bakshi",
category: "English",
url: "https://www.rphbooks.com/",
},

{
id: "quantitative-aptitude",
title: "Quantitative Aptitude for Competitive Examinations",
author: "R.S. Aggarwal",
category: "Aptitude",
url: "https://www.rphbooks.com/",
},

{
id: "lucents-general-knowledge",
title: "Lucent's General Knowledge",
author: "Lucent Publications",
category: "General Knowledge",
url: "https://lucentpublication.com/",
},
];

export default books;
