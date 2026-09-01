const exams = [

    // ======================================================
    // ENGINEERING
    // ======================================================

    {
        id: "jee-main",
        name: "JEE Main",
        category: "Engineering",
        level: "National",
        eligibility: "12th with Physics, Chemistry and Mathematics",
        mode: "Online",
        duration: "3 Hours",
        conductedBy: "NTA",
        frequency: "Twice a Year",
        description:
            "National engineering entrance examination for admission to NITs, IIITs and other participating institutes and for eligibility for JEE Advanced.",
        status: "Upcoming",
        applicationLink: "https://jeemain.nta.nic.in/",
        officialWebsite: "https://jeemain.nta.nic.in/",
    },

    {
        id: "jee-advanced",
        name: "JEE Advanced",
        category: "Engineering",
        level: "National",
        eligibility: "Qualified JEE Main",
        mode: "Online",
        duration: "6 Hours",
        conductedBy: "IITs",
        frequency: "Once a Year",
        description:
            "National-level examination for admission to undergraduate engineering, science and architecture programs at IITs.",
        status: "Upcoming",
        applicationLink: "https://jeeadv.ac.in/",
        officialWebsite: "https://jeeadv.ac.in/",
    },

    {
        id: "ap-eapcet",
        name: "AP EAPCET",
        category: "Engineering",
        level: "State",
        eligibility: "12th with relevant subjects",
        mode: "Online",
        duration: "3 Hours",
        conductedBy: "APSCHE",
        frequency: "Once a Year",
        description:
            "Andhra Pradesh entrance examination for Engineering, Agriculture and Pharmacy admissions.",
        status: "Upcoming",
        applicationLink: "https://cets.apsche.ap.gov.in/",
        officialWebsite: "https://cets.apsche.ap.gov.in/",
    },

    {
        id: "ts-eapcet",
        name: "TG EAPCET",
        category: "Engineering",
        level: "State",
        eligibility: "12th with relevant subjects",
        mode: "Online",
        duration: "3 Hours",
        conductedBy: "TSCHE",
        frequency: "Once a Year",
        description:
            "Telangana entrance examination for Engineering, Agriculture and Pharmacy admissions.",
        status: "Upcoming",
    },

    {
        id: "mht-cet",
        name: "MHT CET",
        category: "Engineering",
        level: "State",
        eligibility: "12th with PCM/PCB",
        mode: "Online",
        duration: "3 Hours",
        conductedBy: "State CET Cell Maharashtra",
        frequency: "Once a Year",
        description:
            "State-level entrance examination for undergraduate engineering, technology, pharmacy and related programs in Maharashtra.",
        status: "Upcoming",
    },

    {
        id: "k-cet",
        name: "KCET",
        category: "Engineering",
        level: "State",
        eligibility: "12th with relevant subjects",
        mode: "Offline",
        duration: "Multiple Sessions",
        conductedBy: "KEA",
        frequency: "Once a Year",
        description:
            "Karnataka entrance examination for engineering, pharmacy, agriculture and other professional courses.",
        status: "Upcoming",
    },

    {
        id: "wbjee",
        name: "WBJEE",
        category: "Engineering",
        level: "State",
        eligibility: "12th with PCM",
        mode: "Offline",
        duration: "Multiple Papers",
        conductedBy: "WBJEEB",
        frequency: "Once a Year",
        description:
            "West Bengal state entrance examination for undergraduate engineering, technology, architecture and pharmacy programs.",
        status: "Upcoming",
    },

    {
        id: "comedk-uget",
        name: "COMEDK UGET",
        category: "Engineering",
        level: "State",
        eligibility: "12th with PCM",
        mode: "Online",
        duration: "3 Hours",
        conductedBy: "COMEDK",
        frequency: "Once a Year",
        description:
            "Entrance examination for undergraduate engineering programs in participating private engineering colleges in Karnataka.",
        status: "Upcoming",
    },

    {
        id: "ap-ecet",
        name: "AP ECET",
        category: "Engineering",
        level: "State",
        eligibility: "Diploma / B.Sc",
        mode: "Online",
        duration: "3 Hours",
        conductedBy: "APSCHE",
        frequency: "Once a Year",
        description:
            "Andhra Pradesh entrance examination for lateral entry into engineering and pharmacy programs.",
        status: "Upcoming",
        applicationLink: "https://cets.apsche.ap.gov.in/",
        officialWebsite: "https://cets.apsche.ap.gov.in/",
    },


    // ======================================================
    // MEDICAL
    // ======================================================

    {
        id: "neet-ug",
        name: "NEET UG",
        category: "Medical",
        level: "National",
        eligibility: "12th with Physics, Chemistry and Biology",
        mode: "Offline",
        duration: "3 Hours 20 Minutes",
        conductedBy: "NTA",
        frequency: "Once a Year",
        description:
            "National entrance examination for undergraduate medical education including MBBS, BDS and other medical programs.",
        status: "Upcoming",
        applicationLink: "https://neet.nta.nic.in/",
        officialWebsite: "https://neet.nta.nic.in/",
    },

    {
        id: "aiims",
        name: "AIIMS MBBS",
        category: "Medical",
        level: "National",
        eligibility: "12th with PCB",
        mode: "NEET UG",
        duration: "As per NEET UG",
        conductedBy: "NTA",
        frequency: "Once a Year",
        description:
            "Medical admission to AIIMS institutions is based on NEET UG scores.",
        status: "Upcoming",
        applicationLink: "https://neet.nta.nic.in/",
        officialWebsite: "https://neet.nta.nic.in/",
    },


    // ======================================================
    // UNIVERSITY / UG
    // ======================================================

    {
        id: "cuet-ug",
        name: "CUET UG",
        category: "University",
        level: "National",
        eligibility: "12th",
        mode: "Online",
        duration: "Varies",
        conductedBy: "NTA",
        frequency: "Once a Year",
        description:
            "Common University Entrance Test for undergraduate admissions to participating universities across India.",
        status: "Upcoming",
        applicationLink: "https://cuet.nta.nic.in/",
        officialWebsite: "https://cuet.nta.nic.in/",
    },

    {
        id: "cuet-pg",
        name: "CUET PG",
        category: "University",
        level: "National",
        eligibility: "Bachelor's Degree",
        mode: "Online",
        duration: "Varies",
        conductedBy: "NTA",
        frequency: "Once a Year",
        description:
            "Common University Entrance Test for postgraduate admissions to participating universities.",
        status: "Upcoming",
        applicationLink: "https://exams.nta.nic.in/cuet-pg/",
        officialWebsite: "https://exams.nta.nic.in/cuet-pg/",
    },


    // ======================================================
    // MANAGEMENT
    // ======================================================

    {
        id: "cat",
        name: "CAT",
        category: "Management",
        level: "National",
        eligibility: "Bachelor's Degree",
        mode: "Online",
        duration: "2 Hours",
        conductedBy: "IIMs",
        frequency: "Once a Year",
        description:
            "National management entrance examination primarily used for admission to IIMs and other business schools.",
        status: "Upcoming",
    },

    {
        id: "xat",
        name: "XAT",
        category: "Management",
        level: "National",
        eligibility: "Bachelor's Degree",
        mode: "Online",
        duration: "3 Hours",
        conductedBy: "XLRI",
        frequency: "Once a Year",
        description:
            "National management entrance examination accepted by XLRI and numerous business schools.",
        status: "Upcoming",
    },

    {
        id: "cmat",
        name: "CMAT",
        category: "Management",
        level: "National",
        eligibility: "Bachelor's Degree",
        mode: "Online",
        duration: "3 Hours",
        conductedBy: "NTA",
        frequency: "Once a Year",
        description:
            "National-level entrance examination for admission to management programs.",
        status: "Upcoming",
        applicationLink: "https://exams.nta.nic.in/cmat/",
        officialWebsite: "https://exams.nta.nic.in/cmat/",
    },

    {
        id: "mat",
        name: "MAT",
        category: "Management",
        level: "National",
        eligibility: "Bachelor's Degree",
        mode: "Online / Offline",
        duration: "2.5 Hours",
        conductedBy: "AIMA",
        frequency: "Multiple Times a Year",
        description:
            "Management aptitude examination accepted by numerous management institutions.",
        status: "Upcoming",
    },


    // ======================================================
    // LAW
    // ======================================================

    {
        id: "clat",
        name: "CLAT",
        category: "Law",
        level: "National",
        eligibility: "12th for UG / Bachelor's Degree for PG",
        mode: "Offline",
        duration: "2 Hours",
        conductedBy: "Consortium of NLUs",
        frequency: "Once a Year",
        description:
            "Common Law Admission Test for admission to participating National Law Universities.",
        status: "Upcoming",
        applicationLink: "https://consortiumofnlus.ac.in/",
        officialWebsite: "https://consortiumofnlus.ac.in/",
    },

    {
        id: "ailet",
        name: "AILET",
        category: "Law",
        level: "National",
        eligibility: "12th",
        mode: "Online",
        duration: "2 Hours",
        conductedBy: "NLU Delhi",
        frequency: "Once a Year",
        description:
            "Entrance examination for undergraduate and postgraduate law programs at National Law University Delhi.",
        status: "Upcoming",
    },


    // ======================================================
    // ARCHITECTURE
    // ======================================================

    {
        id: "nata",
        name: "NATA",
        category: "Architecture",
        level: "National",
        eligibility: "12th",
        mode: "Online",
        duration: "3 Hours",
        conductedBy: "Council of Architecture",
        frequency: "Multiple Sessions",
        description:
            "National Aptitude Test in Architecture for admission to undergraduate architecture programs.",
        status: "Upcoming",
    },


    // ======================================================
    // DESIGN
    // ======================================================

    {
        id: "uceed",
        name: "UCEED",
        category: "Design",
        level: "National",
        eligibility: "12th",
        mode: "Online",
        duration: "3 Hours",
        conductedBy: "IIT Bombay",
        frequency: "Once a Year",
        description:
            "Entrance examination for undergraduate design programs at participating institutes.",
        status: "Upcoming",
    },

    {
        id: "nift",
        name: "NIFT Entrance Examination",
        category: "Design",
        level: "National",
        eligibility: "12th",
        mode: "Online",
        duration: "Varies",
        conductedBy: "NIFT",
        frequency: "Once a Year",
        description:
            "Entrance examination for undergraduate and postgraduate programs in fashion and design.",
        status: "Upcoming",
    },


    // ======================================================
    // AGRICULTURE
    // ======================================================

    {
        id: "icar-aieea",
        name: "ICAR AIEEA",
        category: "Agriculture",
        level: "National",
        eligibility: "12th",
        mode: "Online",
        duration: "Varies",
        conductedBy: "NTA",
        frequency: "Once a Year",
        description:
            "Entrance examination route for agricultural education and related programs.",
        status: "Upcoming",
    },


    // ======================================================
    // PHARMACY
    // ======================================================

    {
        id: "mht-cet-pharmacy",
        name: "MHT CET Pharmacy",
        category: "Pharmacy",
        level: "State",
        eligibility: "12th with PCB/PCM",
        mode: "Online",
        duration: "3 Hours",
        conductedBy: "State CET Cell Maharashtra",
        frequency: "Once a Year",
        description:
            "Entrance examination for pharmacy and related undergraduate programs in Maharashtra.",
        status: "Upcoming",
    },


    // ======================================================
    // HOTEL MANAGEMENT
    // ======================================================

    {
        id: "nchm-jee",
        name: "NCHM JEE",
        category: "Hotel Management",
        level: "National",
        eligibility: "12th",
        mode: "Online",
        duration: "3 Hours",
        conductedBy: "NTA",
        frequency: "Once a Year",
        description:
            "National entrance examination for admission to hospitality and hotel management programs.",
        status: "Upcoming",
    },


    // ======================================================
    // COMPUTER / PROFESSIONAL
    // ======================================================

    {
        id: "ap-icet",
        name: "AP ICET",
        category: "Management",
        level: "State",
        eligibility: "Bachelor's Degree",
        mode: "Online",
        duration: "2.5 Hours",
        conductedBy: "APSCHE",
        frequency: "Once a Year",
        description:
            "Andhra Pradesh entrance examination for MBA and MCA admissions.",
        status: "Upcoming",
        applicationLink: "https://cets.apsche.ap.gov.in/",
        officialWebsite: "https://cets.apsche.ap.gov.in/",
    },

    {
        id: "ts-icet",
        name: "TG ICET",
        category: "Management",
        level: "State",
        eligibility: "Bachelor's Degree",
        mode: "Online",
        duration: "2.5 Hours",
        conductedBy: "TSCHE",
        frequency: "Once a Year",
        description:
            "Telangana entrance examination for MBA and MCA admissions.",
        status: "Upcoming",
    },


    // ======================================================
    // ENGINEERING - ADDITIONAL
    // ======================================================

    {
        id: "viteee",
        name: "VITEEE",
        category: "Engineering",
        level: "University",
        eligibility: "12th with PCM/PCB",
        mode: "Online",
        duration: "2.5 Hours",
        conductedBy: "VIT",
        frequency: "Once a Year",
        description:
            "University-level engineering entrance examination for admission to VIT campuses.",
        status: "Upcoming",
    },

    {
        id: "bitsat",
        name: "BITSAT",
        category: "Engineering",
        level: "University",
        eligibility: "12th with PCM/PCB",
        mode: "Online",
        duration: "3 Hours",
        conductedBy: "BITS Pilani",
        frequency: "Multiple Sessions",
        description:
            "University-level entrance examination for undergraduate programs at BITS Pilani campuses.",
        status: "Upcoming",
    },

    {
        id: "srmjeee",
        name: "SRMJEEE",
        category: "Engineering",
        level: "University",
        eligibility: "12th with PCM/PCB",
        mode: "Online",
        duration: "2.5 Hours",
        conductedBy: "SRM Institute of Science and Technology",
        frequency: "Multiple Phases",
        description:
            "University-level entrance examination for engineering admissions at SRM institutions.",
        status: "Upcoming",
    },

];

export default exams;

export function getUpcomingExamCount() {
    return exams.filter(
        (exam) => exam?.status === "Upcoming"
    ).length;
}