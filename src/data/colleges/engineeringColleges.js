const engineeringColleges = [

    // ======================================================
    // GOVERNMENT / PUBLIC ENGINEERING COLLEGES
    // ======================================================

    {
        id: "iit_madras",
        name: "Indian Institute of Technology Madras",
        ownership: "government",
        category: "engineering",
        location: "Chennai",
        state: "Tamil Nadu",
        course: "B.Tech",
    },

    {
        id: "iit_delhi",
        name: "Indian Institute of Technology Delhi",
        ownership: "government",
        category: "engineering",
        location: "New Delhi",
        state: "Delhi",
        course: "B.Tech",
    },

    {
        id: "iit_bombay",
        name: "Indian Institute of Technology Bombay",
        ownership: "government",
        category: "engineering",
        location: "Mumbai",
        state: "Maharashtra",
        course: "B.Tech",
    },

    {
        id: "iit_kanpur",
        name: "Indian Institute of Technology Kanpur",
        ownership: "government",
        category: "engineering",
        location: "Kanpur",
        state: "Uttar Pradesh",
        course: "B.Tech",
    },

    {
        id: "iit_kharagpur",
        name: "Indian Institute of Technology Kharagpur",
        ownership: "government",
        category: "engineering",
        location: "Kharagpur",
        state: "West Bengal",
        course: "B.Tech",
    },

    {
        id: "iit_roorkee",
        name: "Indian Institute of Technology Roorkee",
        ownership: "government",
        category: "engineering",
        location: "Roorkee",
        state: "Uttarakhand",
        course: "B.Tech",
    },

    {
        id: "iit_hyderabad",
        name: "Indian Institute of Technology Hyderabad",
        ownership: "government",
        category: "engineering",
        location: "Hyderabad",
        state: "Telangana",
        course: "B.Tech",
    },

    {
        id: "iit_guwahati",
        name: "Indian Institute of Technology Guwahati",
        ownership: "government",
        category: "engineering",
        location: "Guwahati",
        state: "Assam",
        course: "B.Tech",
    },

    {
        id: "iit_bhu",
        name: "Indian Institute of Technology (BHU) Varanasi",
        ownership: "government",
        category: "engineering",
        location: "Varanasi",
        state: "Uttar Pradesh",
        course: "B.Tech",
    },

    {
        id: "iit_indore",
        name: "Indian Institute of Technology Indore",
        ownership: "government",
        category: "engineering",
        location: "Indore",
        state: "Madhya Pradesh",
        course: "B.Tech",
    },

    {
        id: "nit_trichy",
        name: "National Institute of Technology Tiruchirappalli",
        ownership: "government",
        category: "engineering",
        location: "Tiruchirappalli",
        state: "Tamil Nadu",
        course: "B.Tech",
    },

    {
        id: "nit_rourkela",
        name: "National Institute of Technology Rourkela",
        ownership: "government",
        category: "engineering",
        location: "Rourkela",
        state: "Odisha",
        course: "B.Tech",
    },

    {
        id: "nit_surathkal",
        name: "National Institute of Technology Karnataka",
        ownership: "government",
        category: "engineering",
        location: "Surathkal",
        state: "Karnataka",
        course: "B.Tech",
    },

    {
        id: "nit_warangal",
        name: "National Institute of Technology Warangal",
        ownership: "government",
        category: "engineering",
        location: "Warangal",
        state: "Telangana",
        course: "B.Tech",
    },

    {
        id: "iiit_allahabad",
        name: "Indian Institute of Information Technology Allahabad",
        ownership: "government",
        category: "engineering",
        location: "Prayagraj",
        state: "Uttar Pradesh",
        course: "B.Tech",
    },


    // ======================================================
    // PRIVATE / DEEMED ENGINEERING COLLEGES
    // ======================================================

    {
        id: "bits_pilani",
        name: "Birla Institute of Technology and Science, Pilani",
        ownership: "private",
        category: "engineering",
        location: "Pilani",
        state: "Rajasthan",
        course: "B.E.",
    },

    {
        id: "iiit_hyderabad",
        name: "International Institute of Information Technology Hyderabad",
        ownership: "private",
        category: "engineering",
        location: "Hyderabad",
        state: "Telangana",
        course: "B.Tech",
    },

    {
        id: "bit_mesra",
        name: "Birla Institute of Technology Mesra",
        ownership: "private",
        category: "engineering",
        location: "Ranchi",
        state: "Jharkhand",
        course: "B.Tech",
    },

    {
        id: "srm",
        name: "SRM Institute of Science and Technology",
        ownership: "private",
        category: "engineering",
        location: "Chennai",
        state: "Tamil Nadu",
        course: "B.Tech",
    },

    {
        id: "psg",
        name: "PSG College of Technology",
        ownership: "private",
        category: "engineering",
        location: "Coimbatore",
        state: "Tamil Nadu",
        course: "B.E.",
    },

    {
        id: "bmsce",
        name: "B.M.S. College of Engineering",
        ownership: "private",
        category: "engineering",
        location: "Bengaluru",
        state: "Karnataka",
        course: "B.E.",
    },

    {
        id: "manipal",
        name: "Manipal Institute of Technology",
        ownership: "private",
        category: "engineering",
        location: "Manipal",
        state: "Karnataka",
        course: "B.Tech",
    },

    {
        id: "sathyabama",
        name: "Sathyabama Institute of Science and Technology",
        ownership: "private",
        category: "engineering",
        location: "Chennai",
        state: "Tamil Nadu",
        course: "B.E. / B.Tech",
    },

    {
        id: "msrit",
        name: "M.S. Ramaiah Institute of Technology",
        ownership: "private",
        category: "engineering",
        location: "Bengaluru",
        state: "Karnataka",
        course: "B.E.",
    },

    {
        id: "rvce",
        name: "R.V. College of Engineering",
        ownership: "private",
        category: "engineering",
        location: "Bengaluru",
        state: "Karnataka",
        course: "B.E.",
    },

    {
        id: "nirma",
        name: "Nirma University",
        ownership: "private",
        category: "engineering",
        location: "Ahmedabad",
        state: "Gujarat",
        course: "B.Tech",
    },

    {
        id: "vit",
        name: "Vellore Institute of Technology",
        ownership: "private",
        category: "engineering",
        location: "Vellore",
        state: "Tamil Nadu",
        course: "B.Tech",
    },

    {
        id: "kiit",
        name: "Kalinga Institute of Industrial Technology",
        ownership: "private",
        category: "engineering",
        location: "Bhubaneswar",
        state: "Odisha",
        course: "B.Tech",
    },

    {
        id: "chandigarh_university",
        name: "Chandigarh University",
        ownership: "private",
        category: "engineering",
        location: "Mohali",
        state: "Punjab",
        course: "B.E. / B.Tech",
    },

    {
        id: "symbiosis",
        name: "Symbiosis Institute of Technology",
        ownership: "private",
        category: "engineering",
        location: "Pune",
        state: "Maharashtra",
        course: "B.Tech",
    },

];

export default engineeringColleges;